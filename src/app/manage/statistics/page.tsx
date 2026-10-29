'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import AdminService from '@/api/service/AdminService';
import CustomSelect from '@/components/common/CustomSelect';
import { KOREA_ADMIN_REGIONS } from '@/constants/regions';
import '../ManageLayout.scss';
import './Statistics.scss';

export default function ManageStatisticsPage() {
  const { enqueueSnackbar } = useSnackbar();

  // 최소 선택 및 조회 가능 일자 / 연월 (서비스 개시 기준: 2026년 9월)
  const minAvailableDate = '2026-09-01';
  const minAvailableYearMonth = '2026-09';

  // 기본 일자 및 최대 선택 가능 일자: 어제 (D-1 전일 마감 집계 기준)
  const maxAvailableDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  // 기본 연월 및 최대 선택 가능 월: 현재 연월 (예: 2026-10)
  const currentYearMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, []);

  // 조회 주기 모드: 'DAILY' (일별) 또는 'MONTHLY' (월별)
  const [periodType, setPeriodType] = useState<'DAILY' | 'MONTHLY'>('DAILY');
  const [selectedDate, setSelectedDate] = useState<string>(() => (maxAvailableDate < minAvailableDate ? minAvailableDate : maxAvailableDate));
  const [activeDate, setActiveDate] = useState<string>(() => (maxAvailableDate < minAvailableDate ? minAvailableDate : maxAvailableDate));
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(() => (currentYearMonth < minAvailableYearMonth ? minAvailableYearMonth : currentYearMonth));
  const [activeYearMonth, setActiveYearMonth] = useState<string>(() => (currentYearMonth < minAvailableYearMonth ? minAvailableYearMonth : currentYearMonth));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedSido, setSelectedSido] = useState<string>('ALL');
  const [isExporting, setIsExporting] = useState<boolean>(false);

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
          cumulativeCompletedTarget: 0,
          progressRate: 0,
          totalReports: 0,
          completedReports: 0,
          pendingReports: 0,
          refusedReports: 0,
          issueReportsCount: 0,
          totalWorkers: 0,
        });
      });
    });
    return list;
  }, []);

  // 데이터 조회 함수
  const fetchStatistics = useCallback(async (type: 'DAILY' | 'MONTHLY', dateOrYm: string) => {
    if (type === 'DAILY') {
      if (dateOrYm < minAvailableDate) {
        enqueueSnackbar('2026년 9월 1일 이전 통계는 조회할 수 없습니다.', { variant: 'warning' });
        return;
      }
      if (dateOrYm > maxAvailableDate) {
        enqueueSnackbar('전일(어제) 마감 기준 통계이므로 당일 및 미래 일자는 조회할 수 없습니다.', { variant: 'warning' });
        return;
      }
    } else {
      if (dateOrYm < minAvailableYearMonth) {
        enqueueSnackbar('2026년 9월 이전 통계는 조회할 수 없습니다.', { variant: 'warning' });
        return;
      }
      if (dateOrYm > currentYearMonth) {
        enqueueSnackbar('이번 달 이후의 통계는 조회할 수 없습니다.', { variant: 'warning' });
        return;
      }
    }
    setIsLoading(true);
    try {
      let data: ServiceStatisticsRes;
      if (type === 'DAILY') {
        data = await AdminService.getDailyServiceStatistics(dateOrYm);
        setActiveDate(dateOrYm);
      } else {
        data = await AdminService.getServiceStatistics(dateOrYm);
        setActiveYearMonth(dateOrYm);
      }
      setStatsData(data);
    } catch (error: any) {
      console.error('Failed to load statistics', error);
      setStatsData({
        periodType: type,
        date: type === 'DAILY' ? dateOrYm : undefined,
        yearMonth: type === 'MONTHLY' ? dateOrYm : undefined,
        baseDate: undefined,
        totalRegionCount: masterRegionList.length,
        summary: {
          totalSites: 0,
          totalTarget: 0,
          completedTarget: 0,
          cumulativeCompletedTarget: 0,
          overallProgressRate: 0,
          totalReports: 0,
          completedReports: 0,
          pendingReports: 0,
          refusedReports: 0,
          issueReportsCount: 0,
          totalWorkers: 0,
        },
        list: [],
      });
      if (type === 'DAILY') {
        setActiveDate(dateOrYm);
      } else {
        setActiveYearMonth(dateOrYm);
      }
      enqueueSnackbar('지역별 통계 데이터를 불러오는데 실패하였습니다.', { variant: 'warning' });
    } finally {
      setIsLoading(false);
    }
  }, [currentYearMonth, enqueueSnackbar, masterRegionList.length, maxAvailableDate, minAvailableDate, minAvailableYearMonth]);

  useEffect(() => {
    if (periodType === 'DAILY') {
      fetchStatistics('DAILY', selectedDate);
    } else {
      fetchStatistics('MONTHLY', selectedYearMonth);
    }
  }, [fetchStatistics, periodType, selectedDate, selectedYearMonth]);

  // 일별 날짜 변경 시
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    if (val < minAvailableDate) {
      enqueueSnackbar('2026년 9월 1일 이전 통계는 조회할 수 없습니다.', { variant: 'warning' });
      e.target.value = selectedDate;
      return;
    }
    if (val > maxAvailableDate) {
      enqueueSnackbar('전일(어제) 마감 기준 통계이므로 당일 및 미래 일자는 조회할 수 없습니다.', { variant: 'warning' });
      e.target.value = selectedDate;
      return;
    }
    setSelectedDate(val);
  };

  // 월별 연월 변경 시
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    if (val < minAvailableYearMonth) {
      enqueueSnackbar('2026년 9월 이전 통계는 조회할 수 없습니다.', { variant: 'warning' });
      e.target.value = selectedYearMonth;
      return;
    }
    if (val > currentYearMonth) {
      enqueueSnackbar('이번 달 이후의 통계는 조회할 수 없습니다.', { variant: 'warning' });
      e.target.value = selectedYearMonth;
      return;
    }
    setSelectedYearMonth(val);
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
    let sumCumulativeCompletedTarget = 0;
    let sumReports = 0;
    let sumCompletedReports = 0;
    let sumPendingReports = 0;
    let sumRefusedReports = 0;
    let sumIssueReports = 0;

    filteredList.forEach((item) => {
      sumSites += item.totalSites;
      sumTarget += item.totalTarget;
      sumCompletedTarget += item.completedTarget;
      sumCumulativeCompletedTarget += (item.cumulativeCompletedTarget || 0);
      sumReports += item.totalReports;
      sumCompletedReports += item.completedReports;
      sumPendingReports += item.pendingReports;
      sumRefusedReports += (item.refusedReports || 0);
      sumIssueReports += item.issueReportsCount;
    });

    return {
      totalSites: sumSites,
      totalTarget: sumTarget,
      completedTarget: sumCompletedTarget,
      cumulativeCompletedTarget: sumCumulativeCompletedTarget,
      overallProgressRate: sumTarget > 0 ? Math.round((sumCumulativeCompletedTarget / sumTarget) * 100) : 0,
      totalReports: sumReports,
      completedReports: sumCompletedReports,
      pendingReports: sumPendingReports,
      refusedReports: sumRefusedReports,
      issueReportsCount: sumIssueReports,
    };
  }, [filteredList]);

  // 연월 텍스트 포맷 (예: 2026-09 -> 2026년 09월)
  const formatYearMonthDisplay = (ym: string) => {
    const parts = ym.split('-');
    if (parts.length >= 2) {
      return `${parts[0]}년 ${parts[1]}월`;
    }
    return ym;
  };

  // 일자 텍스트 포맷 (예: 2026-10-23 -> 2026년 10월 23일)
  const formatDateDisplay = (dt: string) => {
    const parts = dt.split('-');
    if (parts.length === 3) {
      return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
    }
    return dt;
  };

  // 서비스 통계 엑셀 내보내기 핸들러
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const regionName = selectedSido === 'ALL' ? '전국' : selectedSido;
      let fileName = '';
      let sheetName = '';

      if (periodType === 'DAILY') {
        const dateStr = activeDate.replace(/-/g, '');
        fileName = `서비스통계_일별_${dateStr}_${regionName}.xlsx`;
        sheetName = `${dateStr}_${regionName}`;
      } else {
        const [, month] = activeYearMonth.split('-');
        const monthNum = parseInt(month, 10);
        fileName = `서비스통계_월별_${monthNum}월_${regionName}.xlsx`;
        sheetName = `${monthNum}월_${regionName}`;
      }

      const headerRow1 = ['지역', '기간 실적', '', '', '', '', '현황 / 누적', '', '', ''];
      const headerRow2 = ['', '완료 세대', '승인 완료', '검토 대기', '설치 거부', '특이사항', '현장 수', '총 대상 세대', '누적 완료 세대', '진행률'];

      const dataRows = filteredList.map((item) => [
        item.displayName,
        item.completedTarget,
        item.completedReports,
        item.pendingReports,
        item.refusedReports || 0,
        item.issueReportsCount,
        item.totalSites,
        item.totalTarget,
        item.cumulativeCompletedTarget || 0,
        `${item.progressRate}%`,
      ]);

      const footerRow = [
        '전체 합계',
        summary.completedTarget,
        summary.completedReports,
        summary.pendingReports,
        summary.refusedReports,
        summary.issueReportsCount,
        summary.totalSites,
        summary.totalTarget,
        summary.cumulativeCompletedTarget,
        `${summary.overallProgressRate}%`,
      ];

      const wsData = [headerRow1, headerRow2, ...dataRows, footerRow];
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        { s: { r: 0, c: 1 }, e: { r: 0, c: 5 } },
        { s: { r: 0, c: 6 }, e: { r: 0, c: 9 } },
      ];

      ws['!cols'] = [
        { wch: 24 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 14 },
        { wch: 10 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, fileName);

      enqueueSnackbar(`[${fileName}] 파일이 다운로드되었습니다.`, { variant: 'success' });
    } catch (error) {
      console.error('Failed to export statistics excel:', error);
      enqueueSnackbar('엑셀 파일 생성 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsExporting(false);
    }
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
            {/* 일별 / 월별 세그먼트 토글 */}
            <div className="period-toggle-group" role="group" aria-label="조회 단위 선택">
              <button
                type="button"
                className={`period-toggle-btn ${periodType === 'DAILY' ? 'active' : ''}`}
                onClick={() => setPeriodType('DAILY')}
              >
                일별
              </button>
              <button
                type="button"
                className={`period-toggle-btn ${periodType === 'MONTHLY' ? 'active' : ''}`}
                onClick={() => setPeriodType('MONTHLY')}
              >
                월별
              </button>
            </div>

            {/* 일별 선택 시 날짜 피커, 월별 선택 시 연월 피커 */}
            {periodType === 'DAILY' ? (
              <input
                type="date"
                value={selectedDate}
                min={minAvailableDate}
                max={maxAvailableDate}
                onChange={handleDateChange}
                onBlur={(e) => {
                  if (!e.target.value || e.target.value < minAvailableDate || e.target.value > maxAvailableDate) {
                    e.target.value = selectedDate;
                  }
                }}
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
                className="stats-date-input"
                aria-label="조회 일자 선택"
              />
            ) : (
              <input
                type="month"
                value={selectedYearMonth}
                min={minAvailableYearMonth}
                max={currentYearMonth}
                onChange={handleMonthChange}
                onBlur={(e) => {
                  if (!e.target.value || e.target.value < minAvailableYearMonth || e.target.value > currentYearMonth) {
                    e.target.value = selectedYearMonth;
                  }
                }}
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
            )}

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
        {/* 상단 짙은 남색 헤더 바 (타이틀 및 집계 기준일, 내보내기 버튼) */}
        <div className="table-top-bar">
          <div className="bar-title-group">
            <span className="bar-title">
              {periodType === 'DAILY' ? formatDateDisplay(activeDate) : formatYearMonthDisplay(activeYearMonth)} 지역별 현황
            </span>
            {isLoading && (
              <span className="bar-loading-indicator">
                <Loader2 size={13} className="animate-spin" />
                집계 중...
              </span>
            )}
          </div>
          <div className="bar-actions-group">
            <button
              type="button"
              className="btn-excel-export"
              onClick={handleExportExcel}
              disabled={isExporting || isLoading || filteredList.length === 0}
              title="현재 통계 데이터를 엑셀 파일로 다운로드"
            >
              {isExporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="btn-label">다운로드 중...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span className="btn-label">내보내기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2단 복합 그룹 헤더 매트릭스 테이블: [지역] -> [기간 실적] -> [현황 / 누적] */}
        <div className="table-responsive-wrapper">
          {isLoading && (
            <div className="table-loading-overlay" aria-live="polite">
              <div className="loading-badge">
                <Loader2 size={18} className="animate-spin" />
                <span>지역별 통계 데이터를 집계 중입니다...</span>
              </div>
            </div>
          )}
          <table className={`stats-matrix-table ${isLoading ? 'is-loading' : ''}`}>
            <thead>
              {/* 헤더 1행: 그룹 헤더 */}
              <tr>
                <th rowSpan={2} className="col-sticky-region">
                  지역
                </th>
                <th colSpan={5} className="th-group-flow">
                  기간 실적
                </th>
                <th colSpan={4} className="th-group-stock">
                  현황 / 누적
                </th>
              </tr>
              {/* 헤더 2행: 세부 항목 */}
              <tr>
                <th>완료 세대</th>
                <th>승인 완료</th>
                <th>검토 대기</th>
                <th>설치 거부</th>
                <th className="col-last-issue">특이사항</th>
                <th>현장 수</th>
                <th>총 대상 세대</th>
                <th>누적 완료 세대</th>
                <th className="col-rate">진행률</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={10}>
                    조회된 지역 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredList.map((row) => (
                  <tr key={row.regionId}>
                    <td className="col-sticky-region">{row.displayName}</td>
                    {/* 기간 실적 (Flow) */}
                    <td className="col-num">{row.completedTarget > 0 ? `${row.completedTarget.toLocaleString()}건` : '-'}</td>
                    <td className="col-num">{row.completedReports > 0 ? `${row.completedReports.toLocaleString()}건` : '-'}</td>
                    <td className="col-num">{row.pendingReports > 0 ? `${row.pendingReports}건` : '-'}</td>
                    <td className="col-num">{row.refusedReports && row.refusedReports > 0 ? `${row.refusedReports}건` : '-'}</td>
                    <td className="col-num col-last-issue">{row.issueReportsCount > 0 ? `${row.issueReportsCount}건` : '-'}</td>
                    {/* 현황 / 누적 (Stock) */}
                    <td className="col-num">{row.totalSites.toLocaleString()}곳</td>
                    <td className="col-num">{row.totalTarget.toLocaleString()}</td>
                    <td className="col-num">{(row.cumulativeCompletedTarget || 0).toLocaleString()}</td>
                    <td className="col-rate">{row.progressRate}%</td>
                  </tr>
                ))
              )}
            </tbody>
            {/* 합계 행 (Total Footer) - 항상 유지하여 레이아웃 흔들림 방지 */}
            <tfoot>
              <tr>
                <td className="col-sticky-region">전체 합계</td>
                {/* 기간 실적 합계 */}
                <td>{summary.completedTarget.toLocaleString()}건</td>
                <td>{summary.completedReports.toLocaleString()}건</td>
                <td>{summary.pendingReports.toLocaleString()}건</td>
                <td>{summary.refusedReports.toLocaleString()}건</td>
                <td className="col-last-issue">{summary.issueReportsCount.toLocaleString()}건</td>
                {/* 현황 / 누적 합계 */}
                <td>{summary.totalSites.toLocaleString()}곳</td>
                <td>{summary.totalTarget.toLocaleString()}</td>
                <td>{summary.cumulativeCompletedTarget.toLocaleString()}</td>
                <td className="col-rate">{summary.overallProgressRate}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
