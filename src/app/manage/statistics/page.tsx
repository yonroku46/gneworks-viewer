'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import AdminService from '@/api/service/AdminService';
import CustomSelect from '@/components/common/CustomSelect';
import { KOREA_ADMIN_REGIONS } from '@/constants/regions';
import '../ManageLayout.scss';
import './Statistics.scss';

export default function ManageStatisticsPage() {
  const { enqueueSnackbar } = useSnackbar();

  // 기본 검색 월 및 최대 선택 가능 월: 현재 연월 (예: 2026-10)
  const currentYearMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, []);

  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(currentYearMonth);
  const [activeYearMonth, setActiveYearMonth] = useState<string>(currentYearMonth);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 시/도 지역 필터 (디폴트: 'ALL' 전국)
  const [selectedSido, setSelectedSido] = useState<string>('ALL');

  // 통계 데이터 상태
  const [statsData, setStatsData] = useState<ServiceStatisticsRes | null>(null);

  // 시/도 목록
  const sidoList = useMemo(() => {
    return KOREA_ADMIN_REGIONS.map((s) => s.name);
  }, []);

  // 전체 소방관할 기본 0값 템플릿 목록 (245개 지역)
  const masterRegionList = useMemo(() => {
    const list: RegionMonthlyStat[] = [];
    KOREA_ADMIN_REGIONS.forEach((sido) => {
      sido.sigungus.forEach((sg) => {
        const regionId = sg.regionId || `REG_${sido.code}_${sg.name}`;
        const displayName = `${sido.name} ${sg.name}`;
        list.push({
          regionId,
          sidoName: sido.name,
          regionName: sg.name,
          displayName,
          totalSites: 0,
          totalTarget: 0,
          completedTarget: 0,
          progressRate: 0,
          totalReports: 0,
          completedReports: 0,
          pendingReports: 0,
          issueReportsCount: 0,
          totalWorkers: 0,
        });
      });
    });
    return list;
  }, []);

  // 데이터 조회 함수
  const fetchStatistics = useCallback(async (yearMonth: string) => {
    setIsLoading(true);
    try {
      const data = await AdminService.getServiceStatistics(yearMonth);
      setStatsData(data);
      setActiveYearMonth(yearMonth);
    } catch (error: any) {
      console.error('Failed to load statistics', error);
      // 조회 실패 시에도 빈 0 객체로 세팅하여 전체 테이블 구조 유지
      setStatsData({
        yearMonth,
        baseDate: undefined,
        totalRegionCount: masterRegionList.length,
        summary: {
          totalSites: 0,
          totalTarget: 0,
          completedTarget: 0,
          overallProgressRate: 0,
          totalReports: 0,
          completedReports: 0,
          pendingReports: 0,
          issueReportsCount: 0,
          totalWorkers: 0,
        },
        list: [],
      });
      setActiveYearMonth(yearMonth);
      enqueueSnackbar('지역별 통계 데이터를 불러오는데 실패하였습니다.', { variant: 'warning' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, masterRegionList.length]);

  useEffect(() => {
    fetchStatistics(selectedYearMonth);
  }, [fetchStatistics, selectedYearMonth]);

  // 월 변경 시 즉시 조회 (이번 달 이후는 선택 불가)
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val && val > currentYearMonth) {
      enqueueSnackbar('이번 달 이후의 통계는 조회할 수 없습니다.', { variant: 'warning' });
      return;
    }
    setSelectedYearMonth(val);
    if (val) {
      fetchStatistics(val);
    }
  };

  // 실제 데이터 매핑된 전체 지역 목록 (데이터 없는 지역은 0으로 채움)
  const mergedList = useMemo(() => {
    if (!statsData?.list || statsData.list.length === 0) {
      return masterRegionList;
    }
    const dataMap = new Map<string, RegionMonthlyStat>();
    statsData.list.forEach((item) => {
      if (item.regionId) {
        dataMap.set(item.regionId, item);
      }
      const key = `${item.sidoName} ${item.regionName}`;
      dataMap.set(key, item);
    });

    return masterRegionList.map((base) => {
      const match = (base.regionId && dataMap.get(base.regionId)) || dataMap.get(base.displayName);
      if (match) {
        return {
          ...base,
          ...match,
          displayName: base.displayName,
        };
      }
      return base;
    });
  }, [statsData, masterRegionList]);

  // 선택된 시/도 필터링 목록
  const filteredList = useMemo(() => {
    if (selectedSido === 'ALL') {
      return mergedList;
    }
    return mergedList.filter((item) => item.sidoName === selectedSido);
  }, [mergedList, selectedSido]);

  // 필터링된 목록 기준 합계 계산
  const summary = useMemo(() => {
    let sumSites = 0;
    let sumTarget = 0;
    let sumCompletedTarget = 0;
    let sumReports = 0;
    let sumCompletedReports = 0;
    let sumPendingReports = 0;
    let sumIssueReports = 0;

    filteredList.forEach((item) => {
      sumSites += item.totalSites;
      sumTarget += item.totalTarget;
      sumCompletedTarget += item.completedTarget;
      sumReports += item.totalReports;
      sumCompletedReports += item.completedReports;
      sumPendingReports += item.pendingReports;
      sumIssueReports += item.issueReportsCount;
    });

    return {
      totalSites: sumSites,
      totalTarget: sumTarget,
      completedTarget: sumCompletedTarget,
      overallProgressRate: sumTarget > 0 ? Math.round((sumCompletedTarget / sumTarget) * 100) : 0,
      totalReports: sumReports,
      completedReports: sumCompletedReports,
      pendingReports: sumPendingReports,
      issueReportsCount: sumIssueReports,
    };
  }, [filteredList]);

  // 연월 텍스트 포맷 (예: 2026-09 -> 2026년 09월)
  const formatYearMonthDisplay = (ym: string) => {
    const [y, m] = ym.split('-');
    return `${y}년 ${m}월`;
  };

  // 집계 기준일 텍스트 포맷 (예: 2026-10-01 -> 2026.10.01 00:00 기준)
  const formatBaseDateDisplay = (baseDate?: string) => {
    if (!baseDate) return '';
    try {
      const parts = baseDate.split('-');
      if (parts.length === 3) {
        return `${parts[0]}.${parts[1]}.${parts[2]}`;
      }
    } catch {}
    return `${baseDate}`;
  };

  return (
    <div className="manage-statistics-page">
      {/* ── 관리자 표준 페이지 헤더 ── */}
      <div className="page-header-row">
        <div>
          <h2>서비스 통계</h2>
          <p>전국 지역별 현장 진행 현황 및 확인서 처리 실적을 집계합니다.</p>
        </div>
        <div className="page-header-actions">
          <div className="stats-header-filters">
            <input 
              type="month"
              value={selectedYearMonth}
              max={currentYearMonth}
              onChange={handleMonthChange}
              onClick={(e) => {
                if (typeof e.currentTarget.showPicker === 'function') {
                  try {
                    e.currentTarget.showPicker();
                  } catch {}
                }
              }}
              onFocus={(e) => {
                if (typeof e.currentTarget.showPicker === 'function') {
                  try {
                    e.currentTarget.showPicker();
                  } catch {}
                }
              }}
              className="stats-month-input"
              aria-label="조회 연월 선택"
            />
            <CustomSelect
              value={selectedSido}
              onChange={(e) => setSelectedSido(e.target.value)}
              className="stats-sido-custom-select"
              sizeVariant="md"
              aria-label="지역 필터"
            >
              <option value="ALL">전체</option>
              {sidoList.map((sido) => (
                <option key={sido} value={sido}>
                  {sido}
                </option>
              ))}
            </CustomSelect>
          </div>
        </div>
      </div>

      {/* ── 지역별 점검내역 테이블 박스 ── */}
      <div className="stats-table-box">
        {/* 상단 짙은 남색 헤더 바 (타이틀 및 집계 기준일 표시) */}
        <div className="table-top-bar">
          <div className="bar-title-group">
            <span className="bar-title">
              {formatYearMonthDisplay(activeYearMonth)} 지역별 현황
            </span>
            {statsData?.baseDate && (
              <span className="bar-base-date-badge">
                집계기준: {formatBaseDateDisplay(statsData.baseDate)}
              </span>
            )}
          </div>
        </div>

        {/* 대시보드 메트릭 기반 2단 복합 헤더 매트릭스 테이블 */}
        <div className="table-responsive-wrapper">
          <table className="stats-matrix-table">
            <thead>
              {/* 헤더 1행 */}
              <tr>
                <th rowSpan={2} className="col-sticky-region">
                  지역
                </th>
                <th rowSpan={2}>
                  현장 수
                </th>
                <th colSpan={2}>보급 세대 현황</th>
                <th colSpan={4}>제출 확인서 현황</th>
                <th rowSpan={2} className="col-rate">
                  진행률
                </th>
              </tr>
              {/* 헤더 2행 */}
              <tr>
                <th>대상 세대</th>
                <th>완료 세대</th>
                <th>누적 제출</th>
                <th>승인 완료</th>
                <th>검토 대기</th>
                <th className="col-last-issue">특이사항</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="empty-row">
                  <td colSpan={9}>
                    지역별 통계 데이터를 집계 중입니다...
                  </td>
                </tr>
              ) : (
                filteredList.map((row) => (
                  <tr key={row.regionId}>
                    <td className="col-sticky-region">{row.displayName}</td>
                    <td className="col-num">{row.totalSites.toLocaleString()}곳</td>
                    <td className="col-num">{row.totalTarget.toLocaleString()}</td>
                    <td className="col-num">{row.completedTarget.toLocaleString()}</td>
                    <td className="col-num">{row.totalReports.toLocaleString()}건</td>
                    <td className="col-num">{row.completedReports.toLocaleString()}건</td>
                    <td className="col-num">{row.pendingReports > 0 ? `${row.pendingReports}건` : '-'}</td>
                    <td className="col-num col-last-issue">{row.issueReportsCount > 0 ? `${row.issueReportsCount}건` : '-'}</td>
                    <td className="col-rate">{row.progressRate}%</td>
                  </tr>
                ))
              )}
            </tbody>
            {/* 합계 행 (Total Footer) - 항상 표시 */}
            {!isLoading && (
              <tfoot>
                <tr>
                  <td className="col-sticky-region">전체 합계</td>
                  <td>{summary.totalSites.toLocaleString()}곳</td>
                  <td>{summary.totalTarget.toLocaleString()}</td>
                  <td>{summary.completedTarget.toLocaleString()}</td>
                  <td>{summary.totalReports.toLocaleString()}건</td>
                  <td>{summary.completedReports.toLocaleString()}건</td>
                  <td>{summary.pendingReports.toLocaleString()}건</td>
                  <td className="col-last-issue">{summary.issueReportsCount.toLocaleString()}건</td>
                  <td className="col-rate">{summary.overallProgressRate}%</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
