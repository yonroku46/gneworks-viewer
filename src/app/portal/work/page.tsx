'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from 'notistack';
import PortalService from '@/api/service/PortalService';
import { isRegionMatch } from '@/common/utils/regionUtils';
import WorkReportDialog from '@/components/dialog/WorkReportDialog';
import Skeleton from '@/components/contents/Skeleton';
import {
  MapPin,
  Building2,
  Search,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Circle,
  Hourglass,
  SlidersHorizontal,
  Check,
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

export default function PortalWorkPage() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Storage states
  const [allSites, setAllSites] = useState<SiteDetail[]>([]);
  const [assignedRegions, setAssignedRegions] = useState<UserAssignedRegionDetail[]>([]);

  // Filter & Search states
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkStatusFilter>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [expandedSiteIds, setExpandedSiteIds] = useState<{ [key: string]: boolean }>({});

  // 탭 가로 스크롤 관리 (PC 화살표 버튼)
  const tabListRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (tabListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [assignedRegions]);

  const handleScrollTab = (direction: 'left' | 'right') => {
    if (tabListRef.current) {
      const amount = 220;
      tabListRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 320);
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

  const [selectedSite, setSelectedSite] = useState<SiteDetail>();
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdRes>();
  const [selectedReport, setSelectedReport] = useState<WorkReport>();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [regions, siteList] = await Promise.all([
        PortalService.getAssignedRegions().catch(err => {
          console.error('[PortalWorkPage] getAssignedRegions error', err);
          return [];
        }),
        PortalService.getSites({ includeHouseholds: true }).catch(err => {
          console.error('[PortalWorkPage] getSites error', err);
          return [];
        }),
      ]);

      setAssignedRegions(regions || []);
      setAllSites(siteList || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 1. 담당 지역에 속하는 현장들만 필터링 (isRegionMatch 유연 매칭)
  const assignedSites = useMemo(() => {
    if (assignedRegions.length === 0) return [];

    return allSites.filter(site => {
      // 선택된 지역 탭 필터링
      if (selectedRegionId !== 'ALL') {
        const selectedRegion = assignedRegions.find(
          r => r.assignedRegionId === selectedRegionId || r.regionId === selectedRegionId
        );
        if (!selectedRegion) return false;
        return isRegionMatch(site.sido, site.sigungu, selectedRegion.sido, selectedRegion.sigungu);
      }

      // 'ALL'인 경우 담당 중인 지역 중 하나와 일치하면 포함
      return assignedRegions.some(r => isRegionMatch(site.sido, site.sigungu, r.sido, r.sigungu));
    });
  }, [allSites, assignedRegions, selectedRegionId]);

  // 2. 검색어 및 작업 상태에 맞게 현장 및 세대 필터링
  const filteredSitesWithHouseholds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return assignedSites
      .map(site => {
        const matchesSiteName = site.name.toLowerCase().includes(query);
        const matchesAddress = site.address.toLowerCase().includes(query);

        const siteHouseholds = site.households || [];
        // 세대 필터링
        const filteredHouseholds = siteHouseholds.filter(h => {
          // 1. 검색어 필터링
          if (query && !matchesSiteName && !matchesAddress) {
            const dongFormatted = `${h.dong}동`;
            const hoFormatted = `${h.ho}호`;

            const matchesKeyword =
              h.dong.toLowerCase().includes(query) ||
              dongFormatted.toLowerCase().includes(query) ||
              h.ho.toLowerCase().includes(query) ||
              hoFormatted.toLowerCase().includes(query) ||
              h.headName.toLowerCase().includes(query) ||
              (h.remarks && h.remarks.toLowerCase().includes(query));

            if (!matchesKeyword) return false;
          }

          // 2. 작업 상태 필터링
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

        return {
          site,
          households: filteredHouseholds,
        };
      })
      .filter(item => item.households.length > 0);
  }, [assignedSites, searchQuery, statusFilter]);

  // 현장 접기/펼치기 토글
  const toggleSiteExpand = (siteId: string) => {
    setExpandedSiteIds(prev => ({ ...prev, [siteId]: !prev[siteId] }));
  };

  // 보고서 작성 다이얼로그 열기
  const handleOpenReport = async (site: SiteDetail, household: HouseholdRes) => {
    // 다른 작업자가 이미 제출한 세대인 경우 알림 띄우고 조회/수정 차단
    if (household.reportId) {
      const isMyReport = Boolean(household.reportUserId && household.reportUserId === user?.userId);
      if (!isMyReport) {
        enqueueSnackbar('다른 작업자가 이미 완료한 보고서입니다.', { variant: 'warning' });
        return;
      }
    }

    // 기존 보고서 상세 로드 (수정 또는 조회용)
    let report: WorkReport | undefined = undefined;
    if (household.reportId) {
      try {
        const fetched = await PortalService.getReportByHouseholdId(household.householdId);
        if (fetched) report = fetched;
      } catch (err) {
        console.error('[PortalWorkPage] getReportByHouseholdId error', err);
      }
    }

    setSelectedSite(site);
    setSelectedHousehold(household);
    setSelectedReport(report);
    setIsReportDialogOpen(true);
  };

  return (
    <div className="portal-work-page">
      {/* ── HEADER SUMMARY ── */}
      <section className="work-header-section">
        <div className="work-title-group">
          <h2 className="work-page-title">내 담당 작업 목록</h2>
          <p className="work-page-sub">담당 지역을 확인하고 작업 보고서를 제출하세요.</p>
        </div>

        {/* ── ASSIGNED REGION TABS ── */}
        <div className="assigned-region-tabs-container">
          <button
            type="button"
            className={`tab-scroll-btn left ${canScrollLeft ? 'visible' : ''}`}
            onClick={() => handleScrollTab('left')}
            disabled={!canScrollLeft}
            aria-label="이전 지역 목록"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            className="region-tab-list"
            ref={tabListRef}
            onScroll={checkScrollButtons}
          >
            {isLoading ? (
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
                  const sitesCount = allSites.filter(
                    s => isRegionMatch(s.sido, s.sigungu, reg.sido, reg.sigungu)
                  ).length;

                  return (
                    <button
                      key={reg.assignedRegionId}
                      type="button"
                      className={`region-tab-btn ${selectedRegionId === reg.assignedRegionId ? 'active' : ''}`}
                      onClick={() => setSelectedRegionId(reg.assignedRegionId)}
                    >
                      <span>
                        {reg.sido} {reg.sigungu}
                      </span>
                      <span className="count-badge">{sitesCount}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          <button
            type="button"
            className={`tab-scroll-btn right ${canScrollRight ? 'visible' : ''}`}
            onClick={() => handleScrollTab('right')}
            disabled={!canScrollRight}
            aria-label="다음 지역 목록"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* ── SEARCH & STATUS FILTER ROW ── */}
        <div className="work-search-filter-row">
          <div className="work-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="현장명, 동/호수, 세대주 검색"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>
                ×
              </button>
            )}
          </div>

          <div className="filter-dropdown-container" ref={filterRef}>
            <button
              type="button"
              className={`btn-filter-trigger ${statusFilter !== 'all' ? 'active' : ''}`}
              onClick={() => setIsFilterMenuOpen(prev => !prev)}
              aria-label="상태 필터"
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
      </section>

      {/* ── WORK SITES & HOUSEHOLDS CONTAINER ── */}
      <section className="work-sites-container">
        {isLoading ? (
          <div className="work-sites-skeleton-group">
            {[1, 2, 3].map(i => (
              <div key={i} className="work-site-card-skeleton">
                <div className="skeleton-header-row">
                  <div className="skeleton-title-col">
                    <Skeleton width={180} height={20} borderRadius={6} />
                    <Skeleton width={260} height={14} borderRadius={4} />
                  </div>
                  <div className="skeleton-meta-col">
                    <Skeleton width={68} height={24} borderRadius={999} />
                    <Skeleton width={28} height={28} borderRadius={8} />
                  </div>
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
        ) : filteredSitesWithHouseholds.length === 0 ? (
          <div className="work-empty-state">
            <Building2 size={48} className="empty-icon" />
            <p className="empty-title">일치하는 현장 또는 세대가 없습니다.</p>
            <p className="empty-sub">검색어나 선택된 지역 탭을 다시 확인해 보세요.</p>
          </div>
        ) : (
          filteredSitesWithHouseholds.map(({ site, households }) => {
            const isExpanded = expandedSiteIds[site.siteId] ?? false;

            // 현장 내 세대들의 보고서 통계
            const submittedCount = households.filter(h => h.reportStatus === 'COMPLETED').length;
            const pendingCount = households.filter(h => h.reportStatus === 'PENDING').length;

            const total = households.length;
            const progressPercent = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

            return (
              <div key={site.siteId} className={`portal-site-accordion-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
                {/* ── SITE HEADER ── */}
                <div
                  className="site-card-header"
                  onClick={() => toggleSiteExpand(site.siteId)}
                >
                  <div className="site-header-top-row">
                    <div className="site-title-group">
                      <strong className="site-name">{site.name}</strong>
                      {pendingCount > 0 && (
                        <span className="pending-badge">검토대기 {pendingCount}</span>
                      )}
                    </div>
                    <button type="button" className="btn-toggle-expand" aria-label="접기/펼치기">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  <p className="site-address">{site.address}</p>

                  <div className="site-progress-summary">
                    <div className="progress-info-row">
                      <span className="progress-text">
                        완료 {submittedCount} / {total}세대
                      </span>
                      <span className={`progress-percent ${progressPercent === 100 ? 'done' : ''}`}>
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-fill ${progressPercent === 100 ? 'done' : ''}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* ── HOUSEHOLDS LIST ── */}
                {isExpanded && (
                  <div className="households-list">
                    {households.map(household => {
                      const statusType: ReportStatus = household.reportStatus
                        ? normalizeReportStatus(household.reportStatus)
                        : 'UNSUBMITTED';
                      const statusKey = getStatusKey(statusType);
                      const isOtherWorker = Boolean(
                        household.reportUserId && household.reportUserId !== user?.userId
                      );

                      return (
                        <div key={household.householdId} className={`household-row status-${statusKey}`}>
                          <div className={`status-strip ${statusKey}`} title={`상태: ${statusType}`}>
                            {statusType === 'COMPLETED' && <Check size={14} strokeWidth={3} />}
                            {statusType === 'PENDING' && <Hourglass size={13} strokeWidth={2.5} />}
                            {statusType === 'REJECTED' && <AlertCircle size={14} strokeWidth={2.5} />}
                            {statusType === 'UNSUBMITTED' && <Circle size={12} strokeWidth={2.5} />}
                          </div>

                          <div className="household-body">
                            <div className="household-main-info">
                              <span className="unit-text">
                                {household.dong}동 {household.ho}호
                              </span>
                              <span className="head-name">{household.headName} 세대</span>
                            </div>

                            <div className="household-actions">
                              <button
                                type="button"
                                className={`btn-report-action ${statusType === 'UNSUBMITTED' ? 'primary' : 'secondary'} ${isOtherWorker ? 'other-worker' : ''}`}
                                onClick={() => handleOpenReport(site, household)}
                                title={isOtherWorker ? '다른 작업자가 완료한 세대입니다.' : undefined}
                              >
                                <span>
                                  {isOtherWorker
                                    ? '제출 완료'
                                    : statusType === 'COMPLETED'
                                      ? '보고서 조회'
                                      : statusType === 'UNSUBMITTED'
                                        ? '보고서 작성'
                                        : '보고서 수정'}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* ── WORK REPORT MODAL ── */}
      <WorkReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => {
          setIsReportDialogOpen(false);
          setSelectedSite(undefined);
          setSelectedHousehold(undefined);
          setSelectedReport(undefined);
        }}
        site={selectedSite}
        household={selectedHousehold}
        existingReport={selectedReport}
        onSubmitted={loadInitialData}
      />

    </div>
  );
}
