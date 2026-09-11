'use client';

import React, { useState, useMemo, useEffect } from 'react';
import SlideDialog from './SlideDialog';
import CustomSelect from '@/components/common/CustomSelect';
import { CheckCircle2, Building2, AlertCircle, X, ChevronDown, ChevronRight } from 'lucide-react';
import AdminService from '@/api/service/AdminService';
import PortalService from '@/api/service/PortalService';
import './RegionAssignDialog.scss';

interface RegionAssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignedRegions: UserAssignedRegionDetail[];
  sites?: SiteDetail[];
  fireRegions?: FireRegion[];
  mode?: 'admin' | 'portal';
  onAssignRegion: (sido: string, sigungu: string, regionId?: string) => Promise<void> | void;
  onUnassignRegion: (region: UserAssignedRegionDetail) => Promise<void> | void;
}

export default function RegionAssignDialog({
  isOpen,
  onClose,
  assignedRegions,
  fireRegions: propFireRegions,
  mode,
  onAssignRegion,
  onUnassignRegion,
}: RegionAssignDialogProps) {
  const [fireRegions, setFireRegions] = useState<FireRegion[]>(propFireRegions || []);
  const [displayedSites, setDisplayedSites] = useState<SiteDetail[]>([]);
  const [totalSites, setTotalSites] = useState<number>(0);
  const [totalHouseholds, setTotalHouseholds] = useState<number>(0);
  const [isLoadingSites, setIsLoadingSites] = useState<boolean>(false);

  const isPortal = useMemo(() => {
    if (mode) return mode === 'portal';
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/portal');
    }
    return false;
  }, [mode]);

  useEffect(() => {
    if (propFireRegions && propFireRegions.length > 0) {
      setFireRegions(propFireRegions);
      return;
    }
    if (isOpen) {
      const fetcher = isPortal ? PortalService.getFireRegions() : AdminService.getFireRegions();
      fetcher
        .then(list => setFireRegions(list || []))
        .catch(err => console.error('[RegionAssignDialog] getFireRegions error:', err));
    }
  }, [isOpen, propFireRegions, isPortal]);

  const [selectedSido, setSelectedSido] = useState('경기도');
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [isCurrentAssignedOpen, setIsCurrentAssignedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 다이얼로그 닫힐 때 상태 리셋
  useEffect(() => {
    if (!isOpen) {
      setIsCurrentAssignedOpen(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // DB 소방관할 데이터 기반 시/도 목록
  const sidoList = useMemo(() => {
    const set = new Set<string>();
    fireRegions.forEach(fr => {
      if (fr.sidoName) set.add(fr.sidoName);
    });
    const list = Array.from(set);
    return list.length > 0 ? list : ['경기도'];
  }, [fireRegions]);

  // 시/도 옵션 목록
  const sidoOptions = useMemo(() => {
    return sidoList.map(s => ({
      value: s,
      label: s,
    }));
  }, [sidoList]);

  // 선택된 시/도의 DB 소방관할구역 목록
  const availableFireRegions = useMemo(() => {
    return fireRegions.filter(fr => fr.sidoName === selectedSido);
  }, [fireRegions, selectedSido]);

  // 소방관할구역 옵션 목록
  const fireRegionOptions = useMemo(() => {
    return availableFireRegions.map(fr => ({
      value: fr.regionId,
      label: fr.name,
    }));
  }, [availableFireRegions]);

  // 시/도 변경 시 소방관할구역 자동 첫 항목 선택
  const handleSidoChange = (sido: string) => {
    setSelectedSido(sido);
    const regions = fireRegions.filter(fr => fr.sidoName === sido);
    if (regions.length > 0) {
      setSelectedRegionId(regions[0].regionId);
    } else {
      setSelectedRegionId('');
    }
  };

  // 선택된 소방관할구역의 FireRegion 정보
  const targetFireRegion = useMemo(() => {
    if (!selectedRegionId) {
      return availableFireRegions[0];
    }
    return availableFireRegions.find(fr => fr.regionId === selectedRegionId) || availableFireRegions[0];
  }, [availableFireRegions, selectedRegionId]);

  // 초기 selectedRegionId 설정
  useEffect(() => {
    if (availableFireRegions.length > 0 && !selectedRegionId) {
      setSelectedRegionId(availableFireRegions[0].regionId);
    }
  }, [availableFireRegions, selectedRegionId]);

  // 배정 지역 변경 시 현재 담당 지역 섹션 자동 펼치기
  useEffect(() => {
    if (isOpen && assignedRegions.length > 0) {
      setIsCurrentAssignedOpen(true);
    }
  }, [isOpen, assignedRegions.length]);

  // 이미 배정된 지역 객체 찾기 (DB regionId 엄격 매칭)
  const currentAssignedItem = useMemo(() => {
    if (!targetFireRegion?.regionId) return undefined;
    return assignedRegions.find(r => r.regionId && r.regionId === targetFireRegion.regionId);
  }, [assignedRegions, targetFireRegion]);

  const isAlreadyAssigned = !!currentAssignedItem;

  // 지역 선택 변경 시: 전체 현장을 퍼오지 않고 API에서 limit 10건 및 요약 집계(숫자)만 정밀 취득
  useEffect(() => {
    if (!isOpen) return;

    const regionId = targetFireRegion?.regionId;
    let isMounted = true;
    setIsLoadingSites(true);

    if (isPortal) {
      Promise.all([
        PortalService.getSites({ regionId, limit: 10, includeHouseholds: false }),
        regionId ? PortalService.getRegionSummary(regionId).catch(() => null) : Promise.resolve(null),
      ])
        .then(([sitesRes, summaryRes]) => {
          if (!isMounted) return;
          const list = Array.isArray(sitesRes) ? sitesRes : [];
          setDisplayedSites(list);
          setTotalSites(summaryRes?.totalSites ?? list.length);
          setTotalHouseholds(summaryRes?.totalTarget ?? 0);
        })
        .catch(err => {
          if (!isMounted) return;
          console.error('[RegionAssignDialog] Portal site/summary error:', err);
          setDisplayedSites([]);
          setTotalSites(0);
          setTotalHouseholds(0);
        })
        .finally(() => {
          if (isMounted) setIsLoadingSites(false);
        });
    } else {
      Promise.all([
        AdminService.getSiteListPaged({ regionId, page: 1, size: 10 }),
        regionId ? AdminService.getDashboardSummary({ regionId }).catch(() => null) : Promise.resolve(null),
      ])
        .then(([sitesRes, summaryRes]) => {
          if (!isMounted) return;
          const list = sitesRes?.list || [];
          setDisplayedSites(list);
          setTotalSites(sitesRes?.totalCount || list.length);
          setTotalHouseholds(summaryRes?.totalTarget || 0);
        })
        .catch(err => {
          if (!isMounted) return;
          console.error('[RegionAssignDialog] Admin site/summary error:', err);
          setDisplayedSites([]);
          setTotalSites(0);
          setTotalHouseholds(0);
        })
        .finally(() => {
          if (isMounted) setIsLoadingSites(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetFireRegion?.regionId, isPortal]);

  // 배정하기 제출 핸들러 (regionId 엄격 전달)
  const handleAssignSubmit = async () => {
    if (!targetFireRegion?.regionId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAssignRegion(
        targetFireRegion.sidoName,
        targetFireRegion.name,
        targetFireRegion.regionId
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 10건 초과 시 '외 N건' 표시 계산
  const remainingCount = Math.max(0, totalSites - displayedSites.length);

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={onClose}
      title="담당 소방관할 배정 관리"
      className="region-assign-slide-dialog"
      footer={
        <div className="dialog-action-buttons">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            닫기
          </button>
          {isAlreadyAssigned ? (
            <button
              type="button"
              className="btn-already-assigned"
              disabled
            >
              <CheckCircle2 size={16} />
              <span>이미 배정된 관할구역입니다</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-submit-assign"
              disabled={isSubmitting || !targetFireRegion}
              onClick={handleAssignSubmit}
            >
              {isSubmitting ? '배정 등록 중...' : `[${targetFireRegion?.sidoName || selectedSido} ${targetFireRegion?.name || ''}] 배정 등록`}
            </button>
          )}
        </div>
      }
    >
      <div className="region-assign-dialog-body">
        {/* ── CURRENT ASSIGNED REGIONS (현재 담당 지역 - 아코디언) ── */}
        <div className="current-assigned-section">
          <div
            className="section-summary-toggle"
            onClick={() => setIsCurrentAssignedOpen(prev => !prev)}
            role="button"
            tabIndex={0}
          >
            <div className="label-left">
              <span className="section-label">현재 담당 소방관할</span>
              <span className="badge-total">{assignedRegions.length}개</span>
            </div>
            <ChevronDown
              size={16}
              className={`toggle-chevron ${isCurrentAssignedOpen ? 'expanded' : ''}`}
            />
          </div>

          {isCurrentAssignedOpen && (
            assignedRegions.length > 0 ? (
              <div className="assigned-chips-row">
                {assignedRegions.map(reg => {
                  const isSelected = Boolean(
                    reg.regionId && targetFireRegion?.regionId && reg.regionId === targetFireRegion.regionId
                  );

                  return (
                    <div
                      key={reg.assignedRegionId || reg.regionId}
                      className={`assigned-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        if (reg.sido) setSelectedSido(reg.sido);
                        if (reg.regionId) setSelectedRegionId(reg.regionId);
                      }}
                    >
                      <span className="chip-name">{reg.sido} {reg.sigungu}</span>
                      <button
                        type="button"
                        className="btn-chip-remove"
                        title="배정 해제"
                        disabled={isSubmitting}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (isSubmitting) return;
                          setIsSubmitting(true);
                          try {
                            await onUnassignRegion(reg);
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-assigned-text">현재 배정된 담당 지역이 없습니다. 아래에서 소방관할을 선택하여 등록하세요.</p>
            )
          )}
        </div>

        {/* ── REGION PICKER CARD ── */}
        <div className="region-picker-card">
          <div className="picker-header-row">
            <span className="picker-title">소방관할구역 선택</span>
            <div className="picker-breadcrumb">
              <span className="crumb-sido">{selectedSido}</span>
              <ChevronRight size={13} className="crumb-arrow" />
              <span className="crumb-sigungu">{targetFireRegion?.name || '선택'}</span>
            </div>
          </div>

          <div className="picker-inputs-grid">
            <div className="picker-field">
              <span className="field-hint">시·도</span>
              <CustomSelect
                fullWidth
                sizeVariant="md"
                value={selectedSido}
                options={sidoOptions}
                onChange={e => handleSidoChange(e.target.value)}
              />
            </div>

            <div className="picker-field">
              <span className="field-hint">소방관할서</span>
              <CustomSelect
                fullWidth
                sizeVariant="md"
                value={targetFireRegion?.regionId || ''}
                options={fireRegionOptions}
                disabled={fireRegionOptions.length === 0}
                onChange={e => setSelectedRegionId(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── INCLUDED SITES TABLE ── */}
        <div className="included-sites-section">
          <div className="section-header-row">
            <div className="title-group">
              <span className="section-title">관할 내 등록 현장</span>
              <span className="site-count-badge">총 {totalSites}개소</span>
            </div>

            <div className="summary-inline-stats">
              <div className="stat-pill">
                <span className="pill-label">보급 세대</span>
                <strong className="pill-val">{totalHouseholds.toLocaleString()}세대</strong>
              </div>
            </div>
          </div>

          {isLoadingSites ? (
            <div className="sites-loading-box">
              <div className="loading-spinner-sm" />
              <span>관할 현장 목록을 불러오는 중...</span>
            </div>
          ) : displayedSites.length > 0 ? (
            <div className="sites-compact-table-wrap">
              <table className="sites-compact-table">
                <thead>
                  <tr>
                    <th className="col-num">#</th>
                    <th className="col-name">현장명</th>
                    <th className="col-addr">주소</th>
                    <th className="col-scale">단지 규모</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSites.map((site, index) => {
                    const householdsCount = site.totalHouseholds ?? site.households?.length ?? 0;

                    return (
                      <tr key={site.siteId}>
                        <td className="col-num">
                          <span className="row-index">{index + 1}</span>
                        </td>
                        <td className="col-name">
                          <strong className="site-name-text">{site.name}</strong>
                        </td>
                        <td className="col-addr">
                          <div className="addr-wrapper">
                            <span className="full-addr-text">{site.address}</span>
                          </div>
                        </td>
                        <td className="col-scale">
                          <div className="scale-wrapper">
                            <span className="dong-text">{site.dongCount}개 동</span>
                            <span className="ho-text">
                              <strong>{householdsCount}</strong>세대
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {remainingCount > 0 && (
                    <tr className="more-sites-row">
                      <td colSpan={4}>
                        <div className="more-sites-content">
                          <span className="more-text">
                            외 <strong>{remainingCount}</strong>건 (총 {totalSites}개소)
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-sites-box">
              <Building2 size={24} className="no-sites-icon" />
              <p className="no-sites-msg">현재 선택된 관할({selectedSido} {targetFireRegion?.name || ''})에 등록된 현장이 없습니다.</p>
              <p className="no-sites-sub">관리자가 현장을 등록하면 자동으로 연동됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </SlideDialog>
  );
}
