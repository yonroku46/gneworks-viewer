'use client';

import React, { useState, useMemo, useEffect } from 'react';
import SlideDialog from '@/components/dialog/SlideDialog';
import { useSnackbar } from 'notistack';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone,
  Users,
  X,
  Info,
  MapPin,
} from 'lucide-react';
import { INITIAL_SITES_DATA, SiteInfo, Household } from '@/data/siteData';
import { getStoredSites, saveStoredSites, subscribeToSitesUpdate } from '@/data/siteStorage';
import { getRegionWorkers, RegionWorker } from '@/data/regionStorage';
import CustomSelect from '@/components/common/CustomSelect';
import RegionSelector from '@/components/common/RegionSelector';
import { useManageRegion } from '@/providers/ManageRegionProvider';
import SearchInput from '@/components/common/SearchInput';
import StatusBadge from '@/components/common/StatusBadge';
import '../ManageLayout.scss';

const formatDong = (dong: string) => {
  if (!dong) return '';
  return dong.endsWith('동') ? dong : `${dong}동`;
};

const formatHo = (ho: string) => {
  if (!ho) return '';
  return ho.endsWith('호') ? ho : `${ho}호`;
};

export default function ManageCustomers() {
  const { enqueueSnackbar } = useSnackbar();

  // State for site data with persistence
  const [sites, setSites] = useState<SiteInfo[]>(() => {
    if (typeof window !== 'undefined') {
      return getStoredSites();
    }
    return INITIAL_SITES_DATA;
  });

  useEffect(() => {
    setSites(getStoredSites());
    const unsubscribe = subscribeToSitesUpdate(updatedSites => {
      setSites(updatedSites);
    });
    return () => unsubscribe();
  }, []);

  // Region State for Common RegionSelector (Global Shared State)
  const { region, setRegion } = useManageRegion();

  const [searchQuery, setSearchQuery] = useState('');

  // Dialog Controls
  const [isSiteFormOpen, setIsSiteFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<SiteInfo | null>(null);
  const [editingSite, setEditingSite] = useState<SiteInfo | null>(null);

  // Detail Modal Tab: 'households' | 'workers'
  const [siteDetailTab, setSiteDetailTab] = useState<'households' | 'workers'>('households');
  const [workersTabSearch, setWorkersTabSearch] = useState('');

  // Household Filter inside detail modal
  const [householdSearch, setHouseholdSearch] = useState('');

  // Add Household inside detail modal
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

  // Site Form State
  const [siteFormData, setSiteFormData] = useState<{
    name: string;
    address: string;
    contactPhone: string;
  }>({
    name: '',
    address: '',
    contactPhone: '',
  });

  // Filtered Sites (by Region & Search query)
  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      const matchSido = region.sido === 'ALL' || site.sido === region.sido;
      const matchSigungu = region.sigungu === 'ALL' || site.sigungu === region.sigungu;
      const matchEup = region.eupmyeondong === 'ALL' || (site.eupmyeondong && site.eupmyeondong.includes(region.eupmyeondong));
      const matchSearch =
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.address.toLowerCase().includes(searchQuery.toLowerCase());

      return matchSido && matchSigungu && matchEup && matchSearch;
    });
  }, [sites, region, searchQuery]);

  // Summary Metrics (Sites, Households, Regional Worker count)
  const metrics = useMemo(() => {
    const totalSites = filteredSites.length;
    const totalHouseholds = filteredSites.reduce((sum, s) => sum + s.totalHouseholds, 0);
    const totalDongs = filteredSites.reduce((sum, s) => sum + s.dongCount, 0);

    // 현재 조회된 지역들의 고유 담당 작업자 수 집계
    const uniqueWorkerIds = new Set<string>();
    filteredSites.forEach(s => {
      const workers = getRegionWorkers(s.sido, s.sigungu);
      workers.forEach(w => uniqueWorkerIds.add(w.userId));
    });
    const totalWorkers = uniqueWorkerIds.size;

    return { totalSites, totalHouseholds, totalDongs, totalWorkers };
  }, [filteredSites]);

  // Open Add Site Dialog
  const handleOpenAddSite = () => {
    setEditingSite(null);
    setSiteFormData({
      name: '',
      address: '',
      contactPhone: '',
    });
    setIsSiteFormOpen(true);
  };

  // Open Edit Site Dialog
  const handleOpenEditSite = (site: SiteInfo) => {
    setEditingSite(site);
    setSiteFormData({
      name: site.name,
      address: site.address,
      contactPhone: site.contactPhone || '',
    });
    setIsSiteFormOpen(true);
  };

  // Open Detail Dialog
  const handleOpenDetail = (site: SiteInfo, defaultTab: 'households' | 'workers' = 'households') => {
    setSelectedSite(site);
    setSiteDetailTab(defaultTab);
    setHouseholdSearch('');
    setWorkersTabSearch('');
    setIsAddHouseholdOpen(false);
    setIsDetailOpen(true);
  };

  // Submit Site Create / Edit
  const handleSubmitSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteFormData.name.trim()) {
      enqueueSnackbar('현장(아파트)명을 입력해 주세요.', { variant: 'error' });
      return;
    }
    if (!siteFormData.address.trim()) {
      enqueueSnackbar('도로명 주소를 입력해 주세요.', { variant: 'error' });
      return;
    }

    // 1. Edit Existing Site
    if (editingSite) {
      const updatedName = siteFormData.name.trim();
      const updatedAddress = siteFormData.address.trim();
      const updatedPhone = siteFormData.contactPhone.trim() || editingSite.contactPhone;

      const updated = sites.map(s => {
        if (s.id === editingSite.id) {
          return {
            ...s,
            name: updatedName,
            address: updatedAddress,
            contactPhone: updatedPhone,
          };
        }
        return s;
      });

      setSites(updated);
      saveStoredSites(updated);

      setSelectedSite(prev => {
        if (prev && prev.id === editingSite.id) {
          return {
            ...prev,
            name: updatedName,
            address: updatedAddress,
            contactPhone: updatedPhone,
          };
        }
        return prev;
      });

      enqueueSnackbar(`[${updatedName}] 현장 정보가 수정되었습니다.`, { variant: 'success' });
      setIsSiteFormOpen(false);
      setEditingSite(null);
      return;
    }

    // 2. Create New Site
    const newSite: SiteInfo = {
      id: `site_${Date.now()}`,
      name: siteFormData.name.trim(),
      address: siteFormData.address.trim(),
      region: region.sigungu !== 'ALL' ? region.sigungu : '연천군',
      sido: region.sido !== 'ALL' ? region.sido : '경기도',
      sigungu: region.sigungu !== 'ALL' ? region.sigungu : '연천군',
      eupmyeondong: region.eupmyeondong !== 'ALL' ? region.eupmyeondong : '연천읍',
      routeGroup: `${region.sigungu !== 'ALL' ? region.sigungu : '연천군'} 권역`,
      dongCount: 1,
      dongList: ['101'],
      totalHouseholds: 0,
      completedHouseholds: 0,
      contactPhone: siteFormData.contactPhone.trim() || '031-839-2119',
      status: '대기',
      workCompletedCount: 0,
      households: [],
    };
    const updated = [newSite, ...sites];
    setSites(updated);
    saveStoredSites(updated);
    enqueueSnackbar(`신규 현장 [${newSite.name}]이 등록되었습니다.`, { variant: 'success' });
    setIsSiteFormOpen(false);
  };

  // Delete Site
  const handleDeleteSite = (site: SiteInfo) => {
    if (confirm(`[${site.name}] 현장과 등록된 모든 세대 데이터를 삭제하시겠습니까?`)) {
      const updated = sites.filter(s => s.id !== site.id);
      setSites(updated);
      saveStoredSites(updated);
      setIsDetailOpen(false);
      enqueueSnackbar(`[${site.name}] 현장이 삭제되었습니다.`, { variant: 'success' });
    }
  };

  // Delete Household inside detail modal
  const handleDeleteHousehold = (householdId: string) => {
    if (!selectedSite) return;
    const updatedHouseholds = selectedSite.households.filter(h => h.id !== householdId);
    const dongSet = new Set(updatedHouseholds.map(h => h.dong));

    const updatedSite: SiteInfo = {
      ...selectedSite,
      households: updatedHouseholds,
      dongList: Array.from(dongSet).sort(),
      dongCount: dongSet.size || 1,
      totalHouseholds: updatedHouseholds.length,
    };

    setSelectedSite(updatedSite);
    const updated = sites.map(s => (s.id === updatedSite.id ? updatedSite : s));
    setSites(updated);
    saveStoredSites(updated);
    enqueueSnackbar('세대가 삭제되었습니다.', { variant: 'info' });
  };

  // Add Household Submit
  const handleAddHousehold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSite) return;

    if (!newHousehold.dong.trim() || !newHousehold.ho.trim()) {
      enqueueSnackbar('동과 호수를 입력해 주세요.', { variant: 'error' });
      return;
    }

    const seqVal = newHousehold.seq.trim()
      ? (isNaN(Number(newHousehold.seq.trim())) ? newHousehold.seq.trim() : Number(newHousehold.seq.trim()))
      : undefined;

    const newH: Household = {
      id: `hh_${selectedSite.id}_${Date.now()}`,
      seq: seqVal,
      dong: newHousehold.dong.trim(),
      ho: newHousehold.ho.trim(),
      headName: newHousehold.headName.trim() || '세대주',
      targetType: newHousehold.targetType,
      installStatus: '미설치',
      remarks: newHousehold.remarks.trim() || undefined,
    };

    const updatedHouseholds = [newH, ...selectedSite.households];
    const dongSet = new Set(selectedSite.dongList);
    dongSet.add(newH.dong);

    const total = updatedHouseholds.length;

    const updatedSite: SiteInfo = {
      ...selectedSite,
      households: updatedHouseholds,
      dongList: Array.from(dongSet).sort(),
      dongCount: dongSet.size,
      totalHouseholds: total,
    };

    setSelectedSite(updatedSite);
    const updated = sites.map(s => (s.id === updatedSite.id ? updatedSite : s));
    setSites(updated);
    saveStoredSites(updated);

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


  // Filtered Households in Detail View
  const filteredHouseholds = useMemo(() => {
    if (!selectedSite) return [];
    const query = householdSearch.trim().toLowerCase();
    if (!query) return selectedSite.households;

    return selectedSite.households.filter(h => {
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
  }, [selectedSite, householdSearch]);

  return (
    <div className="manage-sites-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-header-row">
        <div>
          <h2>현장 리스트</h2>
          <p>행정구역별 보급 대상 아파트 현장을 관리합니다.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAddSite}>
          <Plus size={18} />
          <span>신규 현장 등록</span>
        </button>
      </div>

      {/* ── UNIFIED SITES SUMMARY BAR ── */}
      <div className="sites-summary-unified-bar">
        <div className="summary-main-col">
          <div className="summary-icon">
            <Building2 size={22} />
          </div>
          <div className="summary-main-info">
            <span className="summary-label">총 관리 현장</span>
            <strong className="summary-val">{metrics.totalSites}개소</strong>
          </div>
        </div>
        <div className="summary-sub-chips">
          <div className="summary-sub-chip">
            <span className="chip-label">총 관리단지</span>
            <strong className="chip-val">{metrics.totalDongs}개 동</strong>
          </div>
          <div className="summary-sub-chip">
            <span className="chip-label">총 보급대상</span>
            <strong className="chip-val highlight">{metrics.totalHouseholds.toLocaleString()}세대</strong>
          </div>
          <div className="summary-sub-chip">
            <span className="chip-label">해당지역 담당자</span>
            <strong className="chip-val highlight">{metrics.totalWorkers}명</strong>
          </div>
        </div>
      </div>

      {/* ── 1. COMMON REGION SELECTOR BAR ── */}
      <RegionSelector
        value={region}
        onChange={newRegion => setRegion(newRegion)}
      />

      {/* ── 2. SEARCH BAR ── */}
      <div className="sites-search-filter-bar">
        <SearchInput
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="아파트명 또는 도로명 주소로 검색..."
          fullWidth
        />
      </div>

      {/* ── 3. SITE TABLE LIST VIEW (PURE SITE MANAGEMENT) ── */}
      <div className="site-table-wrapper">
        <table className="site-table">
          <thead>
            <tr>
              <th className="col-num">순번</th>
              <th className="col-name">현장 (아파트명)</th>
              <th className="col-addr">도로명 주소</th>
              <th className="col-region">지역</th>
              <th className="col-scale">단지 규모</th>
              <th className="col-households">대상 세대</th>
              <th className="col-worker">지역 담당자</th>
            </tr>
          </thead>
          <tbody>
            {filteredSites.length > 0 ? (
              filteredSites.map((site, idx) => {
                return (
                  <tr
                    key={site.id}
                    className="site-table-row"
                    onClick={() => handleOpenDetail(site, 'households')}
                  >
                    <td className="col-num">
                      <span className="row-index">{idx + 1}</span>
                    </td>
                    <td className="col-name">
                      <strong className="site-title-text">{site.name}</strong>
                    </td>
                    <td className="col-addr">
                      <div className="site-addr-text" title={site.address}>
                        <span>{site.address}</span>
                      </div>
                    </td>
                    <td className="col-region">
                      <div className="region-tag-group">
                        <span>{site.sigungu}</span>
                        <span>{site.eupmyeondong}</span>
                      </div>
                    </td>
                    <td className="col-scale">
                      <span className="households-text">{site.dongCount}개 동</span>
                    </td>
                    <td className="col-households">
                      <span className="households-text">{site.totalHouseholds}세대</span>
                    </td>
                    <td className="col-worker">
                      {(() => {
                        const workers = getRegionWorkers(site.sido, site.sigungu);
                        if (workers.length === 0) {
                          return (
                            <span 
                              className="unassigned-badge clickable" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(site, 'workers');
                              }}
                              title="해당 지역에 배정된 담당자가 없습니다. 클릭 시 지역 담당자 현황으로 이동"
                            >
                              지역 미배정
                            </span>
                          );
                        }
                        return (
                          <span
                            className="worker-count-pill"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(site, 'workers');
                            }}
                            title={`${site.sigungu} 지역 담당자 ${workers.length}명 (${workers.map(w => w.userName).join(', ')})`}
                          >
                            <Users size={13} />
                            <span>{workers.length > 1 ? `${workers[0].userName} 외 ${workers.length - 1}명` : workers[0].userName}</span>
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  <Building2 size={36} className="empty-icon" />
                  <p>선택된 지역 및 조건에 일치하는 현장 정보가 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── SLIDE DIALOG: CREATE / EDIT SITE ── */}
      <SlideDialog
        isOpen={isSiteFormOpen}
        onClose={() => {
          setIsSiteFormOpen(false);
          setEditingSite(null);
        }}
        title={editingSite ? '현장 정보 수정' : '신규 현장 등록'}
        className="manage-page"
        footer={
          <div className="dialog-btn-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setIsSiteFormOpen(false);
                setEditingSite(null);
              }}
            >
              취소
            </button>
            <button type="submit" form="create-site-form" className="btn-save">
              {editingSite ? '수정 완료' : '현장 등록하기'}
            </button>
          </div>
        }
      >
        <form id="create-site-form" className="site-dialog-form" onSubmit={handleSubmitSite}>
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

      {/* ── SLIDE DIALOG: SITE DETAIL & HOUSEHOLD MANAGEMENT ── */}
      <SlideDialog
        isOpen={isDetailOpen && !!selectedSite}
        onClose={() => setIsDetailOpen(false)}
        title={selectedSite ? `${selectedSite.name} 상세 관리` : '현장 상세 정보'}
        className="manage-page site-detail-dialog"
        footer={
          selectedSite ? (
            <div className="site-detail-footer-actions">
              <button
                type="button"
                className="btn-delete-site"
                onClick={() => handleDeleteSite(selectedSite)}
              >
                <span>현장 삭제</span>
              </button>
              <button
                type="button"
                className="btn-edit-site"
                onClick={() => {
                  if (selectedSite) {
                    handleOpenEditSite(selectedSite);
                  }
                }}
              >
                <span>현장 정보 수정</span>
              </button>
            </div>
          ) : undefined
        }
      >
        {selectedSite && (
          <div className="site-detail-modal">
            {/* Top Site Header Summary */}
            <div className="site-detail-header-card">
              <div className="site-header-left">
                <h3>{selectedSite.name}</h3>
                <div className="site-address-sub">
                  <span>{selectedSite.address} ({selectedSite.sigungu} {selectedSite.eupmyeondong})</span>
                </div>
              </div>
              <div className="site-header-stats">
                <div className="stat-pill">
                  <span className="stat-label">단지 규모</span>
                  <span className="stat-val">{selectedSite.dongCount}개 동</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">총 세대수</span>
                  <span className="stat-val">{selectedSite.totalHouseholds}세대</span>
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
                <span className="tab-count-badge">{selectedSite.households.length}</span>
              </button>
              <button
                type="button"
                className={`detail-tab-btn ${siteDetailTab === 'workers' ? 'active' : ''}`}
                onClick={() => setSiteDetailTab('workers')}
              >
                <span>지역 담당자</span>
                <span className="tab-count-badge">{getRegionWorkers(selectedSite.sido, selectedSite.sigungu).length}</span>
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
                          placeholder={`예: ${selectedSite.households.length + 1}`}
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
                        <th style={{ width: '60px', textAlign: 'center' }}>연번</th>
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
                        filteredHouseholds.map(household => (
                          <tr key={household.id}>
                            <td className="col-seq">
                              <span className="seq-badge">{household.seq ?? '-'}</span>
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
                                onClick={() => handleDeleteHousehold(household.id)}
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
                  const regionWorkers = getRegionWorkers(selectedSite.sido, selectedSite.sigungu);
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
                          <strong>{selectedSite.sido} {selectedSite.sigungu} 지역 담당 작업자</strong>
                          <p>
                            작업자는 개별 아파트가 아닌 <strong>행정구역(시·도 / 시·군·구)</strong> 단위로 귀속됩니다.
                            현재 <strong>[{selectedSite.sido} {selectedSite.sigungu}]</strong> 지역으로 등록된 작업자들이 본 현장의 모든 설치 및 점검을 담당합니다.
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
                                  {regionWorkers.length === 0 ? `현재 [${selectedSite.sido} ${selectedSite.sigungu}] 지역에 배정된 담당자가 없습니다.` : '조회된 담당자 정보가 없습니다.'}
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
        )}
      </SlideDialog>
    </div>
  );
}
