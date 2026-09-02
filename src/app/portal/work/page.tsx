'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { getStoredSites, subscribeToSitesUpdate } from '@/data/siteStorage';
import { SiteInfo, Household } from '@/data/siteData';
import {
  AssignedRegion,
  getStoredAssignedRegions,
  subscribeToAssignedRegionsUpdate,
} from '@/data/regionStorage';
import {
  getStoredReports,
  subscribeToReportsUpdate,
} from '@/data/reportStorage';
import { WorkReport } from '@/data/reportData';
import WorkReportDialog, { TargetHousehold } from '@/components/dialog/WorkReportDialog';
import StatusBadge from '@/components/common/StatusBadge';
import {
  MapPin,
  Building2,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileEdit,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Home,
  User,
  Sparkles,
  Circle,
  Hourglass,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import './Work.scss';

export type WorkStatusFilter =
  | 'all'
  | 'uncompleted'
  | 'unsubmitted'
  | 'pending'
  | 'revise'
  | 'completed';

const STATUS_KEY_MAP: Record<'미제출' | '검토대기' | '확인완료' | '수정필요', string> = {
  '미제출': 'unsubmitted',
  '검토대기': 'pending',
  '확인완료': 'completed',
  '수정필요': 'revise',
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

  // Storage states
  const [allSites, setAllSites] = useState<SiteInfo[]>([]);
  const [assignedRegions, setAssignedRegions] = useState<AssignedRegion[]>([]);
  const [reports, setReports] = useState<WorkReport[]>([]);

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

  // Report dialog target
  const [reportTarget, setReportTarget] = useState<TargetHousehold | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  useEffect(() => {
    setAllSites(getStoredSites());
    setAssignedRegions(getStoredAssignedRegions());
    setReports(getStoredReports());

    const unsubSites = subscribeToSitesUpdate(sites => setAllSites(sites));
    const unsubRegions = subscribeToAssignedRegionsUpdate(regions => setAssignedRegions(regions));
    const unsubReports = subscribeToReportsUpdate(reps => setReports(reps));

    return () => {
      unsubSites();
      unsubRegions();
      unsubReports();
    };
  }, []);


  // 보고서 매핑 맵: `siteName_dong_ho` => WorkReport
  const reportMap = useMemo(() => {
    const map = new Map<string, WorkReport>();
    reports.forEach(r => {
      map.set(`${r.siteName}_${r.dong}_${r.ho}`, r);
    });
    return map;
  }, [reports]);

  // 1. 담당 지역에 속하는 현장들만 필터링
  const assignedSites = useMemo(() => {
    if (assignedRegions.length === 0) return [];

    return allSites.filter(site => {
      // 선택된 지역 탭 필터링
      if (selectedRegionId !== 'ALL') {
        const selectedRegion = assignedRegions.find(r => r.id === selectedRegionId);
        if (!selectedRegion) return false;
        return site.sido === selectedRegion.sido && site.sigungu === selectedRegion.sigungu;
      }

      // 'ALL'인 경우 담당 중인 지역 중 하나와 일치하면 포함
      return assignedRegions.some(
        r => r.sido === site.sido && r.sigungu === site.sigungu
      );
    });
  }, [allSites, assignedRegions, selectedRegionId]);

  // 2. 검색어 및 작업 상태에 맞게 현장 및 세대 필터링
  const filteredSitesWithHouseholds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return assignedSites
      .map(site => {
        const matchesSiteName = site.name.toLowerCase().includes(query);
        const matchesAddress = site.address.toLowerCase().includes(query);

        // 세대 필터링
        const filteredHouseholds = site.households.filter(h => {
          // 1. 검색어 필터링
          if (query && !matchesSiteName && !matchesAddress) {
            const dongFormatted = `${h.dong}동`;
            const hoFormatted = `${h.ho}호`;
            const seqVal = h.seq !== undefined ? String(h.seq) : '';

            const matchesKeyword =
              (seqVal && seqVal.includes(query)) ||
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
            const reportKey = `${site.name}_${h.dong}_${h.ho}`;
            const report = reportMap.get(reportKey);
            const statusKey = report ? STATUS_KEY_MAP[report.status] : 'unsubmitted';

            if (statusFilter === 'uncompleted') {
              if (statusKey === 'completed') return false; // 확인 완료된 것은 제외!
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
  }, [assignedSites, searchQuery, statusFilter, reportMap]);

  // 현장 접기/펼치기 토글
  const toggleSiteExpand = (siteId: string) => {
    setExpandedSiteIds(prev => ({ ...prev, [siteId]: !prev[siteId] }));
  };

  // 보고서 작성 다이얼로그 열기
  const handleOpenReport = (site: SiteInfo, household: Household) => {
    const key = `${site.name}_${household.dong}_${household.ho}`;
    const existing = reportMap.get(key);

    setReportTarget({
      siteId: site.id,
      siteName: site.name,
      sido: site.sido,
      sigungu: site.sigungu,
      eupmyeondong: site.eupmyeondong || '',
      address: site.address,
      dong: household.dong,
      ho: household.ho,
      headName: household.headName,
      existingReport: existing,
    });
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
            <button
              type="button"
              className={`region-tab-btn ${selectedRegionId === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedRegionId('ALL')}
            >
              전체 담당 지역
            </button>
            {assignedRegions.map(reg => {
              const sitesCount = allSites.filter(
                s => s.sido === reg.sido && s.sigungu === reg.sigungu
              ).length;

              return (
                <button
                  key={reg.id}
                  type="button"
                  className={`region-tab-btn ${selectedRegionId === reg.id ? 'active' : ''}`}
                  onClick={() => setSelectedRegionId(reg.id)}
                >
                  <span>
                    {reg.sido} {reg.sigungu}
                  </span>
                  <span className="count-badge">{sitesCount}</span>
                </button>
              );
            })}
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
        {assignedRegions.length === 0 ? (
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
            const isExpanded = expandedSiteIds[site.id] ?? false;

            // 현장 내 세대들의 보고서 통계
            const submittedCount = households.filter(h => {
              const r = reportMap.get(`${site.name}_${h.dong}_${h.ho}`);
              return r && r.status === '확인완료';
            }).length;

            const pendingCount = households.filter(h => {
              const r = reportMap.get(`${site.name}_${h.dong}_${h.ho}`);
              return r && r.status === '검토대기';
            }).length;

            const total = households.length;
            const progressPercent = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

            return (
              <div key={site.id} className={`portal-site-accordion-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
                {/* ── SITE HEADER ── */}
                <div
                  className="site-card-header"
                  onClick={() => toggleSiteExpand(site.id)}
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
                      const reportKey = `${site.name}_${household.dong}_${household.ho}`;
                      const report = reportMap.get(reportKey);

                      let statusType: '미제출' | '검토대기' | '확인완료' | '수정필요' = '미제출';
                      if (report) {
                        statusType = report.status;
                      }

                      const statusKey = STATUS_KEY_MAP[statusType];

                      return (
                        <div key={household.id} className={`household-row status-${statusKey}`}>
                          <div className={`status-strip ${statusKey}`} title={`상태: ${statusType}`}>
                            {statusType === '확인완료' && <Check size={14} strokeWidth={3} />}
                            {statusType === '검토대기' && <Hourglass size={13} strokeWidth={2.5} />}
                            {statusType === '수정필요' && <AlertCircle size={14} strokeWidth={2.5} />}
                            {statusType === '미제출' && <Circle size={12} strokeWidth={2.5} />}
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
                                className={`btn-report-action ${statusType === '미제출' ? 'primary' : 'secondary'}`}
                                onClick={() => handleOpenReport(site, household)}
                              >
                                <span>
                                  {statusType === '확인완료'
                                    ? '보고서 조회'
                                    : statusType === '미제출'
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
        onClose={() => setIsReportDialogOpen(false)}
        target={reportTarget}
        onSubmitted={() => setReports(getStoredReports())}
      />
    </div>
  );
}
