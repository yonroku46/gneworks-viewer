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
  Layers,
  ArrowUp,
  ArrowDown,
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

  // 1단계 현장 목록 상태 (서버 사이드 페이징 & 디바운스 검색)
  const SITES_PAGE_SIZE = 30;
  const [allSites, setAllSites] = useState<SiteDetail[]>([]);
  const [totalSitesCount, setTotalSitesCount] = useState<number>(0);
  const [sitesPage, setSitesPage] = useState<number>(1);
  const [assignedRegions, setAssignedRegions] = useState<UserAssignedRegionDetail[]>([]);
  const [isRegionsLoading, setIsRegionsLoading] = useState(true);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ALL');
  const [siteSearchQuery, setSiteSearchQuery] = useState('');
  const [debouncedSiteQuery, setDebouncedSiteQuery] = useState('');
  const [isSitesLoading, setIsSitesLoading] = useState(true);
  const [isMoreSitesLoading, setIsMoreSitesLoading] = useState(false);
  const siteObserverTargetRef = useRef<HTMLDivElement>(null);

  // 검색어 300ms 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSiteQuery(siteSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [siteSearchQuery]);

  // 2단계 선택된 현장 상세 및 세대 상태
  const [activeSiteDetail, setActiveSiteDetail] = useState<SiteDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [householdSearchQuery, setHouseholdSearchQuery] = useState('');
  const [selectedDong, setSelectedDong] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<WorkStatusFilter>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isDongMenuOpen, setIsDongMenuOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const dongRef = useRef<HTMLDivElement>(null);

  // 지역 탭 가로 스크롤 관리
  const regionTabListRef = useRef<HTMLDivElement>(null);
  const [canScrollRegionLeft, setCanScrollRegionLeft] = useState(false);
  const [canScrollRegionRight, setCanScrollRegionRight] = useState(false);

  // 보고서 작성 다이얼로그 상태
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdRes>();
  const [selectedReport, setSelectedReport] = useState<WorkReport>();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const isReportDialogOpenRef = useRef(false);
  isReportDialogOpenRef.current = isReportDialogOpen;
  const pendingDetailRefreshRef = useRef(false);
  const savedScrollPosRef = useRef<number>(0);
  const lastSubmittedHouseholdIdRef = useRef<string | null>(null);
  const [justUpdatedHouseholdId, setJustUpdatedHouseholdId] = useState<string | null>(null);

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
      if (dongRef.current && !dongRef.current.contains(e.target as Node)) {
        setIsDongMenuOpen(false);
      }
    };
    if (isFilterMenuOpen || isDongMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterMenuOpen, isDongMenuOpen]);

  // 배정 관할 목록 로드 (지역별 정확한 totalSites 포함)
  const loadAssignedRegions = useCallback(async () => {
    try {
      setIsRegionsLoading(true);
      const regions = await PortalService.getAssignedRegions().catch(err => {
        console.error('[PortalWorkPage] getAssignedRegions error', err);
        return [];
      });
      setAssignedRegions(regions || []);
    } catch (err) {
      console.error('[PortalWorkPage] loadAssignedRegions error', err);
    } finally {
      setIsRegionsLoading(false);
    }
  }, []);

  // 서버 사이드 현장 목록 페이징 조회
  const fetchSites = useCallback(
    async (pageNumber: number, isAppend: boolean) => {
      try {
        if (isAppend) {
          setIsMoreSitesLoading(true);
        } else {
          setIsSitesLoading(true);
        }

        const selectedRegion =
          selectedRegionId !== 'ALL'
            ? assignedRegions.find(
                r => r.assignedRegionId === selectedRegionId || r.regionId === selectedRegionId
              )
            : null;
        const targetRegionId = selectedRegion?.regionId || (selectedRegionId !== 'ALL' ? selectedRegionId : undefined);

        const res = await PortalService.getSitesPaged({
          regionId: targetRegionId,
          query: debouncedSiteQuery.trim() || undefined,
          page: pageNumber,
          size: SITES_PAGE_SIZE,
          includeHouseholds: false,
        });

        if (isAppend) {
          setAllSites(prev => [...prev, ...(res.list || [])]);
        } else {
          setAllSites(res.list || []);
        }
        setTotalSitesCount(res.totalCount || 0);
        setSitesPage(pageNumber);
      } catch (err) {
        console.error('[PortalWorkPage] fetchSites error', err);
        if (!isAppend) {
          setAllSites([]);
          setTotalSitesCount(0);
        }
      } finally {
        setIsSitesLoading(false);
        setIsMoreSitesLoading(false);
      }
    },
    [selectedRegionId, assignedRegions, debouncedSiteQuery]
  );

  // 초기 로드 시 배정 관할 로드
  useEffect(() => {
    loadAssignedRegions();
  }, [loadAssignedRegions]);

  // 검색어 또는 선택 지역 탭 변경 시 1페이지부터 새로 조회
  useEffect(() => {
    fetchSites(1, false);
  }, [fetchSites]);

  // 무한 스크롤(서버 페이징): 다음 페이지가 남아있는지 여부
  const hasMoreSites = allSites.length < totalSitesCount;

  // 스크롤 하단 감지 시 다음 30개 추가 조회
  useEffect(() => {
    if (!hasMoreSites || isMoreSitesLoading || isSitesLoading) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchSites(sitesPage + 1, true);
        }
      },
      { threshold: 0.1, rootMargin: '120px' }
    );
    const target = siteObserverTargetRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMoreSites, isMoreSitesLoading, isSitesLoading, sitesPage, fetchSites]);

  // 2. 특정 현장 상세 로드 (무중단 백그라운드 갱신 지원)
  const loadSiteDetail = useCallback(
    async (targetSiteId: string, options?: { silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setIsDetailLoading(true);
        }
        const detail = await PortalService.getSiteDetail(targetSiteId);
        setActiveSiteDetail(detail || null);
      } catch (err) {
        console.error('[PortalWorkPage] getSiteDetail error', err);
        enqueueSnackbar('현장 상세 정보를 불러오지 못했습니다.', { variant: 'error' });
        if (!options?.silent) {
          setActiveSiteDetail(null);
        }
      } finally {
        if (!options?.silent) {
          setIsDetailLoading(false);
        }
      }
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    const handleRealtimeNotification = () => {
      fetchSites(1, false);
      loadAssignedRegions();
      if (siteId) {
        if (isReportDialogOpenRef.current) {
          // 보고서 작성 모달이 열려 있을 때는 백그라운드 리패치로 인한 입력 방해를 막기 위해 모달 종료 후로 연기
          pendingDetailRefreshRef.current = true;
        } else {
          loadSiteDetail(siteId, { silent: true });
        }
      }
    };
    window.addEventListener('gneworks-notification-received', handleRealtimeNotification);
    return () => {
      window.removeEventListener('gneworks-notification-received', handleRealtimeNotification);
    };
  }, [fetchSites, loadAssignedRegions, siteId, loadSiteDetail]);

  // URL 쿼리 파라미터(siteId) 변경 시 상세 데이터 동기화
  useEffect(() => {
    if (siteId) {
      loadSiteDetail(siteId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveSiteDetail(null);
    }
    setHouseholdSearchQuery('');
    setSelectedDong('ALL');
    setSortOrder('asc');
    setStatusFilter('all');
  }, [siteId, loadSiteDetail]);

  // 현장 카드 선택 핸들러 -> URL 변경으로 브라우저 히스토리 지원
  const handleSelectSite = (targetSiteId: string) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('gneworks_active_household_id');
      } catch {}
    }
    setHouseholdSearchQuery('');
    setSelectedDong('ALL');
    setSortOrder('asc');
    setStatusFilter('all');
    router.push(`/portal/work?siteId=${encodeURIComponent(targetSiteId)}`);
  };

  // 현장 목록으로 돌아가기
  const handleBackToSites = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('gneworks_active_household_id');
      } catch {}
    }
    router.push('/portal/work');
  };

  // 전체 담당 지역에 속한 현장 총 개수 (백엔드에서 집계된 각 지역별 totalSites의 합산)
  const totalAssignedSitesCount = useMemo(() => {
    return assignedRegions.reduce((acc, cur) => acc + (cur.totalSites || 0), 0);
  }, [assignedRegions]);

  // ── [2단계 데이터] 활성 현장의 동 그룹 목록 추출 (세대 수 포함, 자연 정렬) ──
  const availableDongs = useMemo(() => {
    if (!activeSiteDetail?.households) return [];
    const dongCountMap = new Map<string, number>();
    activeSiteDetail.households.forEach(h => {
      const dong = String(h.dong || '').trim();
      if (dong) {
        dongCountMap.set(dong, (dongCountMap.get(dong) || 0) + 1);
      }
    });

    return Array.from(dongCountMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
      .map(([dong, count]) => ({ dong, count }));
  }, [activeSiteDetail]);

  // ── [2단계 필터링 및 정렬] 활성 현장 내 세대 및 보고서 필터링 ──
  const filteredHouseholds = useMemo(() => {
    if (!activeSiteDetail?.households) return [];
    const query = householdSearchQuery.trim().toLowerCase();

    const filtered = activeSiteDetail.households.filter(h => {
      // 1. 동 그룹 필터링
      if (selectedDong !== 'ALL') {
        if (String(h.dong || '').trim() !== selectedDong) return false;
      }

      // 2. 검색어 필터링 (동, 호수, 세대주)
      if (query) {
        const dongFormatted = `${h.dong}동`.toLowerCase();
        const hoFormatted = `${h.ho}호`.toLowerCase();
        const dongStr = String(h.dong || '').toLowerCase();
        const hoStr = String(h.ho || '').toLowerCase();
        const headStr =
          h.headName && h.headName.trim() !== '-' ? String(h.headName).toLowerCase() : '';

        const match =
          dongStr.includes(query) ||
          dongFormatted.includes(query) ||
          hoStr.includes(query) ||
          hoFormatted.includes(query) ||
          (headStr ? headStr.includes(query) : false);

        if (!match) return false;
      }

      // 3. 상태 필터링
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

    // 4. 동·호수 기준 자연 순서 정렬 (오름차순 / 내림차순)
    return filtered.sort((a, b) => {
      const dongA = String(a.dong || '');
      const dongB = String(b.dong || '');
      const dongComp = dongA.localeCompare(dongB, undefined, { numeric: true });
      if (dongComp !== 0) {
        return sortOrder === 'asc' ? dongComp : -dongComp;
      }
      const hoA = String(a.ho || '');
      const hoB = String(b.ho || '');
      const hoComp = hoA.localeCompare(hoB, undefined, { numeric: true });
      return sortOrder === 'asc' ? hoComp : -hoComp;
    });
  }, [activeSiteDetail, selectedDong, householdSearchQuery, statusFilter, sortOrder]);

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
  const handleOpenReport = useCallback(async (household: HouseholdRes) => {
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

    if (typeof window !== 'undefined') {
      savedScrollPosRef.current = window.scrollY || document.documentElement.scrollTop || 0;
      try {
        sessionStorage.setItem('gneworks_active_household_id', household.householdId);
      } catch {}
    }

    setSelectedHousehold(household);
    setSelectedReport(report);
    setIsReportDialogOpen(true);
  }, [user?.userId, enqueueSnackbar]);

  // 브라우저 탭 강제 리로드(모바일 카메라 촬영 등) 후 작성 중이던 세대 보고서 모달 자동 복원
  const autoRestoredHouseholdRef = useRef(false);
  useEffect(() => {
    if (!activeSiteDetail || !siteId || isReportDialogOpen || autoRestoredHouseholdRef.current || typeof window === 'undefined') return;
    const activeHouseholdId = sessionStorage.getItem('gneworks_active_household_id');
    if (activeHouseholdId && activeSiteDetail.households) {
      const targetHousehold = activeSiteDetail.households.find(h => h.householdId === activeHouseholdId);
      if (targetHousehold) {
        autoRestoredHouseholdRef.current = true;
        handleOpenReport(targetHousehold);
      }
    }
  }, [activeSiteDetail, siteId, isReportDialogOpen, handleOpenReport]);

  // 보고서 제출 후 방금 작업한 세대로 부드러운 스크롤 & 하이라이트 (필터링 등으로 DOM에 없으면 기존 스크롤 위치 유지)
  useEffect(() => {
    const targetHouseholdId = lastSubmittedHouseholdIdRef.current;
    if (!targetHouseholdId) return;

    const timer = setTimeout(() => {
      const cardEl = document.getElementById(`household-card-${targetHouseholdId}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setJustUpdatedHouseholdId(targetHouseholdId);
        setTimeout(() => {
          setJustUpdatedHouseholdId(prev => (prev === targetHouseholdId ? null : prev));
        }, 2500);
      } else if (savedScrollPosRef.current > 0) {
        window.scrollTo({ top: savedScrollPosRef.current, behavior: 'smooth' });
      }
      lastSubmittedHouseholdIdRef.current = null;
    }, 120);

    return () => clearTimeout(timer);
  }, [activeSiteDetail, filteredHouseholds]);

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
              <p className="work-page-sub">작업을 진행할 현장을 선택하세요.</p>
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
                {isRegionsLoading ? (
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
                      <span className="count-badge">{totalAssignedSitesCount}</span>
                    </button>
                    {assignedRegions.map(reg => (
                      <button
                        key={reg.assignedRegionId}
                        type="button"
                        className={`region-tab-btn ${selectedRegionId === reg.assignedRegionId ? 'active' : ''}`}
                        onClick={() => setSelectedRegionId(reg.assignedRegionId)}
                      >
                        <span>{reg.sido} {reg.sigungu}</span>
                        <span className="count-badge">{reg.totalSites || 0}</span>
                      </button>
                    ))}
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
            ) : allSites.length === 0 ? (
              <div className="work-empty-state">
                <Building2 size={48} className="empty-icon" />
                <p className="empty-title">일치하는 현장이 없습니다.</p>
                <p className="empty-sub">검색어나 선택된 지역 탭을 다시 확인해 보세요.</p>
              </div>
            ) : (
              <>
                <div className="site-cards-grid">
                  {allSites.map(site => {
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

                {hasMoreSites && (
                  <div ref={siteObserverTargetRef} className="site-scroll-sentinel">
                    <div className="sentinel-spinner" />
                    <span>현장 목록을 불러오는 중... ({allSites.length} / {totalSitesCount})</span>
                  </div>
                )}
              </>
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

          {/* ── 2-1. 세대 검색 & 정렬 바 + 동·상태 필터 바 ── */}
          <div className="household-controls-container">
            {/* 1행: 검색창 + 정렬 토글 버튼 */}
            <div className="household-search-sort-row">
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

              <button
                type="button"
                className={`btn-sort-toggle ${sortOrder}`}
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                title={
                  sortOrder === 'asc'
                    ? '동·호수 오름차순 (클릭 시 내림차순 변경)'
                    : '동·호수 내림차순 (클릭 시 오름차순 변경)'
                }
                aria-label="동·호수 정렬 순서 전환"
              >
                {sortOrder === 'asc' ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
                <span className="sort-label">{sortOrder === 'asc' ? '오름차순' : '내림차순'}</span>
              </button>
            </div>

            {/* 2행: 동 그룹 필터 & 작업 상태 필터 바 */}
            <div className="household-filter-bar">
              {/* 동 그룹 셀렉트바 */}
              <div className="filter-dropdown-container dong-select-container" ref={dongRef}>
                <button
                  type="button"
                  className={`btn-filter-trigger ${selectedDong !== 'ALL' ? 'active' : ''}`}
                  onClick={() => setIsDongMenuOpen(prev => !prev)}
                  aria-label="동 선택 필터"
                >
                  <div className="trigger-left">
                    <Layers size={14} className="trigger-icon" />
                    <span className="filter-selected-text">
                      {selectedDong === 'ALL' ? '전체 동' : `${selectedDong}동`}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`arrow-icon ${isDongMenuOpen ? 'open' : ''}`} />
                </button>

                {isDongMenuOpen && (
                  <div className="filter-dropdown-menu scrollable-menu">
                    <div className="dropdown-menu-header">
                      <span>동 선택 ({availableDongs.length}개 동)</span>
                    </div>
                    <button
                      type="button"
                      className={`dropdown-menu-item ${selectedDong === 'ALL' ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedDong('ALL');
                        setIsDongMenuOpen(false);
                      }}
                    >
                      <div className="item-label-group">
                        <span className="item-label">전체 동</span>
                        <span className="item-badge">{`${activeSiteDetail?.households?.length || 0}세대`}</span>
                      </div>
                      {selectedDong === 'ALL' && <Check size={14} className="item-check-icon" />}
                    </button>
                    {availableDongs.map(d => (
                      <button
                        key={d.dong}
                        type="button"
                        className={`dropdown-menu-item ${selectedDong === d.dong ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedDong(d.dong);
                          setIsDongMenuOpen(false);
                        }}
                      >
                        <div className="item-label-group">
                          <span className="item-label">{d.dong}동</span>
                          <span className="item-badge">{d.count}세대</span>
                        </div>
                        {selectedDong === d.dong && <Check size={14} className="item-check-icon" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 작업 상태 필터 드롭다운 */}
              <div className="filter-dropdown-container status-select-container" ref={filterRef}>
                <button
                  type="button"
                  className={`btn-filter-trigger ${statusFilter !== 'all' ? 'active' : ''}`}
                  onClick={() => setIsFilterMenuOpen(prev => !prev)}
                  aria-label="작업 상태 필터"
                >
                  <div className="trigger-left">
                    <SlidersHorizontal size={14} className="trigger-icon" />
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
                  </div>
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
                <p className="empty-title">일치하는 세대 또는 보고서가 없습니다.</p>
                <p className="empty-sub">검색어나 작업 상태 필터를 변경해 보세요.</p>
                {(statusFilter !== 'all' || householdSearchQuery || selectedDong !== 'ALL') && (
                  <button
                    type="button"
                    className="btn-reset-filters"
                    onClick={() => {
                      setStatusFilter('all');
                      setHouseholdSearchQuery('');
                      setSelectedDong('ALL');
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
                      id={`household-card-${household.householdId}`}
                      className={`household-unit-card status-${statusKey} ${
                        justUpdatedHouseholdId === household.householdId ? 'just-updated' : ''
                      }`}
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
                          {household.headName && household.headName.trim() !== '-' && (
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
          if (typeof window !== 'undefined') {
            try {
              sessionStorage.removeItem('gneworks_active_household_id');
            } catch {}
          }
          setIsReportDialogOpen(false);
          setSelectedHousehold(undefined);
          setSelectedReport(undefined);
          if (pendingDetailRefreshRef.current && siteId) {
            pendingDetailRefreshRef.current = false;
            loadSiteDetail(siteId, { silent: true });
          }
        }}
        site={activeSiteDetail || undefined}
        household={selectedHousehold}
        existingReport={selectedReport}
        onSubmitted={() => {
          if (typeof window !== 'undefined') {
            try {
              sessionStorage.removeItem('gneworks_active_household_id');
            } catch {}
          }
          if (selectedHousehold?.householdId) {
            lastSubmittedHouseholdIdRef.current = selectedHousehold.householdId;
          }
          pendingDetailRefreshRef.current = false;
          if (siteId) {
            loadSiteDetail(siteId, { silent: true });
          }
          fetchSites(1, false);
          loadAssignedRegions();
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
