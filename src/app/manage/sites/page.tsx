'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import SlideDialog from '@/components/dialog/SlideDialog';
import SiteDetailDialog from '@/components/dialog/SiteDetailDialog';
import TableLoadingRow from '@/components/common/TableLoadingRow';
import AdminService from '@/api/service/AdminService';
import { useSnackbar } from 'notistack';
import { 
  Building2, 
  Plus, 
  Users,
  Search,
} from 'lucide-react';
import RegionSelector from '@/components/common/RegionSelector';
import CustomSelect from '@/components/common/CustomSelect';
import { useManageRegion } from '@/providers/ManageRegionProvider';
import SearchInput from '@/components/common/SearchInput';
import { useDaumPostcodePopup, Address } from 'react-daum-postcode';
import { normalizeSidoName, cleanRegionName } from '@/utils/addressUtils';
import { isRegionMatch } from '@/data/koreaRegions';
import '../ManageLayout.scss';

export default function ManageCustomers() {
  const { enqueueSnackbar } = useSnackbar();

  // State for site data from backend API
  const [sites, setSites] = useState<SiteDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [regionWorkersMap, setRegionWorkersMap] = useState<Record<string, RegionWorkerUser[]>>({});
  const [fireRegions, setFireRegions] = useState<FireRegion[]>([]);

  // Region State for Common RegionSelector (Global Shared State)
  const { region, setRegion } = useManageRegion();
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog Controls
  const [isSiteFormOpen, setIsSiteFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<SiteDetail>();
  const [editingSite, setEditingSite] = useState<SiteDetail>();

  // Detail Modal Tab: 'households' | 'workers'
  const [siteDetailTab, setSiteDetailTab] = useState<'households' | 'workers'>('households');

  // Site Form State
  const [siteFormData, setSiteFormData] = useState<{
    name: string;
    address: string;
    sido: string;
    sigungu: string;
    eupmyeondong: string;
    regionId: string;
    region: string;
    contactPhone: string;
  }>({
    name: '',
    address: '',
    sido: '',
    sigungu: '',
    eupmyeondong: '',
    regionId: '',
    region: '',
    contactPhone: '',
  });

  // Daum Postcode Popup hook
  const openPostcode = useDaumPostcodePopup();

  // Load Fire Regions on mount
  useEffect(() => {
    AdminService.getFireRegions()
      .then(list => setFireRegions(list))
      .catch(err => console.error('Failed to load fire regions:', err));
  }, []);

  // Load Sites from Backend
  const loadSites = useCallback(async () => {
    try {
      setIsLoading(true);
      const siteList = await AdminService.getSiteList({
        sido: region.sido !== 'ALL' ? region.sido : undefined,
        sigungu: region.sigungu !== 'ALL' ? region.sigungu : undefined,
        eupmyeondong: region.eupmyeondong !== 'ALL' ? region.eupmyeondong : undefined,
      });
      setSites(siteList);

      // 현장들의 고유 regionId 수집 및 작업자 목록 로드
      const regionIdSet = new Set<string>();
      siteList.forEach(s => {
        if (s.regionId) regionIdSet.add(s.regionId);
      });

      const workersMap: Record<string, RegionWorkerUser[]> = {};
      await Promise.all(
        Array.from(regionIdSet).map(async (regionId) => {
          try {
            const workers = await AdminService.getRegionWorkers({ regionId });
            workersMap[regionId] = workers;
          } catch {
            workersMap[regionId] = [];
          }
        })
      );
      setRegionWorkersMap(workersMap);
    } catch (error: any) {
      console.error('Failed to load sites:', error);
      enqueueSnackbar('현장 목록을 불러오는데 실패했습니다.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [region, enqueueSnackbar]);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  // 특정 현장의 담당 작업자 목록 조회 (regionId 릴레이션십 기준)
  const getWorkersForSite = useCallback((site: SiteDetail): RegionWorkerUser[] => {
    if (!site.regionId) return [];
    return regionWorkersMap[site.regionId] || [];
  }, [regionWorkersMap]);

  // Filtered Sites (by Search query)
  const filteredSites = useMemo(() => {
    if (!searchQuery.trim()) return sites;
    const q = searchQuery.toLowerCase();
    return sites.filter(site =>
      site.name.toLowerCase().includes(q) ||
      site.address.toLowerCase().includes(q)
    );
  }, [sites, searchQuery]);

  // Summary Metrics (Sites, Households, Regional Worker count)
  const metrics = useMemo(() => {
    const totalSites = filteredSites.length;
    const totalHouseholds = filteredSites.reduce((sum, s) => sum + (s.totalHouseholds || 0), 0);
    const totalDongs = filteredSites.reduce((sum, s) => sum + (s.dongCount || 0), 0);

    const uniqueWorkerIds = new Set<string>();
    filteredSites.forEach(s => {
      const workers = getWorkersForSite(s);
      workers.forEach(w => uniqueWorkerIds.add(w.userId));
    });
    const totalWorkers = uniqueWorkerIds.size;

    return { totalSites, totalHouseholds, totalDongs, totalWorkers };
  }, [filteredSites, getWorkersForSite]);

  // Handle Daum Postcode Complete
  const handleCompletePostcode = (data: Address) => {
    let fullAddress = data.roadAddress || data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    const normalizedSido = normalizeSidoName(data.sido);
    const sigungu = data.sigungu || '';
    const eupmyeondong = data.bname || '';

    // Match fire regions from loaded fireRegions
    const matched = fireRegions.filter(fr => {
      const sidoMatch = fr.sidoName === normalizedSido || fr.sidoName.includes(normalizedSido) || normalizedSido.includes(fr.sidoName);
      if (!sidoMatch) return false;
      const cleanSg = cleanRegionName(sigungu);
      const cleanFr = cleanRegionName(fr.name);
      return cleanSg && cleanFr && (cleanSg.includes(cleanFr) || cleanFr.includes(cleanSg));
    });

    const matchedRegionId = matched.length > 0 ? matched[0].regionId : '';
    const matchedRegionName = matched.length > 0 ? matched[0].name : sigungu;

    setSiteFormData(prev => ({
      ...prev,
      address: fullAddress,
      sido: normalizedSido,
      sigungu: sigungu,
      eupmyeondong: eupmyeondong,
      regionId: matchedRegionId,
      region: matchedRegionName,
      name: prev.name.trim() ? prev.name : (data.buildingName ? data.buildingName : prev.name),
    }));
  };

  const handleSearchAddress = () => {
    openPostcode({ onComplete: handleCompletePostcode });
  };

  // Available fire regions for currently selected/parsed sido
  const availableFireRegions = useMemo(() => {
    if (!siteFormData.sido) return [];
    return fireRegions.filter(fr => {
      return (
        fr.sidoName === siteFormData.sido ||
        fr.sidoName.includes(siteFormData.sido) ||
        siteFormData.sido.includes(fr.sidoName)
      );
    });
  }, [fireRegions, siteFormData.sido]);

  // Open Add Site Dialog
  const handleOpenAddSite = () => {
    setEditingSite(undefined);
    setSelectedSite(undefined);
    setSiteFormData({
      name: '',
      address: '',
      sido: '',
      sigungu: '',
      eupmyeondong: '',
      regionId: '',
      region: '',
      contactPhone: '',
    });
    setIsDetailOpen(false);
    setIsSiteFormOpen(true);
  };

  // Open Edit Site Dialog (상세 다이얼로그에서 진입 시 상세는 닫고 수정 폼 오픈)
  const handleOpenEditSite = (site: SiteDetail) => {
    setEditingSite(site);
    setSelectedSite(site);
    setSiteFormData({
      name: site.name,
      address: site.address,
      sido: site.sido || '',
      sigungu: site.sigungu || '',
      eupmyeondong: site.eupmyeondong || '',
      regionId: site.regionId || '',
      region: site.region || site.sigungu || '',
      contactPhone: site.contactPhone || '',
    });
    setIsDetailOpen(false);
    setIsSiteFormOpen(true);
  };

  // Close Site Form Dialog (상세에서 진입했으면 상세 다이얼로그로 복귀)
  const handleCloseSiteForm = () => {
    setIsSiteFormOpen(false);
    setEditingSite(undefined);
    if (selectedSite) {
      setIsDetailOpen(true);
    }
  };

  // Open Detail Dialog
  const handleOpenDetail = async (site: SiteDetail, defaultTab: 'households' | 'workers' = 'households') => {
    try {
      // 최신 상세 데이터 로드 (세대 목록 및 배정 담당자 포함)
      const detail = await AdminService.getSiteDetail(site.siteId);
      if (!detail.assignedWorkers || detail.assignedWorkers.length === 0) {
        const fallbackWorkers = getWorkersForSite(site);
        if (fallbackWorkers.length > 0) {
          detail.assignedWorkers = fallbackWorkers;
        }
      }
      setSelectedSite(detail);
    } catch {
      setSelectedSite({ ...site, assignedWorkers: getWorkersForSite(site) });
    }
    setSiteDetailTab(defaultTab);
    setIsDetailOpen(true);
  };

  // Submit Site Create / Edit
  const handleSubmitSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteFormData.name.trim()) {
      enqueueSnackbar('현장(아파트)명을 입력해 주세요.', { variant: 'error' });
      return;
    }
    if (!siteFormData.address.trim()) {
      enqueueSnackbar('도로명 주소를 검색하여 입력해 주세요.', { variant: 'error' });
      return;
    }

    const fullAddress = siteFormData.address.trim();

    try {
      if (editingSite) {
        // 1. Edit Existing Site
        await AdminService.updateSite(editingSite.siteId, {
          name: siteFormData.name.trim(),
          address: fullAddress,
          sido: siteFormData.sido || editingSite.sido,
          sigungu: siteFormData.sigungu || editingSite.sigungu,
          eupmyeondong: siteFormData.eupmyeondong || editingSite.eupmyeondong,
          region: siteFormData.region || editingSite.region || siteFormData.sigungu,
          regionId: siteFormData.regionId || editingSite.regionId,
          contactPhone: siteFormData.contactPhone.trim() || undefined,
        });

        enqueueSnackbar(`[${siteFormData.name.trim()}] 현장 정보가 수정되었습니다.`, { variant: 'success' });
        setIsSiteFormOpen(false);
        setEditingSite(undefined);
        await loadSites();
        if (selectedSite) {
          const updated = await AdminService.getSiteDetail(selectedSite.siteId);
          setSelectedSite(updated);
          setIsDetailOpen(true);
        }
      } else {
        // 2. Create New Site
        const sidoVal = siteFormData.sido || (region.sido !== 'ALL' ? region.sido : '경기도');
        const sigunguVal = siteFormData.sigungu || (region.sigungu !== 'ALL' ? region.sigungu : '연천군');
        const eupVal = siteFormData.eupmyeondong || (region.eupmyeondong !== 'ALL' ? region.eupmyeondong : '연천읍');
        const regionName = siteFormData.region || sigunguVal;

        await AdminService.createSite({
          name: siteFormData.name.trim(),
          address: fullAddress,
          sido: sidoVal,
          sigungu: sigunguVal,
          eupmyeondong: eupVal,
          region: regionName,
          regionId: siteFormData.regionId || undefined,
          contactPhone: siteFormData.contactPhone.trim() || undefined,
        });

        enqueueSnackbar(`신규 현장 [${siteFormData.name.trim()}]이 등록되었습니다.`, { variant: 'success' });
        setIsSiteFormOpen(false);
        await loadSites();
      }
    } catch (error: any) {
      console.error('Failed to submit site:', error);
      enqueueSnackbar('현장 정보를 저장하는데 실패했습니다.', { variant: 'error' });
    }
  };

  // Delete Site
  const handleDeleteSite = async (site: SiteDetail) => {
    if (!confirm(`[${site.name}] 현장과 등록된 모든 세대 데이터를 정말 삭제하시겠습니까?`)) {
      return;
    }
    try {
      await AdminService.deleteSite(site.siteId);
      enqueueSnackbar(`[${site.name}] 현장이 삭제되었습니다.`, { variant: 'success' });
      setIsDetailOpen(false);
      setSelectedSite(undefined);
      setEditingSite(undefined);
      await loadSites();
    } catch (error: any) {
      console.error('Failed to delete site:', error);
      enqueueSnackbar('현장 삭제에 실패했습니다.', { variant: 'error' });
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
            {isLoading ? (
              <TableLoadingRow colSpan={7} message="현장 목록을 불러오는 중입니다..." />
            ) : filteredSites.length > 0 ? (
              filteredSites.map((site, idx) => {
                const workers = getWorkersForSite(site);
                return (
                  <tr
                    key={site.siteId || `site_${idx}`}
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
                      {workers.length === 0 ? (
                        <span 
                          className="unassigned-badge clickable" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(site, 'workers');
                          }}
                          title="해당 지역에 배정된 담당자가 없습니다. 클릭 시 지역 담당자 현황으로 이동"
                        >
                          미배정
                        </span>
                      ) : (
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
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr key="empty-sites">
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
          {/* 주소 검색 필드 */}
          <div className="form-field">
            <label>도로명 주소 <span className="req">*</span></label>
            <div className="address-input-group">
              <input
                type="text"
                placeholder="주소 검색 버튼을 눌러 도로명 주소를 입력하세요"
                required
                readOnly
                value={siteFormData.address}
                onClick={handleSearchAddress}
              />
              <button
                type="button"
                className="btn-search-address"
                onClick={handleSearchAddress}
              >
                <Search size={15} />
                <span>주소 검색</span>
              </button>
            </div>
          </div>

          {/* 주소 검색 후 파싱된 행정구역 & 소방관할 영역 */}
          {siteFormData.sido ? (
            <div className="parsed-region-card">
              <div className="region-tags-row">
                <span className="region-tag">
                  <span className="tag-label">시·도</span>
                  <strong>{siteFormData.sido}</strong>
                </span>
                <span className="region-tag">
                  <span className="tag-label">시·군·구</span>
                  <strong>{siteFormData.sigungu || '전체'}</strong>
                </span>
                {siteFormData.eupmyeondong && (
                  <span className="region-tag">
                    <span className="tag-label">읍·면·동</span>
                    <strong>{siteFormData.eupmyeondong}</strong>
                  </span>
                )}
              </div>

              {availableFireRegions.length > 0 && (
                <div className="region-fire-select-row">
                  <label>관할 소방서</label>
                  <CustomSelect
                    sizeVariant="md"
                    fullWidth
                    value={siteFormData.regionId}
                    onChange={e => {
                      const selected = availableFireRegions.find(fr => fr.regionId === e.target.value);
                      setSiteFormData(prev => ({
                        ...prev,
                        regionId: e.target.value,
                        region: selected ? selected.name : prev.region,
                      }));
                    }}
                  >
                    <option value="">소방관할서 선택 (미선택 시 시군구명 적용)</option>
                    {availableFireRegions.map(fr => (
                      <option key={fr.regionId} value={fr.regionId}>
                        {fr.name}소방서 (관할: {fr.name})
                      </option>
                    ))}
                  </CustomSelect>
                </div>
              )}
            </div>
          ) : (
            <p className="address-help-tip">
              * [주소 검색] 버튼을 누르시면 시도/시군구 및 관할 소방서가 자동으로 설정됩니다.
            </p>
          )}


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
          setSelectedSite(undefined);
        }}
        site={selectedSite}
        initialTab={siteDetailTab}
        showDeleteButton
        showEditButton
        onEditSite={handleOpenEditSite}
        onDeleteSite={handleDeleteSite}
        onSiteUpdated={(updated) => {
          setSelectedSite(updated);
          setSites(prev => prev.map(s => s.siteId === updated.siteId ? updated : s));
        }}
      />
    </div>
  );
}
