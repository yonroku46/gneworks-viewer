'use client';

import React, { useState, useMemo, useEffect } from 'react';
import SlideDialog from './SlideDialog';
import { KOREA_ADMIN_REGIONS, isRegionMatch } from '@/data/koreaRegions';
import CustomSelect from '@/components/common/CustomSelect';
import { MapPin, Plus, CheckCircle2, Building2, AlertCircle, Trash2, X, ChevronDown, ChevronRight } from 'lucide-react';
import './RegionAssignDialog.scss';

interface RegionAssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignedRegions: UserAssignedRegionDetail[];
  sites?: SiteDetail[];
  onAssignRegion: (sido: string, sigungu: string) => Promise<void> | void;
  onUnassignRegion: (region: UserAssignedRegionDetail) => Promise<void> | void;
}

export default function RegionAssignDialog({
  isOpen,
  onClose,
  assignedRegions,
  sites = [],
  onAssignRegion,
  onUnassignRegion,
}: RegionAssignDialogProps) {
  const [selectedSido, setSelectedSido] = useState('경기도');
  const [selectedSigungu, setSelectedSigungu] = useState('수원');
  const [isCurrentAssignedOpen, setIsCurrentAssignedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 다이얼로그 닫힐 때 상태 리셋
  useEffect(() => {
    if(!isOpen) {
      setIsCurrentAssignedOpen(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // 시/도 옵션 목록
  const sidoOptions = useMemo(() => {
    return KOREA_ADMIN_REGIONS.map(s => ({
      value: s.name,
      label: s.name,
    }));
  }, []);

  // 선택된 시/도에 따른 시/군/구 옵션 목록
  const sigunguOptions = useMemo(() => {
    const sidoObj = KOREA_ADMIN_REGIONS.find(s => s.name === selectedSido);
    if (!sidoObj) return [];
    return sidoObj.sigungus.map(sg => ({
      value: sg.name,
      label: sg.name,
    }));
  }, [selectedSido]);

  // 시/도 변경 시 시/군/구 자동 첫 항목 선택
  const handleSidoChange = (sido: string) => {
    setSelectedSido(sido);
    const sidoObj = KOREA_ADMIN_REGIONS.find(s => s.name === sido);
    if (sidoObj && sidoObj.sigungus.length > 0) {
      setSelectedSigungu(sidoObj.sigungus[0].name);
    } else {
      setSelectedSigungu('');
    }
  };

  // 배정 지역 변경 시 현재 담당 지역 섹션 자동 펼치기
  useEffect(() => {
    if (isOpen && assignedRegions.length > 0) {
      setIsCurrentAssignedOpen(true);
    }
  }, [isOpen, assignedRegions.length]);

  // 이미 배정된 지역 객체 찾기 (sido+sigungu 유연 매칭)
  const currentAssignedItem = useMemo(() => {
    return assignedRegions.find(r => isRegionMatch(r.sido, r.sigungu, selectedSido, selectedSigungu));
  }, [assignedRegions, selectedSido, selectedSigungu]);

  const isAlreadyAssigned = !!currentAssignedItem;

  // 선택된 지역 내 현장 목록 (props에서 필터링)
  const regionSites = useMemo(() => {
    return sites.filter(s => isRegionMatch(s.sido, s.sigungu, selectedSido, selectedSigungu));
  }, [sites, selectedSido, selectedSigungu]);

  // 총 세대수 집계
  const totalHouseholds = useMemo(() => {
    return regionSites.reduce((sum, site) => sum + (site.totalHouseholds ?? site.households?.length ?? 0), 0);
  }, [regionSites]);

  // 등록 제출
  const handleSubmit = async () => {
    if (!selectedSido || !selectedSigungu || isAlreadyAssigned || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAssignRegion(selectedSido, selectedSigungu);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 해제 제출
  const handleUnassignCurrent = async () => {
    if (!currentAssignedItem || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onUnassignRegion(currentAssignedItem);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={onClose}
      title="담당 지역 관리"
      className="region-assign-slide-dialog"
      footer={
        <div className="region-assign-dialog-footer">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
            닫기
          </button>
          {isAlreadyAssigned ? (
            <button
              type="button"
              className="btn-unassign"
              disabled={isSubmitting}
              onClick={handleUnassignCurrent}
            >
              <span>{isSubmitting ? '해제 중...' : '이 지역 담당 해제'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-submit"
              disabled={!selectedSigungu || isSubmitting}
              onClick={handleSubmit}
            >
              <span>{isSubmitting ? '등록 중...' : '담당 지역으로 등록'}</span>
            </button>
          )}
        </div>
      }
    >
      <div className="region-assign-form">
        <div className="current-assigned-section">
          <div
            className="section-label-row clickable"
            onClick={() => setIsCurrentAssignedOpen(!isCurrentAssignedOpen)}
            role="button"
            tabIndex={0}
          >
            <div className="label-left">
              <span className="section-label">현재 담당 지역</span>
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
                  const isSelected = isRegionMatch(reg.sido, reg.sigungu, selectedSido, selectedSigungu);

                  return (
                    <div
                      key={reg.assignedRegionId}
                      className={`assigned-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedSido(reg.sido);
                        const sidoObj = KOREA_ADMIN_REGIONS.find(s => s.name === reg.sido);
                        const matched = sidoObj?.sigungus.find(sg => isRegionMatch(reg.sido, reg.sigungu, reg.sido, sg.name))?.name;
                        setSelectedSigungu(matched || reg.sigungu);
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
              <p className="no-assigned-text">현재 배정된 담당 지역이 없습니다. 아래에서 지역을 선택하여 등록하세요.</p>
            )
          )}
        </div>

        {/* ── REGION PICKER CARD (관리화면 스타일의 정돈된 필터 카드) ── */}
        <div className="region-picker-card">
          <div className="picker-header-row">
            <span className="picker-title">지역 선택</span>
            <div className="picker-breadcrumb">
              <span className="crumb-sido">{selectedSido}</span>
              <ChevronRight size={13} className="crumb-arrow" />
              <span className="crumb-sigungu">{selectedSigungu || '선택'}</span>
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
              <span className="field-hint">시·군·구</span>
              <CustomSelect
                fullWidth
                sizeVariant="md"
                value={selectedSigungu}
                options={sigunguOptions}
                disabled={sigunguOptions.length === 0}
                onChange={e => setSelectedSigungu(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── INCLUDED SITES TABLE (지역 요약과 현장 목록 헤더 통합) ── */}
        <div className="included-sites-section">
          <div className="section-header-row">
            <div className="title-group">
              <h3 className="section-title">
                {selectedSido} {selectedSigungu}의 현장 목록
              </h3>
              <div className="region-counts-tag">
                <span>{regionSites.length}개소</span>
                <span className="dot">•</span>
                <span>총 {totalHouseholds}세대</span>
              </div>
            </div>

            <div className="header-badge-group">
              {isAlreadyAssigned ? (
                <span className="badge-assigned already">
                  <AlertCircle size={13} /> 담당 중인 지역
                </span>
              ) : (
                <span className="badge-assigned available">
                  <CheckCircle2 size={13} /> 신규 배정 가능
                </span>
              )}
            </div>
          </div>

          {regionSites.length > 0 ? (
            <div className="sites-table-container">
              <table className="sites-table">
                <thead>
                  <tr>
                    <th className="col-num">순번</th>
                    <th className="col-name">현장명 (단지)</th>
                    <th className="col-addr">읍/면/동 및 주소</th>
                    <th className="col-scale">단지 규모</th>
                  </tr>
                </thead>
                <tbody>
                  {regionSites.map((site, index) => {
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
                            <span className="eup-text">{site.eupmyeondong || '-'}</span>
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
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-sites-box">
              <Building2 size={24} className="no-sites-icon" />
              <p className="no-sites-msg">현재 선택된 지역({selectedSido} {selectedSigungu})에 등록된 현장이 없습니다.</p>
              <p className="no-sites-sub">관리자가 현장을 등록하면 자동으로 연동됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </SlideDialog>
  );
}
