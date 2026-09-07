'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import SlideDialog from './SlideDialog';
import PortalService from '@/api/service/PortalService';
import { Search, ClipboardList, RotateCcw, ArrowUpDown, X } from 'lucide-react';
import WorkHistoryCard from '@/components/common/WorkHistoryCard';
import './WorkHistoryDialog.scss';

interface WorkHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sites?: SiteDetail[];
  onSelectReport?: (report: WorkReport) => void;
}

export default function WorkHistoryDialog({
  isOpen,
  onClose,
  sites = [],
  onSelectReport,
}: WorkHistoryDialogProps) {
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [assignedRegions, setAssignedRegions] = useState<UserAssignedRegionDetail[]>([]);
  const [internalSites, setInternalSites] = useState<SiteDetail[]>(sites || []);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionKey, setSelectedRegionKey] = useState<string>('all');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Server-side Infinite Scroll State
  const PAGE_CHUNK_SIZE = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    PortalService.getAssignedRegions()
      .then(regs => setAssignedRegions(regs || []))
      .catch(err => {
        console.error('[WorkHistoryDialog] getAssignedRegions error:', err);
        setAssignedRegions([]);
      });

    if (sites && sites.length > 0) {
      setInternalSites(sites);
    } else {
      PortalService.getSites()
        .then(res => setInternalSites(res || []))
        .catch(err => {
          console.error('[WorkHistoryDialog] getSites error:', err);
          setInternalSites([]);
        });
    }
  }, [isOpen, sites]);

  // Site ID -> Site Detail Map for exact region resolution
  const siteMap = useMemo(() => {
    const map = new Map<string, SiteDetail>();
    internalSites.forEach(s => {
      if (s.siteId) map.set(s.siteId, s);
    });
    return map;
  }, [internalSites]);

  // Available assigned regions for filtering
  const availableRegions = useMemo(() => {
    return assignedRegions.map(reg => {
      const key = reg.regionId ? `reg_${reg.regionId}` : `${reg.sido}_${reg.sigungu}`;
      const label = `${reg.sido} ${reg.sigungu}`;
      return {
        key,
        label,
        sido: reg.sido,
        sigungu: reg.sigungu,
        regionId: reg.regionId,
        isAssigned: true,
      };
    });
  }, [assignedRegions]);

  const getDateRange = () => {
    const todayStr = dayjs().format('YYYY-MM-DD');
    if (datePreset === 'today') {
      return { start: todayStr, end: todayStr };
    }
    if (datePreset === 'week') {
      return { start: dayjs().subtract(7, 'day').format('YYYY-MM-DD'), end: todayStr };
    }
    if (datePreset === 'month') {
      return { start: dayjs().subtract(30, 'day').format('YYYY-MM-DD'), end: todayStr };
    }
    if (datePreset === 'custom') {
      return { start: customStartDate || undefined, end: customEndDate || undefined };
    }
    return { start: undefined, end: undefined };
  };

  const fetchReports = async (pageToFetch: number, isAppend: boolean = false) => {
    if (!isOpen) return;
    if (isAppend) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const targetReg = selectedRegionKey !== 'all'
        ? availableRegions.find(ar => ar.key === selectedRegionKey)
        : undefined;
      const { start, end } = getDateRange();

      const res = await PortalService.getReports({
        page: pageToFetch,
        size: PAGE_CHUNK_SIZE,
        query: searchQuery.trim() || undefined,
        regionId: targetReg?.regionId || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        installStartDate: start,
        installEndDate: end,
      });

      if (isAppend) {
        setReports(prev => [...prev, ...(res?.list || [])]);
      } else {
        setReports(res?.list || []);
      }
      setTotalCount(res?.totalCount || 0);
      setCurrentPage(pageToFetch);
      setHasMore(Boolean(res?.hasNext));
    } catch (err) {
      console.error('[WorkHistoryDialog] getReports error:', err);
      if (!isAppend) {
        setReports([]);
        setTotalCount(0);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // 필터 조건 변경 시 1페이지부터 다시 취득
  useEffect(() => {
    if (isOpen) {
      fetchReports(1, false);
    }
  }, [
    isOpen,
    searchQuery,
    selectedRegionKey,
    datePreset,
    customStartDate,
    customEndDate,
    statusFilter,
  ]);

  // 다음 페이지 로드 핸들러
  const handleLoadMore = () => {
    if (!hasMore || isLoading || isLoadingMore) return;
    fetchReports(currentPage + 1, true);
  };

  // IntersectionObserver 자동 로드
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target || !hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '120px' }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, isLoadingMore, currentPage]);

  const sortedReports = useMemo(() => {
    if (sortOrder === 'desc') return reports;
    return [...reports].sort((a, b) => {
      const timeA = a.reportTime || a.installDate || '';
      const timeB = b.reportTime || b.installDate || '';
      return timeA.localeCompare(timeB);
    });
  }, [reports, sortOrder]);

  const groupedBySite = useMemo(() => {
    const map = new Map<string, { siteName: string; address: string; items: WorkReport[] }>();

    sortedReports.forEach(r => {
      const siteName = r.siteName || '기타 현장';
      if (!map.has(siteName)) {
        map.set(siteName, {
          siteName,
          address: r.address || `${r.sido || ''} ${r.sigungu || ''} ${r.eupmyeondong || ''}`.trim(),
          items: [],
        });
      }
      map.get(siteName)!.items.push(r);
    });

    return Array.from(map.values());
  }, [sortedReports]);

  const statusCounts = useMemo(() => {
    return {
      all: totalCount,
      completed: reports.filter(r => r.status === 'COMPLETED').length,
      pending: reports.filter(r => r.status === 'PENDING').length,
      rejected: reports.filter(r => r.status === 'REJECTED').length,
    };
  }, [reports, totalCount]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedRegionKey('all');
    setDatePreset('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setStatusFilter('ALL');
    setSortOrder('desc');
  };

  const isFiltered =
    searchQuery !== '' ||
    selectedRegionKey !== 'all' ||
    datePreset !== 'all' ||
    customStartDate !== '' ||
    customEndDate !== '' ||
    statusFilter !== 'ALL' ||
    sortOrder !== 'desc';

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={onClose}
      title="작업 이력 조회"
      className="work-history-dialog"
    >
      <div className="work-history-modal-body">
        {/* ── 1. SEARCH BAR & SORT ORDER ── */}
        <div className="history-search-row">
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="아파트명, 동/호수, 세대주명 검색"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
                title="검색어 지우기"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn-sort-order"
            onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
            title="정렬 순서 변경"
          >
            <ArrowUpDown size={13} />
            <span>{sortOrder === 'desc' ? '최신순' : '과거순'}</span>
          </button>
          {isFiltered && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleReset}
              title="필터 초기화"
            >
              <RotateCcw size={13} />
              <span>초기화</span>
            </button>
          )}
        </div>

        {/* ── 2. REGION FILTER TABS (지역별 선택 - 가로 스크롤 탭) ── */}
        <div className="region-filter-section">
          <div className="region-tabs-track">
            <button
              type="button"
              className={`region-tab-btn ${selectedRegionKey === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedRegionKey('all')}
            >
              <span>전체 지역</span>
              {selectedRegionKey === 'all' && <span className="count-pill">{totalCount}</span>}
            </button>
            {availableRegions.map(reg => (
              <button
                key={reg.key}
                type="button"
                className={`region-tab-btn ${selectedRegionKey === reg.key ? 'active' : ''}`}
                onClick={() => setSelectedRegionKey(reg.key)}
              >
                <span>{reg.label}</span>
                {selectedRegionKey === reg.key && <span className="count-pill">{totalCount}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. FILTER CONTROLS (기간 직접 설정 및 상태 필터) ── */}
        <div className="filter-controls-box">
          {/* 기간 선택 라인 */}
          <div className="filter-line">
            <span className="line-label">기간</span>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-btn ${datePreset === 'all' ? 'active' : ''}`}
                onClick={() => setDatePreset('all')}
              >
                전체
              </button>
              <button
                type="button"
                className={`pill-btn ${datePreset === 'today' ? 'active' : ''}`}
                onClick={() => setDatePreset('today')}
              >
                오늘
              </button>
              <button
                type="button"
                className={`pill-btn ${datePreset === 'week' ? 'active' : ''}`}
                onClick={() => setDatePreset('week')}
              >
                최근 7일
              </button>
              <button
                type="button"
                className={`pill-btn ${datePreset === 'month' ? 'active' : ''}`}
                onClick={() => setDatePreset('month')}
              >
                최근 30일
              </button>
              <button
                type="button"
                className={`pill-btn ${datePreset === 'custom' ? 'active' : ''}`}
                onClick={() => {
                  setDatePreset('custom');
                  if (!customStartDate) {
                    setCustomStartDate(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
                  }
                  if (!customEndDate) {
                    setCustomEndDate(dayjs().format('YYYY-MM-DD'));
                  }
                }}
              >
                <span>직접 설정</span>
              </button>
            </div>
          </div>

          {/* 직접 설정 날짜 입력 폼 */}
          {datePreset === 'custom' && (
            <div className="custom-date-row">
              <input
                type="date"
                className="date-input"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
              />
              <span className="date-sep">~</span>
              <input
                type="date"
                className="date-input"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
              />
            </div>
          )}

          {/* 상태 선택 라인 */}
          <div className="filter-line">
            <span className="line-label">상태</span>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                <span>전체 ({statusCounts.all})</span>
              </button>
              <button
                type="button"
                className={`pill-btn status-completed ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('COMPLETED')}
              >
                <span className="status-dot green" />
                <span>확인완료 ({statusCounts.completed})</span>
              </button>
              <button
                type="button"
                className={`pill-btn status-pending ${statusFilter === 'PENDING' ? 'active' : ''}`}
                onClick={() => setStatusFilter('PENDING')}
              >
                <span className="status-dot amber" />
                <span>검토대기 ({statusCounts.pending})</span>
              </button>
              <button
                type="button"
                className={`pill-btn status-revise ${statusFilter === 'REJECTED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('REJECTED')}
              >
                <span className="status-dot red" />
                <span>수정필요 ({statusCounts.rejected})</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 5. SITES & HOUSEHOLDS LIST (모던 카드 그리드) ── */}
        <div className="history-sites-container">
          {groupedBySite.length === 0 ? (
            <div className="history-empty-card">
              <ClipboardList size={38} className="empty-icon" />
              <p className="empty-title">일치하는 작업 이력이 없습니다.</p>
              <p className="empty-sub">선택된 지역이나 기간/상태 필터를 변경해 보세요.</p>
              {isFiltered && (
                <button type="button" className="btn-reset-empty" onClick={handleReset}>
                  조건 초기화
                </button>
              )}
            </div>
          ) : (
            groupedBySite.map(group => (
              <div key={group.siteName} className="history-site-group-card">
                {/* Site Header: icon-box 제거 및 텍스트 단정화 */}
                <div className="site-group-header">
                  <div className="site-header-left">
                    <h3 className="site-title">{group.siteName}</h3>
                    {group.address && <span className="site-address">{group.address}</span>}
                  </div>
                  <span className="site-badge">{group.items.length}세대</span>
                </div>

                {/* Households List: 공용 WorkHistoryCard 적용 */}
                <div className="site-households-list">
                  {group.items.map(report => (
                    <WorkHistoryCard
                      key={report.reportId}
                      report={report}
                      onClick={() => onSelectReport && onSelectReport(report)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}

          {/* 무한 스크롤 센티넬 및 로딩 / 더보기 안내 푸터 */}
          {reports.length > 0 && (
            <div className="infinite-scroll-footer">
              {hasMore ? (
                <>
                  <div ref={observerTargetRef} className="scroll-sentinel" />
                  <button
                    type="button"
                    className="btn-load-more"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    <span>
                      {isLoadingMore ? '작업 이력을 불러오는 중...' : `더 보기 (${reports.length} / ${totalCount}건)`}
                    </span>
                  </button>
                </>
              ) : (
                totalCount > PAGE_CHUNK_SIZE && (
                  <p className="all-loaded-text">모든 작업 이력을 불러왔습니다. (총 {totalCount}건)</p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </SlideDialog>
  );
}
