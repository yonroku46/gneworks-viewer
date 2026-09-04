'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import SlideDialog from '@/components/dialog/SlideDialog';
import SiteDetailDialog from '@/components/dialog/SiteDetailDialog';
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
  // Open Add Site Dialog
  const handleOpenAddSite = () => {
    setEditingSite(null);
    setSelectedSite(null);
    setSiteFormData({
      name: '',
      address: '',
      contactPhone: '',
    });
    setIsDetailOpen(false);
    setIsSiteFormOpen(true);
  };

  // Open Edit Site Dialog (상세 다이얼로그에서 진입 시 상세는 닫고 수정 폼 오픈)
  const handleOpenEditSite = (site: SiteInfo) => {
    setEditingSite(site);
    setSelectedSite(site);
    setSiteFormData({
      name: site.name,
      address: site.address,
      contactPhone: site.contactPhone || '',
    });
    setIsDetailOpen(false);
    setIsSiteFormOpen(true);
  };

  // Close Site Form Dialog (상세에서 진입했으면 상세 다이얼로그로 복귀)
  const handleCloseSiteForm = () => {
    setIsSiteFormOpen(false);
    setEditingSite(null);
    if (selectedSite) {
      setIsDetailOpen(true);
    }
  };

  // Open Detail Dialog
  const handleOpenDetail = (site: SiteInfo, defaultTab: 'households' | 'workers' = 'households') => {
    setSelectedSite(site);
    setSiteDetailTab(defaultTab);
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

      const updatedSite: SiteInfo = {
        ...editingSite,
        name: updatedName,
        address: updatedAddress,
        contactPhone: updatedPhone,
      };

      const updated = sites.map(s => (s.id === editingSite.id ? updatedSite : s));

      setSites(updated);
      saveStoredSites(updated);
      setSelectedSite(updatedSite);

      setIsSiteFormOpen(false);
      setEditingSite(null);
      setIsDetailOpen(true);

      enqueueSnackbar(`[${updatedName}] 현장 정보가 수정되었습니다.`, { variant: 'success' });
      return;
    }

    // 2. Create New Site
    const newSite: SiteInfo = {
      id: `site_${dayjs().valueOf()}`,
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
      setSelectedSite(null);
      setEditingSite(null);
      enqueueSnackbar(`[${site.name}] 현장이 삭제되었습니다.`, { variant: 'success' });
    }
  };



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
            <span className="chip-label">지역 담당자</span>
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
        onClose={handleCloseSiteForm}
        title={editingSite ? '현장 정보 수정' : '신규 현장 등록'}
        className="manage-page"
        footer={
          <div className="dialog-btn-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCloseSiteForm}
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

      {/* ── SLIDE DIALOG: SITE DETAIL & HOUSEHOLD MANAGEMENT (공통 컴포넌트) ── */}
      <SiteDetailDialog
        isOpen={isDetailOpen && !!selectedSite}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSite(null);
        }}
        site={selectedSite}
        initialTab={siteDetailTab}
        showDeleteButton
        showEditButton
        onEditSite={handleOpenEditSite}
        onDeleteSite={handleDeleteSite}
        onSiteUpdated={(updated) => {
          setSelectedSite(updated);
          setSites(prev => prev.map(s => s.id === updated.id ? updated : s));
        }}
      />
    </div>
  );
}
