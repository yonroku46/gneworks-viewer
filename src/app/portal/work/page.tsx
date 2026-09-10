'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from 'notistack';
import PortalService from '@/api/service/PortalService';
import WorkReportDialog from '@/components/dialog/WorkReportDialog';
import Skeleton from '@/components/contents/Skeleton';
import {
  MapPin,
  Building2,
  Search,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDashed,
  Hourglass,
  SlidersHorizontal,
  Check,
  ArrowLeft,
} from 'lucide-react';
import './Work.scss';

export const normalizeReportStatus = (status?: string): ReportStatus => {
  if (!status) return 'UNSUBMITTED';
  const s = String(status).toUpperCase();
  if (s === 'COMPLETED' || s === 'PENDING' || s === 'REJECTED') return s as ReportStatus;
  return 'UNSUBMITTED';
};

const getStatusKey = (status?: ReportStatus | string): WorkStatusFilter => {
  const normalized = normalizeReportStatus(status);
  if (normalized === 'COMPLETED') return 'completed';
  if (normalized === 'PENDING') return 'pending';
  if (normalized === 'REJECTED') return 'revise';
  return 'unsubmitted';
};

const FILTER_OPTIONS: { value: WorkStatusFilter; label: string; shortLabel: string; dotClass?: string }[] = [
  { value: 'all', label: '전체 세대 보기', shortLabel: '전체' },
  { value: 'uncompleted', label: '미완료만 (확인완료 제외)', shortLabel: '미완료만', dotClass: 'uncompleted' },
  { value: 'unsubmitted', label: '미제출 세대 (작업대기)', shortLabel: '미제출', dotClass: 'unsubmitted' },
  { value: 'pending', label: '검토대기 세대', shortLabel: '검토대기', dotClass: 'pending' },
  { value: 'revise', label: '수정필요 세대', shortLabel: '수정필요', dotClass: 'revise' },
  { value: 'completed', label: '확인완료 세대', shortLabel: '확인완료', dotClass: 'completed' },
];

function PortalWorkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get('siteId');

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // 1단계 현장 목록 상태
  const [allSites, setAllSites] = useState<SiteDetail[]>([]);
  const [assignedRegions, setAssignedRegions] = useState<UserAssignedRegionDetail[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ALL');
  const [siteSearchQuery, setSiteSearchQuery] = useState('');
  const [isSitesLoading, setIsSitesLoading] = useState(true);

  // 2단계 선택된 현장 상세 및 세대 상태
  const [activeSiteDetail, setActiveSiteDetail] = useState<SiteDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [householdSearchQuery, setHouseholdSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkStatusFilter>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // 지역 탭 가로 스크롤 관리
  const regionTabListRef = useRef<HTMLDivElement>(null);
  const [canScrollRegionLeft, setCanScrollRegionLeft] = useState(false);
  const [canScrollRegionRight, setCanScrollRegionRight] = useState(false);

  // 보고서 작성 다이얼로그 상태
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdRes>();
  const [selectedReport, setSelectedReport] = useState<WorkReport>();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const checkRegionScrollButtons = () => {
    if (regionTabListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = regionTabListRef.current;
      setCanScrollRegionLeft(scrollLeft > 2);
      setCanScrollRegionRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkRegionScrollButtons();
    window.addEventListener('resize', checkRegionScrollButtons);
    return () => window.removeEventListener('resize', checkRegionScrollButtons);
  }, [assignedRegions]);

  const handleScrollRegionTab = (direction: 'left' | 'right') => {
    if (regionTabListRef.current) {
      const amount = 220;
      regionTabListRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
      setTimeout(checkRegionScrollButtons, 320);
    }
  };

  // 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    if (isFilterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterMenuOpen]);

  // 1. 현장 요약 목록 초기 로드
  const loadSitesSummary = useCallback(async () => {
    try {
      setIsSitesLoading(true);
      const [regions, siteList] = await Promise.all([
        PortalService.getAssignedRegions().catch(err => {
          console.error('[PortalWorkPage] getAssignedRegions error', err);
          return [];
        }),
        PortalService.getSites({ includeHouseholds: false }).catch(err => {
          console.error('[PortalWorkPage] getSites error', err);
          return [];
        }),
      ]);

      setAssignedRegions(regions || []);
      setAllSites(siteList || []);
    } finally {
      setIsSitesLoading(false);
    }
  }, []);

  // 2. 특정 현장 상세 로드
  const loadSiteDetail = useCallback(async (targetSiteId: string) => {
    try {
      setIsDetailLoading(true);
      const detail = await PortalService.getSiteDetail(targetSiteId);
      setActiveSiteDetail(detail || null);
    } catch (err) {
      console.error('[PortalWorkPage] getSiteDetail error', err);
      enqueueSnackbar('현장 상세 정보를 불러오지 못했습니다.', { variant: 'error' });
      setActiveSiteDetail(null);
    } finally {
      setIsDetailLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadSitesSummary();

    const handleRealtimeNotification = () => {
      loadSitesSummary();
      if (siteId) {
        loadSiteDetail(siteId);
      }
    };
    window.addEventListener('gneworks-notification-received', handleRealtimeNotification);
    return () => {
      window.removeEventListener('gneworks-notification-received', handleRealtimeNotification);
    };
  }, [loadSitesSummary, siteId, loadSiteDetail]);

  // URL 쿼리 파라미터(siteId) 변경 시 상세 데이터 동기화
  useEffect(() => {
    if (siteId) {
      loadSiteDetail(siteId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveSiteDetail(null);
    }
  }, [siteId, loadSiteDetail]);

  // 현장 카드 선택 핸들러 -> URL 변경으로 브라우저 히스토리 지원
  const handleSelectSite = (targetSiteId: string) => {
    setHouseholdSearchQuery('');
    setStatusFilter('all');
    router.push(`/portal/work?siteId=${encodeURIComponent(targetSiteId)}`);
  };

  // 현장 목록으로 돌아가기
  const handleBackToSites = () => {
    router.push('/portal/work');
  };

  // ── [1단계 필터링] 담당 지역에 속하는 현장 목록 ──
  const assignedSites = useMemo(() => {
    if (assignedRegions.length === 0) return [];

    return allSites.filter(site => {
      if (selectedRegionId !== 'ALL') {
        const selectedRegion = assignedRegions.find(
          r => r.assignedRegionId === selectedRegionId || r.regionId === selectedRegionId
        );
        if (!selectedRegion) return false;
        return Boolean(selectedRegion.regionId && site.regionId && site.regionId === selectedRegion.regionId);
      }

      return assignedRegions.some(r => {
        return Boolean(r.regionId && site.regionId && site.regionId === r.regionId);
      });
    });
  }, [allSites, assignedRegions, selectedRegionId]);

  // 검색어 필터링된 현장 목록
  const filteredSites = useMemo(() => {
    const q = siteSearchQuery.trim().toLowerCase();
    if (!q) return assignedSites;
    return assignedSites.filter(
      s => (s.name && s.name.toLowerCase().includes(q)) || (s.address && s.address.toLowerCase().includes(q))
    );
  }, [assignedSites, siteSearchQuery]);

  // ── [2단계 필터링] 활성 현장 내 세대 및 보고서 필터링 ──
  const filteredHouseholds = useMemo(() => {
    if (!activeSiteDetail?.households) return [];
    const query = householdSearchQuery.trim().toLowerCase();

    return activeSiteDetail.households.filter(h => {
      // 1. 검색어 필터링 (동, 호수, 세대주)
      if (query) {
        const dongFormatted = `${h.dong}동`.toLowerCase();
        const hoFormatted = `${h.ho}호`.toLowerCase();
        const dongStr = String(h.dong || '').toLowerCase();
        const hoStr = String(h.ho || '').toLowerCase();
        const headStr = String(h.headName || '').toLowerCase();

        const match =
          dongStr.includes(query) ||
          dongFormatted.includes(query) ||
          hoStr.includes(query) ||
          hoFormatted.includes(query) ||
          headStr.includes(query);

        if (!match) return false;
      }

      // 2. 상태 필터링
      if (statusFilter !== 'all') {
        const statusKey = h.reportStatus ? getStatusKey(h.reportStatus) : 'unsubmitted';
        if (statusFilter === 'uncompleted') {
          if (statusKey === 'completed') return false;
        } else if (statusKey !== statusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [activeSiteDetail, householdSearchQuery, statusFilter]);

  // 활성 현장의 세대 통계 계산
  const siteHouseholdStats = useMemo(() => {
    if (!activeSiteDetail?.households) {
      return { total: 0, completed: 0, pending: 0, revise: 0, unsubmitted: 0, rate: 0 };
    }
    const allH = activeSiteDetail.households;
    let completed = 0;
    let pending = 0;
    let revise = 0;
    let unsubmitted = 0;

    allH.forEach(h => {
      const key = h.reportStatus ? getStatusKey(h.reportStatus) : 'unsubmitted';
      if (key === 'completed') completed += 1;
      else if (key === 'pending') pending += 1;
      else if (key === 'revise') revise += 1;
      else unsubmitted += 1;
    });

    const total = allH.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, revise, unsubmitted, rate };
  }, [activeSiteDetail]);

  // 보고서 작성 다이얼로그 열기
  const handleOpenReport = async (household: HouseholdRes) => {
    if (household.reportId) {
      const isMyReport = Boolean(household.reportUserId && household.reportUserId === user?.userId);
      if (!isMyReport) {
        enqueueSnackbar('다른 작업자가 이미 완료한 보고서입니다.', { variant: 'warning' });
        return;
      }
    }

    let report: WorkReport | undefined = undefined;
    if (household.reportId) {
      try {
        const fetched = await PortalService.getReportByHouseholdId(household.householdId);
        if (fetched) report = fetched;
      } catch (err) {
        console.error('[PortalWorkPage] getReportByHouseholdId error', err);
      }
    }

    setSelectedHousehold(household);
    setSelectedReport(report);
    setIsReportDialogOpen(true);
  };

  return (
    <div className="portal-work-page">
      {/* ═══════════════════════════════════════════════════════════
          STEP 1. 현장 선택 뷰 (!siteId)
      ═══════════════════════════════════════════════════════════ */}
      {!siteId ? (
        <>
          <section className="work-header-section">
            <div className="work-title-group">
              <h2 className="work-page-title">내 담당 현장 목록</h2>
              <p className="work-page-sub">작업을 진행할 현장(단지)을 선택하세요.</p>
            </div>

            {/* 담당 지역 탭 */}
            <div className="assigned-region-tabs-container">
              <button
                type="button"
                className={`tab-scroll-btn left ${canScrollRegionLeft ? 'visible' : ''}`}
                onClick={() => handleScrollRegionTab('left')}
                disabled={!canScrollRegionLeft}
                aria-label="이전 지역 목록"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="region-tab-list" ref={regionTabListRef} onScroll={checkRegionScrollButtons}>
                {isSitesLoading ? (
                  <div className="region-tab-skeleton-list">
                    <Skeleton width={110} height={34} borderRadius={10} />
                    <Skeleton width={96} height={34} borderRadius={10} />
                    <Skeleton width={100} height={34} borderRadius={10} />
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`region-tab-btn ${selectedRegionId === 'ALL' ? 'active' : ''}`}
                      onClick={() => setSelectedRegionId('ALL')}
                    >
                      <span>전체 담당 지역</span>
                      <span className="count-badge">{assignedSites.length}</span>
                    </button>
                    {assignedRegions.map(reg => {
                      const sitesCount = allSites.filter(s => {
                        return Boolean(reg.regionId && s.regionId && s.regionId === reg.regionId);
                      }).length;

                      return (
                        <button
                          key={reg.assignedRegionId}
                          type="button"
                          className={`region-tab-btn ${selectedRegionId === reg.assignedRegionId ? 'active' : ''}`}
                          onClick={() => setSelectedRegionId(reg.assignedRegionId)}
                        >
                          <span>{reg.sido} {reg.sigungu}</span>
                          <span className="count-badge">{sitesCount}</span>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>

              <button
                type="button"
                className={`tab-scroll-btn right ${canScrollRegionRight ? 'visible' : ''}`}
                onClick={() => handleScrollRegionTab('right')}
                disabled={!canScrollRegionRight}
                aria-label="다음 지역 목록"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* 현장 검색바 */}
            <div className="work-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="현장명(단지명) 또는 도로명 주소 검색"
                value={siteSearchQuery}
                onChange={e => setSiteSearchQuery(e.target.value)}
              />
              {siteSearchQuery && (
                <button className="clear-btn" onClick={() => setSiteSearchQuery('')}>
                  ×
                </button>
              )}
            </div>
          </section>

          {/* 현장 카드 그리드 */}
          <section className="work-sites-container">
            {isSitesLoading ? (
              <div className="work-sites-skeleton-group">
                {[1, 2, 3].map(i => (
                  <div key={i} className="work-site-card-skeleton">
                    <div className="skeleton-header-row">
                      <div className="skeleton-title-col">
                        <Skeleton width={180} height={20} borderRadius={6} />
                        <Skeleton width={260} height={14} borderRadius={4} />
                      </div>
                      <Skeleton width={68} height={24} borderRadius={999} />
                    </div>
                    <div className="skeleton-progress-row">
                      <Skeleton width="100%" height={8} borderRadius={999} />
                      <Skeleton width={48} height={14} borderRadius={4} />
                    </div>
                  </div>
                ))}
              </div>
            ) : assignedRegions.length === 0 ? (
              <div className="work-empty-state">
                <MapPin size={48} className="empty-icon" />
                <p className="empty-title">배정된 담당 지역이 없습니다.</p>
                <p className="empty-sub">
                  [마이페이지 ➔ 담당 지역 관리]에서 담당하실 지역을 먼저 등록해 주세요.
                </p>
                <Link href="/portal/profile" className="btn-go-profile">
                  담당 지역 등록하러 가기
                </Link>
              </div>
            ) : filteredSites.length === 0 ? (
              <div className="work-empty-state">
                <Building2 size={48} className="empty-icon" />
                <p className="empty-title">일치하는 현장이 없습니다.</p>
                <p className="empty-sub">검색어나 선택된 지역 탭을 다시 확인해 보세요.</p>
              </div>
            ) : (
              <div className="site-cards-grid">
                {filteredSites.map(site => {
                  const total = site.totalHouseholds || 0;
                  const completed = site.completedHouseholds || 0;
                  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <div
                      key={site.siteId}
                      className="portal-site-card"
                      onClick={() => handleSelectSite(site.siteId)}
                    >
                      <div className="site-card-icon">
                        <Building2 size={20} />
                      </div>

                      <div className="site-card-body">
                        <div className="site-card-title-row">
                          <h3 className="site-card-name">{site.name}</h3>
                          <span className="site-card-region">{site.sido} {site.region || site.sigungu}</span>
                        </div>
                        <p className="site-card-address">{site.address || '주소 정보 없음'}</p>
                        <div className="site-card-meta-row">
                          <span className="meta-stats">
                            시공완료 {completed}/{total}세대
                          </span>
                          <span className={`meta-rate ${rate === 100 ? 'done' : ''}`}>({rate}% 완료)</span>
                        </div>
                      </div>

                      <div className="site-card-arrow">
                        <ChevronRight size={18} className="arrow-icon" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      ) : (
        /* ═══════════════════════════════════════════════════════════
            STEP 2. 세대 및 보고서 전용 뷰 (siteId 존재 시)
        ═══════════════════════════════════════════════════════════ */
        <div className="site-detail-view">
          {/* 상단 뒤로가기 및 현장 브리핑 헤더 */}
          <div className="detail-header-card">
            <button
              type="button"
              className="btn-back-to-sites"
              onClick={handleBackToSites}
            >
              <ArrowLeft size={16} />
              <span>현장 목록으로 돌아가기</span>
            </button>

            <div className="detail-site-meta">
              <div className="meta-left">
                <div className="site-icon-box">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="detail-site-title">{activeSiteDetail?.name || '현장 세대 관리'}</h2>
                  <p className="detail-site-addr">{activeSiteDetail?.address || ''}</p>
                </div>
              </div>

              <div className="detail-progress-box">
                <div className="progress-labels">
                  <span className="lbl-left">
                    시공 완료 <strong>{siteHouseholdStats.completed}</strong> / {siteHouseholdStats.total}세대
                  </span>
                  <span className={`lbl-right ${siteHouseholdStats.rate === 100 ? 'done' : ''}`}>
                    {siteHouseholdStats.rate}%
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-bar ${siteHouseholdStats.rate === 100 ? 'done' : ''}`}
                    style={{ width: `${siteHouseholdStats.rate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── 2-1. 세대 검색 & 상태 필터 바 ── */}
          <div className="household-search-filter-row">
            <div className="work-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="동/호수(예: 101동 101호) 또는 세대주명 검색"
                value={householdSearchQuery}
                onChange={e => setHouseholdSearchQuery(e.target.value)}
              />
              {householdSearchQuery && (
                <button className="clear-btn" onClick={() => setHouseholdSearchQuery('')}>
                  ×
                </button>
              )}
            </div>

            <div className="filter-dropdown-container" ref={filterRef}>
              <button
                type="button"
                className={`btn-filter-trigger ${statusFilter !== 'all' ? 'active' : ''}`}
                onClick={() => setIsFilterMenuOpen(prev => !prev)}
                aria-label="작업 상태 필터"
              >
                <SlidersHorizontal size={14} />
                {FILTER_OPTIONS.find(o => o.value === statusFilter)?.dotClass && (
                  <span
                    className={`filter-status-dot ${
                      FILTER_OPTIONS.find(o => o.value === statusFilter)?.dotClass
                    }`}
                  />
                )}
                <span className="filter-selected-text">
                  {FILTER_OPTIONS.find(o => o.value === statusFilter)?.shortLabel || '전체'}
                </span>
                <ChevronDown size={14} className={`arrow-icon ${isFilterMenuOpen ? 'open' : ''}`} />
              </button>

              {isFilterMenuOpen && (
                <div className="filter-dropdown-menu">
                  <div className="dropdown-menu-header">
                    <span>작업 상태 필터</span>
                  </div>
                  {FILTER_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`dropdown-menu-item ${statusFilter === opt.value ? 'selected' : ''}`}
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      <div className="item-label-group">
                        {opt.dotClass && <span className={`filter-status-dot ${opt.dotClass}`} />}
                        <span className="item-label">{opt.label}</span>
                      </div>
                      {statusFilter === opt.value && (
                        <Check size={14} className="item-check-icon" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 2-2. 세대 및 보고서 카드 목록 ── */}
          <section className="households-container">
            {isDetailLoading ? (
              <div className="households-skeleton-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="household-card-skeleton">
                    <Skeleton width={120} height={18} borderRadius={6} />
                    <Skeleton width={80} height={14} borderRadius={4} />
                    <Skeleton width="100%" height={32} borderRadius={8} />
                  </div>
                ))}
              </div>
            ) : filteredHouseholds.length === 0 ? (
              <div className="work-empty-state">
                <Circle size={40} className="empty-icon" />
                <p className="empty-title">일치하는 세대 또는 보고서가 없습니다.</p>
                <p className="empty-sub">검색어나 작업 상태 필터를 변경해 보세요.</p>
                {(statusFilter !== 'all' || householdSearchQuery) && (
                  <button
                    type="button"
                    className="btn-reset-filters"
                    onClick={() => {
                      setStatusFilter('all');
                      setHouseholdSearchQuery('');
                    }}
                  >
                    필터 전체 초기화
                  </button>
                )}
              </div>
            ) : (
              <div className="households-card-grid">
                {filteredHouseholds.map(household => {
                  const statusType: ReportStatus = household.reportStatus
                    ? normalizeReportStatus(household.reportStatus)
                    : 'UNSUBMITTED';
                  const statusKey = getStatusKey(statusType);
                  const isOtherWorker = Boolean(
                    household.reportUserId && household.reportUserId !== user?.userId
                  );

                  return (
                    <div
                      key={household.householdId}
                      className={`household-unit-card status-${statusKey}`}
                      onClick={() => handleOpenReport(household)}
                    >
                      <div className={`status-avatar ${statusKey}`}>
                        {statusType === 'COMPLETED' && <Check size={16} strokeWidth={2.5} />}
                        {statusType === 'PENDING' && <Hourglass size={15} />}
                        {statusType === 'REJECTED' && <AlertCircle size={15} />}
                        {statusType === 'UNSUBMITTED' && <CircleDashed size={15} strokeWidth={2} />}
                      </div>

                      <div className="card-body">
                        <div className="unit-main-line">
                          <span className="unit-name">{household.dong}동 {household.ho}호</span>
                          {household.headName && (
                            <span className="head-name">· {household.headName} 세대</span>
                          )}
                        </div>

                        <div className="unit-sub-line">
                          <span className={`status-text ${statusKey}`}>
                            {statusType === 'COMPLETED' && '확인완료'}
                            {statusType === 'PENDING' && '검토대기'}
                            {statusType === 'REJECTED' && '수정필요'}
                            {statusType === 'UNSUBMITTED' && '작업대기'}
                          </span>
                          {(household.reportTime || household.remarks) && <span className="dot">•</span>}
                          {household.reportTime && (
                            <span className="info-time">
                              {household.reporterName ? `${household.reporterName} · ` : ''}{household.reportTime}
                            </span>
                          )}
                          {!household.reportTime && household.remarks && (
                            <span className="info-remarks">{household.remarks}</span>
                          )}
                        </div>
                      </div>

                      <div className="card-action-col">
                        <span className={`action-badge ${statusKey}`}>
                          {isOtherWorker
                            ? '타작업자 완료'
                            : statusType === 'COMPLETED'
                              ? '조회'
                              : statusType === 'UNSUBMITTED'
                                ? '작업하기'
                                : '수정하기'}
                        </span>
                        <ChevronRight size={15} className="arrow-icon" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── WORK REPORT MODAL ── */}
      <WorkReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => {
          setIsReportDialogOpen(false);
          setSelectedHousehold(undefined);
          setSelectedReport(undefined);
        }}
        site={activeSiteDetail || undefined}
        household={selectedHousehold}
        existingReport={selectedReport}
        onSubmitted={() => {
          if (siteId) {
            loadSiteDetail(siteId);
          }
          loadSitesSummary();
        }}
      />
    </div>
  );
}

export default function PortalWorkPage() {
  return (
    <Suspense
      fallback={
        <div className="portal-work-page">
          <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Skeleton width="100%" height={240} borderRadius={16} />
          </div>
        </div>
      }
    >
      <PortalWorkContent />
    </Suspense>
  );
}
