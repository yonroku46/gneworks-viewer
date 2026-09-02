'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SlideDialog from './SlideDialog';
import { WorkReport } from '@/data/reportData';
import { getStoredReports, subscribeToReportsUpdate } from '@/data/reportStorage';
import {
  AssignedRegion,
  getStoredAssignedRegions,
  subscribeToAssignedRegionsUpdate,
} from '@/data/regionStorage';
import {
  Search,
  ClipboardList,
  RotateCcw,
} from 'lucide-react';
import WorkHistoryCard from '@/components/common/WorkHistoryCard';
import './WorkHistoryDialog.scss';

export type DatePreset = 'all' | 'today' | 'week' | 'month' | 'custom';
export type StatusFilterType = 'all' | '확인완료' | '검토대기' | '수정필요';

interface WorkHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReport?: (report: WorkReport) => void;
}

export default function WorkHistoryDialog({
  isOpen,
  onClose,
  onSelectReport,
}: WorkHistoryDialogProps) {
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [assignedRegions, setAssignedRegions] = useState<AssignedRegion[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionKey, setSelectedRegionKey] = useState<string>('all'); // 'all' or 'sido_sigungu'
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');

  useEffect(() => {
    setReports(getStoredReports());
    setAssignedRegions(getStoredAssignedRegions());

    const unsubReports = subscribeToReportsUpdate(reps => setReports(reps));
    const unsubRegions = subscribeToAssignedRegionsUpdate(regs => setAssignedRegions(regs));

    return () => {
      unsubReports();
      unsubRegions();
    };
  }, []);

  // Available unique regions with report counts
  const availableRegions = useMemo(() => {
    const regionMap = new Map<string, { label: string; count: number; sido: string; sigungu: string }>();

    reports.forEach(r => {
      const key = `${r.sido}_${r.sigungu}`;
      const label = `${r.sido} ${r.sigungu}`;
      if (!regionMap.has(key)) {
        regionMap.set(key, { label, count: 0, sido: r.sido, sigungu: r.sigungu });
      }
      regionMap.get(key)!.count += 1;
    });

    return Array.from(regionMap.entries()).map(([key, data]) => ({
      key,
      label: data.label,
      count: data.count,
    }));
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let cutoffDate = '';
    if (datePreset === 'today') {
      cutoffDate = todayStr;
    } else if (datePreset === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      cutoffDate = d.toISOString().split('T')[0];
    } else if (datePreset === 'month') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      cutoffDate = d.toISOString().split('T')[0];
    }

    return reports
      .filter(r => {
        // Region filter (sido_sigungu)
        if (selectedRegionKey !== 'all') {
          const rKey = `${r.sido}_${r.sigungu}`;
          if (rKey !== selectedRegionKey) return false;
        }

        // Status filter
        if (statusFilter !== 'all' && r.status !== statusFilter) {
          return false;
        }

        // Date filter
        const rawDate = r.installDate || (r.reportTime ? r.reportTime.split(' ')[0] : '');
        const normDate = rawDate ? rawDate.replace(/\./g, '-') : '';

        if (datePreset === 'custom') {
          if (customStartDate && normDate && normDate < customStartDate) return false;
          if (customEndDate && normDate && normDate > customEndDate) return false;
        } else if (datePreset !== 'all' && normDate) {
          if (normDate < cutoffDate) return false;
        }

        // Text search filter
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const matches =
            r.siteName.toLowerCase().includes(q) ||
            r.dong.toLowerCase().includes(q) ||
            r.ho.toLowerCase().includes(q) ||
            (r.headName && r.headName.toLowerCase().includes(q)) ||
            (r.address && r.address.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = a.reportTime || a.installDate || '';
        const timeB = b.reportTime || b.installDate || '';
        return timeB.localeCompare(timeA);
      });
  }, [reports, selectedRegionKey, statusFilter, datePreset, customStartDate, customEndDate, searchQuery]);

  // Group filtered reports by Site Name
  const groupedBySite = useMemo(() => {
    const map = new Map<string, { siteName: string; address: string; items: WorkReport[] }>();

    filteredReports.forEach(r => {
      if (!map.has(r.siteName)) {
        map.set(r.siteName, {
          siteName: r.siteName,
          address: r.address || `${r.sido} ${r.sigungu} ${r.eupmyeondong}`,
          items: [],
        });
      }
      map.get(r.siteName)!.items.push(r);
    });

    return Array.from(map.values());
  }, [filteredReports]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedRegionKey('all');
    setDatePreset('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setStatusFilter('all');
  };

  const isFiltered =
    searchQuery !== '' ||
    selectedRegionKey !== 'all' ||
    datePreset !== 'all' ||
    customStartDate !== '' ||
    customEndDate !== '' ||
    statusFilter !== 'all';

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={onClose}
      title="작업 이력 조회"
      className="work-history-dialog"
    >
      <div className="work-history-modal-body">
        {/* ── 1. SEARCH BAR ── */}
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
              >
                ×
              </button>
            )}
          </div>
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
              <span className="count-pill">{reports.length}</span>
            </button>
            {availableRegions.map(reg => (
              <button
                key={reg.key}
                type="button"
                className={`region-tab-btn ${selectedRegionKey === reg.key ? 'active' : ''}`}
                onClick={() => setSelectedRegionKey(reg.key)}
              >
                <span>{reg.label}</span>
                <span className="count-pill">{reg.count}</span>
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
                    const d = new Date();
                    d.setDate(d.getDate() - 7);
                    setCustomStartDate(d.toISOString().split('T')[0]);
                  }
                  if (!customEndDate) {
                    setCustomEndDate(new Date().toISOString().split('T')[0]);
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
                className={`pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                전체
              </button>
              <button
                type="button"
                className={`pill-btn status-completed ${statusFilter === '확인완료' ? 'active' : ''}`}
                onClick={() => setStatusFilter('확인완료')}
              >
                <span className="status-dot green" />
                <span>확인완료</span>
              </button>
              <button
                type="button"
                className={`pill-btn status-pending ${statusFilter === '검토대기' ? 'active' : ''}`}
                onClick={() => setStatusFilter('검토대기')}
              >
                <span className="status-dot amber" />
                <span>검토대기</span>
              </button>
              <button
                type="button"
                className={`pill-btn status-revise ${statusFilter === '수정필요' ? 'active' : ''}`}
                onClick={() => setStatusFilter('수정필요')}
              >
                <span className="status-dot red" />
                <span>수정필요</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 4. SUMMARY COUNT STRIP ── */}
        <div className="history-summary-strip">
          <span className="summary-count">
            조회 결과 <strong>{filteredReports.length}</strong>건
          </span>
          <span className="summary-tip">항목을 누르면 상세 보고서가 열립니다</span>
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
                      key={report.id}
                      report={report}
                      onClick={() => onSelectReport && onSelectReport(report)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SlideDialog>
  );
}
