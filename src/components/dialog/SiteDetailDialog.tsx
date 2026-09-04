'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { Search, Plus, Trash2, X, Info, Phone } from 'lucide-react';
import { useSnackbar } from 'notistack';
import SlideDialog from './SlideDialog';
import StatusBadge from '@/components/common/StatusBadge';
import CustomSelect from '@/components/common/CustomSelect';
import { Household, SiteInfo } from '@/data/siteData';
import { getStoredSites, saveStoredSites } from '@/data/siteStorage';
import { getRegionWorkers } from '@/data/regionStorage';

export interface SiteDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteInfo | null;
  initialTab?: 'households' | 'workers';
  showDeleteButton?: boolean;
  showEditButton?: boolean;
  onEditSite?: (site: SiteInfo) => void;
  onDeleteSite?: (site: SiteInfo) => void;
  onSiteUpdated?: (updatedSite: SiteInfo) => void;
}

const formatDong = (dong: string) => {
  if (!dong) return '';
  return dong.endsWith('동') ? dong : `${dong}동`;
};

const formatHo = (ho: string) => {
  if (!ho) return '';
  return ho.endsWith('호') ? ho : `${ho}호`;
};

export default function SiteDetailDialog({
  isOpen,
  onClose,
  site: initialSite,
  initialTab = 'households',
  showDeleteButton = true,
  showEditButton = true,
  onEditSite,
  onDeleteSite,
  onSiteUpdated,
}: SiteDetailDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

  // Current Site State (실시간 동기화)
  const [currentSite, setCurrentSite] = useState<SiteInfo | null>(initialSite);
  useEffect(() => {
    setCurrentSite(initialSite);
  }, [initialSite]);

  const site = currentSite || initialSite;

  // Tabs & Search Controls
  const [siteDetailTab, setSiteDetailTab] = useState<'households' | 'workers'>(initialTab);
  const [householdSearch, setHouseholdSearch] = useState('');
  const [workersTabSearch, setWorkersTabSearch] = useState('');

  // Add Household State
  const [isAddHouseholdOpen, setIsAddHouseholdOpen] = useState(false);
  const [newHousehold, setNewHousehold] = useState<{
    seq: string;
    dong: string;
    ho: string;
    headName: string;
    targetType: Household['targetType'];
    remarks: string;
  }>({
    seq: '',
    dong: '',
    ho: '',
    headName: '',
    targetType: '일반',
    remarks: '',
  });

  // 내장 현장 정보 수정 모달 상태 (외부에서 onEditSite를 넘기지 않았을 때 자체 지원)
  const [isInternalEditOpen, setIsInternalEditOpen] = useState(false);
  const [siteFormData, setSiteFormData] = useState({
    name: '',
    address: '',
    contactPhone: '',
  });

  // Reset internal states on open
  useEffect(() => {
    if (isOpen) {
      setSiteDetailTab(initialTab);
      setHouseholdSearch('');
      setWorkersTabSearch('');
      setIsAddHouseholdOpen(false);
    }
  }, [isOpen, initialTab, site?.id]);

  // Filtered Households
  const filteredHouseholds = useMemo(() => {
    if (!site) return [];
    const query = householdSearch.trim().toLowerCase();
    if (!query) return site.households;

    return site.households.filter(h => {
      const seqVal = (h.seq !== undefined && h.seq !== null) ? h.seq.toString() : '';
      const dongFormatted = `${h.dong}동`;
      const hoFormatted = `${h.ho}호`;
      return (
        (seqVal && seqVal.includes(query)) ||
        h.dong.toLowerCase().includes(query) ||
        dongFormatted.toLowerCase().includes(query) ||
        h.ho.toLowerCase().includes(query) ||
        hoFormatted.toLowerCase().includes(query) ||
        h.headName.toLowerCase().includes(query) ||
        (h.remarks && h.remarks.toLowerCase().includes(query))
      );
    });
  }, [site, householdSearch]);

  // Handle Delete Household
  const handleDeleteHousehold = (household: Household) => {
    if (!site) return;
    const dongHoStr = `${formatDong(household.dong)} ${formatHo(household.ho)}`;
    if (!confirm(`[${dongHoStr}] 세대 정보를 정말 삭제하시겠습니까?`)) {
      return;
    }

    const updatedHouseholds = site.households.filter(h => h.id !== household.id);
    const dongSet = new Set(updatedHouseholds.map(h => h.dong));

    const updatedSite: SiteInfo = {
      ...site,
      households: updatedHouseholds,
      dongList: Array.from(dongSet).sort(),
      dongCount: dongSet.size || 1,
      totalHouseholds: updatedHouseholds.length,
    };

    setCurrentSite(updatedSite);
    const allSites = getStoredSites();
    const nextSites = allSites.map(s => (s.id === updatedSite.id ? updatedSite : s));
    saveStoredSites(nextSites);

    if (onSiteUpdated) {
      onSiteUpdated(updatedSite);
    }
    enqueueSnackbar(`[${dongHoStr}] 세대가 삭제되었습니다.`, { variant: 'info' });
  };

  // Handle Add Household
  const handleAddHousehold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!site) return;

    if (!newHousehold.dong.trim() || !newHousehold.ho.trim()) {
      enqueueSnackbar('동과 호수를 입력해 주세요.', { variant: 'error' });
      return;
    }

    const seqVal = newHousehold.seq.trim()
      ? (isNaN(Number(newHousehold.seq.trim())) ? newHousehold.seq.trim() : Number(newHousehold.seq.trim()))
      : undefined;

    const newH: Household = {
      id: `hh_${site.id}_${dayjs().valueOf()}`,
      seq: seqVal,
      dong: newHousehold.dong.trim(),
      ho: newHousehold.ho.trim(),
      headName: newHousehold.headName.trim() || '세대주',
      targetType: newHousehold.targetType,
      installStatus: '미설치',
      remarks: newHousehold.remarks.trim() || undefined,
    };

    const updatedHouseholds = [newH, ...site.households];
    const dongSet = new Set(site.dongList);
    dongSet.add(newH.dong);

    const total = updatedHouseholds.length;

    const updatedSite: SiteInfo = {
      ...site,
      households: updatedHouseholds,
      dongList: Array.from(dongSet).sort(),
      dongCount: dongSet.size,
      totalHouseholds: total,
    };

    setCurrentSite(updatedSite);
    const allSites = getStoredSites();
    const nextSites = allSites.map(s => (s.id === updatedSite.id ? updatedSite : s));
    saveStoredSites(nextSites);

    if (onSiteUpdated) {
      onSiteUpdated(updatedSite);
    }

    setNewHousehold({
      seq: '',
      dong: '',
      ho: '',
      headName: '',
      targetType: '일반',
      remarks: '',
    });
    setIsAddHouseholdOpen(false);
    enqueueSnackbar(`[${formatDong(newH.dong)} ${formatHo(newH.ho)}] 세대(연번: ${newH.seq})가 추가되었습니다.`, { variant: 'success' });
  };

  // Handle Edit Site trigger
  const handleEditClick = () => {
    if (!site) return;
    if (onEditSite) {
      onEditSite(site);
    } else {
      setSiteFormData({
        name: site.name,
        address: site.address,
        contactPhone: site.contactPhone || '',
      });
      setIsInternalEditOpen(true);
    }
  };

  // Handle Internal Edit Submit
  const handleSubmitInternalEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!site) return;

    if (!siteFormData.name.trim()) {
      enqueueSnackbar('현장(아파트)명을 입력해 주세요.', { variant: 'error' });
      return;
    }
    if (!siteFormData.address.trim()) {
      enqueueSnackbar('도로명 주소를 입력해 주세요.', { variant: 'error' });
      return;
    }

    const updatedName = siteFormData.name.trim();
    const updatedAddress = siteFormData.address.trim();
    const updatedPhone = siteFormData.contactPhone.trim() || site.contactPhone;

    const updatedSite: SiteInfo = {
      ...site,
      name: updatedName,
      address: updatedAddress,
      contactPhone: updatedPhone,
    };

    setCurrentSite(updatedSite);
    const allSites = getStoredSites();
    const nextSites = allSites.map(s => (s.id === updatedSite.id ? updatedSite : s));
    saveStoredSites(nextSites);

    if (onSiteUpdated) {
      onSiteUpdated(updatedSite);
    }

    setIsInternalEditOpen(false);
    enqueueSnackbar(`[${updatedName}] 현장 정보가 수정되었습니다.`, { variant: 'success' });
  };

  if (!site) return null;

  return (
    <>
      <SlideDialog
        isOpen={isOpen && !isInternalEditOpen}
        onClose={onClose}
        title={site ? `${site.name} 상세 관리` : '현장 상세 정보'}
        className="manage-page site-detail-dialog"
        footer={
          site ? (
            <div className="site-detail-footer-actions">
              {showDeleteButton && (
                <button
                  type="button"
                  className="btn-delete-site"
                  onClick={() => {
                    if (onDeleteSite) {
                      onDeleteSite(site);
                    } else if (confirm(`[${site.name}] 현장과 등록된 모든 세대 데이터를 삭제하시겠습니까?`)) {
                      const allSites = getStoredSites();
                      const next = allSites.filter(s => s.id !== site.id);
                      saveStoredSites(next);
                      onClose();
                      enqueueSnackbar(`[${site.name}] 현장이 삭제되었습니다.`, { variant: 'success' });
                    }
                  }}
                >
                  <span>현장 삭제</span>
                </button>
              )}
              {showEditButton && (
                <button
                  type="button"
                  className="btn-edit-site"
                  onClick={handleEditClick}
                >
                  <span>현장 정보 수정</span>
                </button>
              )}
            </div>
          ) : undefined
        }
      >
        <div className="site-detail-modal">
          {/* Top Site Header Summary */}
          <div className="site-detail-header-card">
            <div className="site-header-left">
              <h3>{site.name}</h3>
              <div className="site-address-sub">
                <span>{site.address} ({site.sigungu} {site.eupmyeondong})</span>
              </div>
            </div>
            <div className="site-header-stats">
              <div className="stat-pill">
                <span className="stat-label">단지 규모</span>
                <span className="stat-val">{site.dongCount}개 동</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">총 세대수</span>
                <span className="stat-val">{site.totalHouseholds}세대</span>
              </div>
            </div>
          </div>

          {/* Tabs Bar: 세대 관리 / 배정 담당자 */}
          <div className="site-detail-tabs-bar">
            <button
              type="button"
              className={`detail-tab-btn ${siteDetailTab === 'households' ? 'active' : ''}`}
              onClick={() => setSiteDetailTab('households')}
            >
              <span>세대 관리</span>
              <span className="tab-count-badge">{site.households.length}</span>
            </button>
            <button
              type="button"
              className={`detail-tab-btn ${siteDetailTab === 'workers' ? 'active' : ''}`}
              onClick={() => setSiteDetailTab('workers')}
            >
              <span>지역 담당자</span>
              <span className="tab-count-badge">{getRegionWorkers(site.sido, site.sigungu).length}</span>
            </button>
          </div>

          {/* Tab 1: 세대 관리 Content */}
          {siteDetailTab === 'households' ? (
            <>
              {/* Household Filter & Action Bar */}
              <div className="household-controls-bar">
                <div className="controls-left">
                  <div className="household-search-input">
                    <Search size={15} />
                    <input
                      type="text"
                      placeholder="동, 호수, 세대주, 연번으로 빠른 검색..."
                      value={householdSearch}
                      onChange={e => setHouseholdSearch(e.target.value)}
                    />
                    {householdSearch && (
                      <button
                        type="button"
                        className="btn-clear-search"
                        onClick={() => setHouseholdSearch('')}
                        title="검색어 지우기"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-add-household"
                  onClick={() => setIsAddHouseholdOpen(!isAddHouseholdOpen)}
                >
                  <Plus size={14} />
                  <span>세대 추가</span>
                </button>
              </div>

              {/* Collapsible Add Household Form */}
              {isAddHouseholdOpen && (
                <form className="add-household-inline-form" onSubmit={handleAddHousehold}>
                  <div className="inline-form-grid">
                    <div className="field-box">
                      <label>연번</label>
                      <input
                        type="text"
                        placeholder={`예: ${site.households.length + 1}`}
                        value={newHousehold.seq}
                        onChange={e => setNewHousehold(prev => ({ ...prev, seq: e.target.value }))}
                      />
                    </div>
                    <div className="field-box">
                      <label>동 *</label>
                      <input
                        type="text"
                        placeholder="예: 101"
                        required
                        value={newHousehold.dong}
                        onChange={e => setNewHousehold(prev => ({ ...prev, dong: e.target.value }))}
                      />
                    </div>
                    <div className="field-box">
                      <label>호수 *</label>
                      <input
                        type="text"
                        placeholder="예: 101호"
                        required
                        value={newHousehold.ho}
                        onChange={e => setNewHousehold(prev => ({ ...prev, ho: e.target.value }))}
                      />
                    </div>
                    <div className="field-box">
                      <label>세대주 성명</label>
                      <input
                        type="text"
                        placeholder="예: 홍길동"
                        value={newHousehold.headName}
                        onChange={e => setNewHousehold(prev => ({ ...prev, headName: e.target.value }))}
                      />
                    </div>
                    <div className="field-box">
                      <label>보급대상 유형</label>
                      <CustomSelect
                        fullWidth
                        sizeVariant="md"
                        value={newHousehold.targetType}
                        onChange={e => setNewHousehold(prev => ({ ...prev, targetType: e.target.value as any }))}
                      >
                        <option value="일반">일반</option>
                        <option value="노인(65세 이상)">노인(65세 이상)</option>
                        <option value="아동(13세 미만)">아동(13세 미만)</option>
                        <option value="장애인">장애인</option>
                      </CustomSelect>
                    </div>
                    <div className="field-box span-2">
                      <label>비고</label>
                      <input
                        type="text"
                        placeholder="특이사항 메모"
                        value={newHousehold.remarks}
                        onChange={e => setNewHousehold(prev => ({ ...prev, remarks: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="inline-form-actions">
                    <button type="button" className="btn-inline-cancel" onClick={() => setIsAddHouseholdOpen(false)}>
                      취소
                    </button>
                    <button type="submit" className="btn-inline-submit">
                      세대 등록
                    </button>
                  </div>
                </form>
              )}

              {/* Households Table List */}
              <div className="households-table-container">
                <table className="households-table">
                  <thead>
                    <tr>
                      <th className="col-num">연번</th>
                      <th>동 / 호수</th>
                      <th>세대주</th>
                      <th>보급 대상 유형</th>
                      <th>설치 상태</th>
                      <th>비고</th>
                      <th style={{ width: '50px', textAlign: 'center' }}>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHouseholds.length > 0 ? (
                      filteredHouseholds.map((household, idx) => (
                        <tr key={household.id}>
                          <td className="col-num">
                            <span className="row-index">{household.seq ?? (idx + 1)}</span>
                          </td>
                          <td className="col-unit">
                            <strong>{formatDong(household.dong)} {formatHo(household.ho)}</strong>
                          </td>
                          <td className="col-head">
                            <span>{household.headName}</span>
                          </td>
                          <td className="col-type">
                            <span className="target-type-tag">
                              {household.targetType}
                            </span>
                          </td>
                          <td className="col-status">
                            <StatusBadge status={household.installStatus} />
                          </td>
                          <td className="col-remarks">
                            <span className={`remarks-text ${!household.remarks ? 'empty' : ''}`}>
                              {household.remarks || '없음'}
                            </span>
                          </td>
                          <td className="col-actions">
                            <button
                              type="button"
                              className="btn-delete-hh"
                              title="세대 삭제"
                              onClick={() => handleDeleteHousehold(household)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="empty-households">
                          조회된 세대 정보가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* Tab 2: 지역 담당자 Content (행정구역 단위 귀속) */
            <div className="assigned-workers-tab-content">
              {(() => {
                const regionWorkers = getRegionWorkers(site.sido, site.sigungu);
                const filteredTabWorkers = regionWorkers.filter(w =>
                  !workersTabSearch.trim() ||
                  w.userName.toLowerCase().includes(workersTabSearch.toLowerCase()) ||
                  w.userId.toLowerCase().includes(workersTabSearch.toLowerCase()) ||
                  (w.userPhone && w.userPhone.includes(workersTabSearch))
                );
                return (
                  <>
                    {/* 지역 담당자 귀속 안내 배너 */}
                    <div className="region-worker-notice-card">
                      <Info size={18} className="notice-icon" />
                      <div className="notice-body">
                        <strong>{site.sido} {site.sigungu} 지역 담당 작업자</strong>
                        <p>
                          작업자는 개별 아파트가 아닌 <strong>행정구역(시·도 / 시·군·구)</strong> 단위로 귀속됩니다.
                          현재 <strong>[{site.sido} {site.sigungu}]</strong> 지역으로 등록된 작업자들이 본 현장의 모든 설치 및 점검을 담당합니다.
                        </p>
                      </div>
                    </div>

                    {/* Workers Search Controls Bar */}
                    <div className="household-controls-bar">
                      <div className="controls-left">
                        <div className="household-search-input">
                          <Search size={15} />
                          <input
                            type="text"
                            placeholder="담당자 성명, 아이디, 연락처 검색..."
                            value={workersTabSearch}
                            onChange={e => setWorkersTabSearch(e.target.value)}
                          />
                          {workersTabSearch && (
                            <button
                              type="button"
                              className="btn-clear-search"
                              onClick={() => setWorkersTabSearch('')}
                              title="검색어 지우기"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Workers Table List */}
                    <div className="households-table-container">
                      <table className="households-table">
                        <thead>
                          <tr>
                            <th className="col-num">순번</th>
                            <th>담당자 성명</th>
                            <th>아이디</th>
                            <th>연락처</th>
                            <th>배정지역</th>
                            <th style={{ width: '100px', textAlign: 'center' }}>배정일자</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTabWorkers.length > 0 ? (
                            filteredTabWorkers.map((worker, idx) => (
                              <tr key={worker.userId}>
                                <td className="col-num">
                                  <span className="row-index">{idx + 1}</span>
                                </td>
                                <td className="col-worker-name">
                                  <div className="worker-table-cell">
                                    <div className="worker-avatar-sm">
                                      {worker.userName.charAt(0)}
                                    </div>
                                    <strong>{worker.userName}</strong>
                                  </div>
                                </td>
                                <td className="col-worker-id">
                                  <span className="worker-id-text">{worker.userId}</span>
                                </td>
                                <td className="col-worker-phone">
                                  {worker.userPhone ? (
                                    <a href={`tel:${worker.userPhone}`} className="worker-phone-link">
                                      <Phone size={13} />
                                      <span>{worker.userPhone}</span>
                                    </a>
                                  ) : (
                                    <span className="worker-phone-link empty">연락처 미등록</span>
                                  )}
                                </td>
                                <td className="col-region-name">
                                  <span className="region-name-tag">{worker.regionName}</span>
                                </td>
                                <td style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                                  <span>{worker.assignedDate || '—'}</span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="empty-households">
                                {regionWorkers.length === 0 ? `현재 [${site.sido} ${site.sigungu}] 지역에 배정된 담당자가 없습니다.` : '조회된 담당자 정보가 없습니다.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </SlideDialog>

      {/* ── 내장 현장 정보 수정 모달 ── */}
      {site && (
        <SlideDialog
          isOpen={isInternalEditOpen}
          onClose={() => setIsInternalEditOpen(false)}
          title="현장 정보 수정"
          className="manage-page"
          footer={
            <div className="dialog-btn-group">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsInternalEditOpen(false)}
              >
                취소
              </button>
              <button type="submit" form="internal-site-edit-form" className="btn-save">
                수정 완료
              </button>
            </div>
          }
        >
          <form id="internal-site-edit-form" className="site-dialog-form" onSubmit={handleSubmitInternalEdit}>
            <div className="form-field">
              <label>현장(아파트)명 <span className="req">*</span></label>
              <input
                type="text"
                placeholder="예: 연천 조흥아파트"
                required
                value={siteFormData.name}
                onChange={e => setSiteFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="form-field">
              <label>도로명 주소 <span className="req">*</span></label>
              <input
                type="text"
                placeholder="예: 경기도 연천군 연천읍 차옥로 81"
                required
                value={siteFormData.address}
                onChange={e => setSiteFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="form-field">
              <label>관리사무소 / 대표 연락처</label>
              <input
                type="text"
                placeholder="예: 031-839-2119"
                value={siteFormData.contactPhone}
                onChange={e => setSiteFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </div>
          </form>
        </SlideDialog>
      )}
    </>
  );
}
