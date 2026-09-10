'use client';

import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FileDown,
  Image as ImageIcon,
  ClipboardCheck,
  Filter,
  RotateCcw,
  ArrowRight,
  MoreVertical,
  History,
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import SlideDialog from '@/components/dialog/SlideDialog';
import WorkReportDetailDialog from '@/components/dialog/WorkReportDetailDialog';
import RegionalBatchPrintDialog from '@/components/dialog/RegionalBatchPrintDialog';
import WorkReportTrashDialog from '@/components/dialog/WorkReportTrashDialog';
import CustomSelect from '@/components/common/CustomSelect';
import RegionSelector from '@/components/common/RegionSelector';
import { useManageRegion } from '@/providers/ManageRegionProvider';
import SearchInput from '@/components/common/SearchInput';
import StatusBadge, { STATUS_LABEL_MAP } from '@/components/common/StatusBadge';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import AdminService from '@/api/service/AdminService';
import '../ManageLayout.scss';

dayjs.locale('ko');

function ManageWorkContent() {
  const { enqueueSnackbar } = useSnackbar();

  // Region State for Common RegionSelector (Global Shared State)
  const { region, setRegion } = useManageRegion();

  // Paged Reports Data
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(30);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [batchPrintReports, setBatchPrintReports] = useState<WorkReport[]>([]);

  // Regional Batch Print Dialog State
  const [isRegionalBatchDialogOpen, setIsRegionalBatchDialogOpen] = useState(false);

  // Trash (Deletion Log) Dialog State
  const [isTrashDialogOpen, setIsTrashDialogOpen] = useState(false);

  // Header More Menu Dropdown State
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  // Summary Metrics (권역 단위 종합 통계)
  const [metrics, setMetrics] = useState({ total: 0, pending: 0, needsFix: 0 });

  // Applied Filter States (실제 목록에 적용되는 상태)
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<'ALL' | 'PENDING' | 'REJECTED' | 'COMPLETED'>('ALL');
  const [appliedInstallStartDate, setAppliedInstallStartDate] = useState('');
  const [appliedInstallEndDate, setAppliedInstallEndDate] = useState('');
  const [appliedReportStartDate, setAppliedReportStartDate] = useState('');
  const [appliedReportEndDate, setAppliedReportEndDate] = useState('');

  // Dialog Draft Filter States (다이얼로그 내부 임시 상태)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [draftStatusFilter, setDraftStatusFilter] = useState<'ALL' | 'PENDING' | 'REJECTED' | 'COMPLETED'>('ALL');
  const [draftInstallStartDate, setDraftInstallStartDate] = useState('');
  const [draftInstallEndDate, setDraftInstallEndDate] = useState('');
  const [draftReportStartDate, setDraftReportStartDate] = useState('');
  const [draftReportEndDate, setDraftReportEndDate] = useState('');

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Open Filter Dialog: 적용된 필터 값을 draft 상태로 복사
  const handleOpenFilterDialog = () => {
    setDraftStatusFilter(appliedStatusFilter);
    setDraftInstallStartDate(appliedInstallStartDate);
    setDraftInstallEndDate(appliedInstallEndDate);
    setDraftReportStartDate(appliedReportStartDate);
    setDraftReportEndDate(appliedReportEndDate);
    setIsFilterDialogOpen(true);
  };

  // Draft Install Date Preset Handlers
  const handleSetDraftInstallDatePreset = (preset: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH') => {
    const today = dayjs().format('YYYY-MM-DD');
    if (preset === 'ALL') {
      setDraftInstallStartDate('');
      setDraftInstallEndDate('');
    } else if (preset === 'TODAY') {
      setDraftInstallStartDate(today);
      setDraftInstallEndDate(today);
    } else if (preset === 'WEEK') {
      setDraftInstallStartDate(dayjs().subtract(6, 'day').format('YYYY-MM-DD'));
      setDraftInstallEndDate(today);
    } else if (preset === 'MONTH') {
      setDraftInstallStartDate(dayjs().subtract(29, 'day').format('YYYY-MM-DD'));
      setDraftInstallEndDate(today);
    }
  };

  // Draft Report Date Preset Handlers
  const handleSetDraftReportDatePreset = (preset: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH') => {
    const today = dayjs().format('YYYY-MM-DD');
    if (preset === 'ALL') {
      setDraftReportStartDate('');
      setDraftReportEndDate('');
    } else if (preset === 'TODAY') {
      setDraftReportStartDate(today);
      setDraftReportEndDate(today);
    } else if (preset === 'WEEK') {
      setDraftReportStartDate(dayjs().subtract(6, 'day').format('YYYY-MM-DD'));
      setDraftReportEndDate(today);
    } else if (preset === 'MONTH') {
      setDraftReportStartDate(dayjs().subtract(29, 'day').format('YYYY-MM-DD'));
      setDraftReportEndDate(today);
    }
  };

  const todayStr = dayjs().format('YYYY-MM-DD');
  const isDraftInstallToday = draftInstallStartDate === todayStr && draftInstallEndDate === todayStr;
  const isDraftInstallWeek = draftInstallStartDate === dayjs().subtract(6, 'day').format('YYYY-MM-DD') && draftInstallEndDate === todayStr;
  const isDraftInstallMonth = draftInstallStartDate === dayjs().subtract(29, 'day').format('YYYY-MM-DD') && draftInstallEndDate === todayStr;
  const isDraftInstallAllDates = !draftInstallStartDate && !draftInstallEndDate;

  const isDraftReportToday = draftReportStartDate === todayStr && draftReportEndDate === todayStr;
  const isDraftReportWeek = draftReportStartDate === dayjs().subtract(6, 'day').format('YYYY-MM-DD') && draftReportEndDate === todayStr;
  const isDraftReportMonth = draftReportStartDate === dayjs().subtract(29, 'day').format('YYYY-MM-DD') && draftReportEndDate === todayStr;
  const isDraftReportAllDates = !draftReportStartDate && !draftReportEndDate;

  // Dialog Reset (다이얼로그 내부 임시 상태 초기화)
  const handleResetDialogFilters = () => {
    setDraftStatusFilter('ALL');
    setDraftInstallStartDate('');
    setDraftInstallEndDate('');
    setDraftReportStartDate('');
    setDraftReportEndDate('');
  };

  // Dialog Apply (적용 완료 클릭 시 실제 반영)
  const handleApplyFilters = () => {
    setAppliedStatusFilter(draftStatusFilter);
    setAppliedInstallStartDate(draftInstallStartDate);
    setAppliedInstallEndDate(draftInstallEndDate);
    setAppliedReportStartDate(draftReportStartDate);
    setAppliedReportEndDate(draftReportEndDate);
    setPage(1);
    setIsFilterDialogOpen(false);
    enqueueSnackbar('필터 조건이 적용되었습니다.', { variant: 'info' });
  };

  // Toolbar Quick Reset (툴바 빠른 초기화)
  const handleResetQuick = () => {
    setAppliedStatusFilter('ALL');
    setAppliedInstallStartDate('');
    setAppliedInstallEndDate('');
    setAppliedReportStartDate('');
    setAppliedReportEndDate('');
    setDraftStatusFilter('ALL');
    setDraftInstallStartDate('');
    setDraftInstallEndDate('');
    setDraftReportStartDate('');
    setDraftReportEndDate('');
    setPage(1);
    enqueueSnackbar('필터 조건이 초기화되었습니다.', { variant: 'info' });
  };

  // Active Filter Count (실제 적용된 필터 기준 카운트)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedInstallStartDate || appliedInstallEndDate) count++;
    if (appliedReportStartDate || appliedReportEndDate) count++;
    if (appliedStatusFilter !== 'ALL') count++;
    return count;
  }, [appliedInstallStartDate, appliedInstallEndDate, appliedReportStartDate, appliedReportEndDate, appliedStatusFilter]);

  // Confirmation Sheet Viewer Dialog
  const [selectedReport, setSelectedReport] = useState<WorkReport>();

  const searchParams = useSearchParams();
  const reportIdParam = searchParams.get('reportId');

  // URL 파라미터(reportId) 존재 시 해당 보고서 상세 모달 자동 오픈 및 정확한 현장 정보 기반 지역 동기화
  useEffect(() => {
    if (!reportIdParam) return;

    let isMounted = true;
    (async () => {
      try {
        const reportDetail = await AdminService.getReportDetail(reportIdParam);
        if (!isMounted || !reportDetail) return;

        setSelectedReport(reportDetail);

        // 현장 API를 호출하여 DB에 등록된 정확한 regionId, sido, region 조회
        if (reportDetail.siteId) {
          const site = await AdminService.getSiteDetail(reportDetail.siteId);
          if (isMounted && site && site.regionId && site.regionId !== region.regionId) {
            setRegion({
              sido: site.sido,
              sigungu: site.region,
              eupmyeondong: '',
              regionId: site.regionId,
            });
          }
        }
      } catch (err) {
        console.error('[ManageWorkPage] getReportDetail/getSiteDetail error', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [reportIdParam, region.regionId, setRegion]);

  // Status Change Dialog State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [targetReport, setTargetReport] = useState<WorkReport>();
  const [statusFormData, setStatusFormData] = useState<{
    status: ReportStatus;
    fixReason: string;
  }>({
    status: 'PENDING',
    fixReason: '',
  });

  // Load Paged Reports from Backend API
  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const regionParam = region.regionId ? { regionId: region.regionId } : {};
      const searchParam: AdminReportSearchReq = {
        ...regionParam,
        status: appliedStatusFilter !== 'ALL' ? appliedStatusFilter : undefined,
        installStartDate: appliedInstallStartDate || undefined,
        installEndDate: appliedInstallEndDate || undefined,
        reportStartDate: appliedReportStartDate || undefined,
        reportEndDate: appliedReportEndDate || undefined,
        query: searchQuery.trim() || undefined,
        page,
        size: pageSize,
      };

      const [pagedRes, summaryRes] = await Promise.all([
        AdminService.getReportListPaged(searchParam).catch(err => {
          console.error('[ManageWorkPage] getReportListPaged error', err);
          return { list: [], totalCount: 0, page: 1, size: 30, totalPages: 0, hasNext: false, hasPrev: false };
        }),
        AdminService.getDashboardSummary(regionParam).catch(() => null),
      ]);

      setReports(pagedRes?.list || []);
      setTotalCount(pagedRes?.totalCount || 0);

      if (summaryRes) {
        setMetrics({
          total: summaryRes.totalReports || 0,
          pending: summaryRes.pendingReports || 0,
          needsFix: summaryRes.rejectedReports || 0,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [region, appliedStatusFilter, appliedInstallStartDate, appliedInstallEndDate, appliedReportStartDate, appliedReportEndDate, searchQuery, page, pageSize]);

  React.useEffect(() => {
    loadData();

    const handleRealtimeNotification = () => {
      loadData();
    };
    window.addEventListener('gneworks-notification-received', handleRealtimeNotification);
    return () => {
      window.removeEventListener('gneworks-notification-received', handleRealtimeNotification);
    };
  }, [loadData]);

  // 지역 또는 검색어 변경 시 1페이지로 리셋
  React.useEffect(() => {
    setPage(1);
  }, [region, searchQuery]);

  // 엑셀 다운로드 핸들러
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const regionParam = region.regionId ? { regionId: region.regionId } : {};
      await AdminService.exportReportsExcel({
        ...regionParam,
        status: appliedStatusFilter !== 'ALL' ? appliedStatusFilter : undefined,
        installStartDate: appliedInstallStartDate || undefined,
        installEndDate: appliedInstallEndDate || undefined,
        reportStartDate: appliedReportStartDate || undefined,
        reportEndDate: appliedReportEndDate || undefined,
        query: searchQuery.trim() || undefined,
      });
      enqueueSnackbar('보고서 목록이 엑셀 파일로 다운로드되었습니다.', { variant: 'success' });
    } catch (err) {
      console.error('Failed to export reports excel:', err);
      enqueueSnackbar('엑셀 다운로드 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  // DataTable 컬럼 정의
  const columns: ColumnDef<WorkReport>[] = useMemo(() => [
    {
      key: 'num',
      header: '순번',
      width: '60px',
      align: 'center',
      render: (_report, idx, startIdx) => (
        <span className="row-index">{startIdx + idx + 1}</span>
      ),
    },
    {
      key: 'date',
      header: '설치일자 / 보고일시',
      width: '180px',
      render: (report) => {
        const installDateStr = report.installDateFormatted || (report.installDate ? (dayjs(report.installDate).isValid() ? dayjs(report.installDate).format('YYYY.MM.DD') : report.installDate) : '—');
        const reportTimeStr = report.reportTime ? (dayjs(report.reportTime).isValid() ? dayjs(report.reportTime).format('YYYY.MM.DD HH:mm') : report.reportTime) : '';
        return (
          <div className="report-dates-cluster">
            <span className="install-date-text">{installDateStr}</span>
            {reportTimeStr && <span className="report-time-sub">{reportTimeStr}</span>}
          </div>
        );
      },
    },
    {
      key: 'site',
      header: '현장명 (아파트)',
      render: (report) => (
        <div className="site-name-wrap">
          <strong className="site-title">{report.siteName}</strong>
          <span className="site-addr-sub">{report.sigungu} {report.eupmyeondong}</span>
        </div>
      ),
    },
    {
      key: 'unit',
      header: '동 / 호수',
      width: '130px',
      render: (report) => (
        <strong className="unit-badge">{report.dong}동 {report.ho}호</strong>
      ),
    },
    {
      key: 'installer',
      header: '보고자',
      width: '120px',
      render: (report) => (
        <span className="installer-name">{report.reporterName}</span>
      ),
    },
    {
      key: 'photos',
      header: '현장사진',
      width: '100px',
      align: 'center',
      render: (report) => (
        <span className="photo-count-text">
          {[report.photoDoor, report.photoBefore1, report.photoAfter1, report.photoBefore2, report.photoAfter2].filter(Boolean).length}장
        </span>
      ),
    },
    {
      key: 'status',
      header: '상태',
      width: '110px',
      align: 'center',
      render: (report) => (
        <StatusBadge status={report.status} />
      ),
    },
  ], []);

  // Open Status Change Dialog
  const handleOpenStatusModal = (report: WorkReport, e?: React.MouseEvent | ReportStatus, defaultStatus?: ReportStatus) => {
    if (e && typeof (e as any).stopPropagation === 'function') {
      (e as React.MouseEvent).stopPropagation();
    }
    const initialStatus = typeof e === 'string' ? e : (defaultStatus || report.status);
    setTargetReport(report);
    setStatusFormData({
      status: initialStatus,
      fixReason: report.fixReason || '',
    });
    setIsStatusModalOpen(true);
  };

  // Submit Status Change
  const handleSubmitStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReport) return;

    if (statusFormData.status === 'REJECTED' && !statusFormData.fixReason.trim()) {
      enqueueSnackbar('작업자가 확인할 수 있도록 반려 사유를 작성해 주세요.', { variant: 'warning' });
      return;
    }

    try {
      await AdminService.updateReportStatus(targetReport.reportId, {
        status: statusFormData.status,
        fixReason: statusFormData.status === 'REJECTED' ? statusFormData.fixReason.trim() : '',
      });

      const updatedReport: WorkReport = {
        ...targetReport,
        status: statusFormData.status,
        fixReason: statusFormData.status === 'REJECTED' ? statusFormData.fixReason.trim() : '',
      };

      setReports(prev => prev.map(r => (r.reportId === updatedReport.reportId ? updatedReport : r)));

      if (selectedReport && selectedReport.reportId === updatedReport.reportId) {
        setSelectedReport(updatedReport);
      }

      setIsStatusModalOpen(false);
      const statusLabel = STATUS_LABEL_MAP[updatedReport.status] || updatedReport.status;
      enqueueSnackbar(`[${updatedReport.siteName} ${updatedReport.dong}동 ${updatedReport.ho}호] 상태가 '${statusLabel}'(으)로 변경되었습니다.`, {
        variant: 'success',
      });
    } catch (err: any) {
      console.error('[ManageWorkPage] updateReportStatus error:', err);
      enqueueSnackbar(err?.message || '상태 변경 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };


  // Region Label Display
  const regionLabel = useMemo(() => {
    return region.sido && region.sigungu ? `${region.sido} ${region.sigungu}` : (region.sido || '');
  }, [region.sido, region.sigungu]);

  // Handle Batch Print Dialog Open
  const handleBatchPrint = async () => {
    if (!region.regionId) {
      enqueueSnackbar('지역별 일괄 출력을 위해 지역(시/도, 시/군/구)를 먼저 지정해 주세요.', {
        variant: 'warning',
      });
      return;
    }
    try {
      const list = await AdminService.getReportList({
        regionId: region.regionId,
      });
      setBatchPrintReports(list || []);
      setIsRegionalBatchDialogOpen(true);
    } catch (err) {
      console.error('Failed to load batch print reports:', err);
      setBatchPrintReports(reports);
      setIsRegionalBatchDialogOpen(true);
    }
  };

  // Handle Print (Single)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="manage-work-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-header-row">
        <div>
          <h2>보고서 관리</h2>
          <p>현장 작업 보고서를 확인하고 처리합니다.</p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn-batch-pdf-action"
            onClick={handleBatchPrint}
            title={`${regionLabel} 지역의 모든 보고서를 대지와 함께 일괄 PDF로 출력합니다.`}
          >
            <FileDown size={15} />
            <span>지역별 일괄 출력</span>
            <span className="batch-badge">{totalCount}건</span>
          </button>

          {/* 추가 옵션 더보기 메뉴 */}
          <div className="header-more-menu-wrap" ref={moreMenuRef}>
            <button
              type="button"
              className={`btn-more-menu-trigger ${isMoreMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMoreMenuOpen(prev => !prev)}
              title="추가 메뉴"
              aria-label="추가 메뉴"
            >
              <MoreVertical size={16} />
            </button>

            {isMoreMenuOpen && (
              <div className="header-more-dropdown-menu">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsTrashDialogOpen(true);
                  }}
                >
                  <History size={14} />
                  <span>보고서 삭제 이력</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SUMMARY BANNER BAR ── */}
      <div className="sites-summary-unified-bar">
        <div className="summary-main-col">
          <div className="summary-icon">
            <ClipboardCheck size={22} />
          </div>
          <div className="summary-main-info">
            <span className="summary-label">총 제출 확인서</span>
            <strong className="summary-val">{metrics.total}건</strong>
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-sub-chips">
          <div className="summary-sub-chip">
            <span className="chip-label">검토 대기</span>
            <strong className="chip-val">{metrics.pending}건</strong>
          </div>
          <div className="summary-sub-chip">
            <span className="chip-label">수정 필요</span>
            <strong className="chip-val danger-highlight">{metrics.needsFix}건</strong>
          </div>
        </div>
      </div>

      {/* ── 1. COMMON REGION SELECTOR BAR ── */}
      <RegionSelector
        value={region}
        onChange={setRegion}
        showActiveBadge={true}
      />

      {/* ── 2. SEARCH & FILTER DIALOG BAR ── */}
      <div className="reports-search-filter-bar">
        <SearchInput
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="아파트명, 동/호수, 설치 작업자명 검색..."
        />

        <div className="filter-actions-cluster">
          <button
            type="button"
            className={`btn-filter-trigger ${activeFilterCount > 0 ? 'active' : ''}`}
            onClick={handleOpenFilterDialog}
            title="필터 설정"
          >
            <Filter size={16} />
            <span>필터</span>
            {activeFilterCount > 0 && (
              <span className="filter-count-badge">{activeFilterCount}</span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              className="btn-filter-reset-quick"
              onClick={handleResetQuick}
              title="필터 초기화"
            >
              <RotateCcw size={14} />
              <span>초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 3. WORK REPORTS DATA TABLE ── */}
      <DataTable<WorkReport>
        columns={columns}
        data={reports}
        rowKey={(report, idx) => report.reportId || `report_${idx}`}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={[30, 50, 100]}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        isLoading={isLoading}
        loadingMessage="작업 보고서 목록을 불러오는 중입니다..."
        emptyMessage="선택된 조건에 일치하는 작업 보고서가 없습니다."
        onRowClick={(report) => setSelectedReport(report)}
        excelAction={{
          onExport: handleExportExcel,
          isExporting,
        }}
      />

      {/* ── 4. 단독경보형감지기 보급지원확인서 상세 뷰어 모달 (공통 컴포넌트) ── */}
      <WorkReportDetailDialog
        isOpen={!!selectedReport && !isStatusModalOpen}
        report={selectedReport}
        onClose={() => setSelectedReport(undefined)}
        onOpenStatusModal={(rep, defaultStatus) => handleOpenStatusModal(rep, defaultStatus)}
        onReportUpdated={(updated) => {
          setSelectedReport(updated);
          setReports(prev => prev.map(r => r.reportId === updated.reportId ? updated : r));
        }}
        onDeleteSuccess={(deletedId) => {
          setReports(prev => prev.filter(r => r.reportId !== deletedId));
          setTotalCount(prev => Math.max(0, prev - 1));
          setSelectedReport(undefined);
          loadData();
        }}
      />

      {/* ── 5. 상태 변경 및 수정 사유 작성 다이얼로그 ── */}
      <SlideDialog
        isOpen={isStatusModalOpen && !!targetReport}
        onClose={() => setIsStatusModalOpen(false)}
        title="작업 보고서 상태 변경"
        className="manage-page"
        footer={
          <div className="dialog-btn-group">
            <button type="button" className="btn-cancel" onClick={() => setIsStatusModalOpen(false)}>
              취소
            </button>
            <button type="submit" form="report-status-dialog-form" className="btn-save">
              상태 저장하기
            </button>
          </div>
        }
      >
        {targetReport && (
          <form id="report-status-dialog-form" className="report-status-dialog-form" onSubmit={handleSubmitStatusChange}>
            <div className="target-report-summary-box">
              <div className="summary-row">
                <span className="key">현장명</span>
                <span className="val">{targetReport.siteName} ({targetReport.dong}동 {targetReport.ho}호)</span>
              </div>
              <div className="summary-row">
                <span className="key">설치 작업자</span>
                <span className="val">{targetReport.reporterName}</span>
              </div>
              <div className="summary-row">
                <span className="key">설치일자</span>
                <span className="val">{targetReport.installDateFormatted}</span>
              </div>
            </div>

            <div className="form-field">
              <label>작업 상태 선택 <span className="req">*</span></label>
              <CustomSelect
                fullWidth
                sizeVariant="md"
                value={statusFormData.status}
                onChange={e => setStatusFormData(prev => ({ 
                  ...prev, 
                  status: e.target.value as ReportStatus 
                }))}
              >
                <option value="PENDING">검토대기 (관리자 확인 대기)</option>
                <option value="REJECTED">수정필요 (사진 이상/재촬영 등 보완 요청)</option>
                <option value="COMPLETED">확인완료 (정상 제출 승인 완료)</option>
              </CustomSelect>
            </div>

            {statusFormData.status === 'REJECTED' && (
              <div className="form-field">
                <label>
                  반려 사유 <span className="req">*</span>
                  <span className="field-tip">(작업자에게 표시될 안내 메시지)</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="예: 설치 전① 사진이 다소 어두워 감지기 위치가 식별되지 않습니다. 밝은 조명에서 재촬영 후 재제출 바랍니다."
                  value={statusFormData.fixReason}
                  onChange={e => setStatusFormData(prev => ({ ...prev, fixReason: e.target.value }))}
                />
              </div>
            )}

            {/* 상태 변경 시에만 미리보기 노출 (변경 전 ➔ 변경 후) */}
            {targetReport.status !== statusFormData.status && (
              <div className="status-transition-card is-changed">
                <div className="transition-header">
                  <span className="transition-title">상태 변경 확인</span>
                  <span className="transition-pill changed">변경 예정</span>
                </div>
                <div className="transition-body">
                  <div className="transition-node before">
                    <span className="node-label">변경 전</span>
                    <StatusBadge status={targetReport.status} />
                  </div>
                  <div className="transition-arrow active">
                    <ArrowRight size={14} />
                  </div>
                  <div className="transition-node after">
                    <span className="node-label">변경 후</span>
                    <StatusBadge status={statusFormData.status} />
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </SlideDialog>
      {/* ── 6. 보고서 관리 상세 필터 다이얼로그 ── */}
      <SlideDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        title="보고서 관리 상세 필터"
        className="manage-page filter-dialog"
        footer={
          <div className="dialog-btn-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleResetDialogFilters}
            >
              필터 초기화
            </button>
            <button
              type="button"
              className="btn-save"
              onClick={handleApplyFilters}
            >
              적용 완료
            </button>
          </div>
        }
      >
        <div className="work-filter-dialog-content">
          {/* 1. 설치일자 기간 선택 (언제부터 언제까지) */}
          <div className="filter-field-block">
            <label className="field-block-title">
              <span>설치일자</span>
            </label>
            <div className="filter-tab-buttons-grid preset-grid">
              <button
                type="button"
                className={`filter-choice-btn ${isDraftInstallAllDates ? 'active' : ''}`}
                onClick={() => handleSetDraftInstallDatePreset('ALL')}
              >
                전체 기간
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${isDraftInstallToday ? 'active' : ''}`}
                onClick={() => handleSetDraftInstallDatePreset('TODAY')}
              >
                오늘
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${isDraftInstallWeek ? 'active' : ''}`}
                onClick={() => handleSetDraftInstallDatePreset('WEEK')}
              >
                최근 7일
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${isDraftInstallMonth ? 'active' : ''}`}
                onClick={() => handleSetDraftInstallDatePreset('MONTH')}
              >
                최근 30일
              </button>
            </div>
            <div className="date-range-row">
              <input
                type="date"
                className="date-input-item"
                value={draftInstallStartDate}
                onChange={e => setDraftInstallStartDate(e.target.value)}
                aria-label="설치 시작일"
              />
              <span className="date-range-separator">~</span>
              <input
                type="date"
                className="date-input-item"
                value={draftInstallEndDate}
                onChange={e => setDraftInstallEndDate(e.target.value)}
                aria-label="설치 종료일"
              />
              <button
                type="button"
                className="btn-date-clear-dlg"
                disabled={!draftInstallStartDate && !draftInstallEndDate}
                onClick={() => {
                  setDraftInstallStartDate('');
                  setDraftInstallEndDate('');
                }}
                title={draftInstallStartDate || draftInstallEndDate ? '설치일자 초기화' : '지정된 날짜가 없습니다'}
              >
                지정 해제
              </button>
            </div>
          </div>

          {/* 2. 보고일시 기간 선택 (언제부터 언제까지) */}
          <div className="filter-field-block">
            <label className="field-block-title">
              <span>보고일시</span>
            </label>
            <div className="filter-tab-buttons-grid preset-grid">
              <button
                type="button"
                className={`filter-choice-btn ${isDraftReportAllDates ? 'active' : ''}`}
                onClick={() => handleSetDraftReportDatePreset('ALL')}
              >
                전체 기간
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${isDraftReportToday ? 'active' : ''}`}
                onClick={() => handleSetDraftReportDatePreset('TODAY')}
              >
                오늘
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${isDraftReportWeek ? 'active' : ''}`}
                onClick={() => handleSetDraftReportDatePreset('WEEK')}
              >
                최근 7일
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${isDraftReportMonth ? 'active' : ''}`}
                onClick={() => handleSetDraftReportDatePreset('MONTH')}
              >
                최근 30일
              </button>
            </div>
            <div className="date-range-row">
              <input
                type="date"
                className="date-input-item"
                value={draftReportStartDate}
                onChange={e => setDraftReportStartDate(e.target.value)}
                aria-label="보고 시작일"
              />
              <span className="date-range-separator">~</span>
              <input
                type="date"
                className="date-input-item"
                value={draftReportEndDate}
                onChange={e => setDraftReportEndDate(e.target.value)}
                aria-label="보고 종료일"
              />
              <button
                type="button"
                className="btn-date-clear-dlg"
                disabled={!draftReportStartDate && !draftReportEndDate}
                onClick={() => {
                  setDraftReportStartDate('');
                  setDraftReportEndDate('');
                }}
                title={draftReportStartDate || draftReportEndDate ? '보고일자 초기화' : '지정된 날짜가 없습니다'}
              >
                지정 해제
              </button>
            </div>
          </div>

          {/* 3. 작업 상태 선택 */}
          <div className="filter-field-block">
            <label className="field-block-title">
              <span>작업 상태</span>
            </label>
            <div className="filter-tab-buttons-grid status-grid">
              <button
                type="button"
                className={`filter-choice-btn ${draftStatusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setDraftStatusFilter('ALL')}
              >
                전체 상태
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${draftStatusFilter === 'PENDING' ? 'active' : ''}`}
                onClick={() => setDraftStatusFilter('PENDING')}
              >
                검토대기
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${draftStatusFilter === 'REJECTED' ? 'active' : ''}`}
                onClick={() => setDraftStatusFilter('REJECTED')}
              >
                수정필요
              </button>
              <button
                type="button"
                className={`filter-choice-btn ${draftStatusFilter === 'COMPLETED' ? 'active' : ''}`}
                onClick={() => setDraftStatusFilter('COMPLETED')}
              >
                확인완료
              </button>
            </div>
          </div>
        </div>
      </SlideDialog>

      {/* ── REGIONAL BATCH PRINT DIALOG (미리보기 & 보급완료 보고서 PDF 출력) ── */}
      <RegionalBatchPrintDialog
        isOpen={isRegionalBatchDialogOpen}
        onClose={() => setIsRegionalBatchDialogOpen(false)}
        region={region}
        reports={batchPrintReports}
      />

      {/* ── WORK REPORT TRASH DIALOG (삭제 이력 & 감사 로그 모달) ── */}
      <WorkReportTrashDialog
        isOpen={isTrashDialogOpen}
        onClose={() => setIsTrashDialogOpen(false)}
        regionId={region.regionId}
      />
    </div>
  );
}

export default function ManageWorkPage() {
  return (
    <Suspense fallback={null}>
      <ManageWorkContent />
    </Suspense>
  );
}
