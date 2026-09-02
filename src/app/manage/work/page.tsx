'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Printer, 
  Image as ImageIcon,
  ClipboardCheck,
  Filter,
  AlertTriangle,
  Edit3,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import SlideDialog from '@/components/dialog/SlideDialog';
import CustomSelect from '@/components/common/CustomSelect';
import RegionSelector, { RegionValue } from '@/components/common/RegionSelector';
import { useManageRegion } from '@/providers/ManageRegionProvider';
import SearchInput from '@/components/common/SearchInput';
import StatusBadge from '@/components/common/StatusBadge';
import { INITIAL_REPORTS_DATA } from '@/data/reportData';
import '../ManageLayout.scss';

dayjs.locale('ko');

export default function ManageWorkPage() {
  const { enqueueSnackbar } = useSnackbar();

  // Master Reports Data
  const [reports, setReports] = useState<WorkReport[]>(INITIAL_REPORTS_DATA);

  // Region State for Common RegionSelector (Global Shared State)
  const { region, setRegion } = useManageRegion();

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
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null);

  // Status Change Dialog State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [targetReport, setTargetReport] = useState<WorkReport | null>(null);
  const [statusFormData, setStatusFormData] = useState<{
    status: WorkReport['status'];
    fixReason: string;
  }>({
    status: 'PENDING',
    fixReason: '',
  });

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter(rep => {
      // Region Match
      const matchSido = region.sido === 'ALL' || rep.sido === region.sido;
      const matchSigungu = region.sigungu === 'ALL' || rep.sigungu === region.sigungu;
      const matchEup = region.eupmyeondong === 'ALL' || (rep.eupmyeondong && rep.eupmyeondong.includes(region.eupmyeondong));
      const matchRegion = matchSido && matchSigungu && matchEup;

      // Status Match
      const matchStatus = appliedStatusFilter === 'ALL' || rep.status === appliedStatusFilter;

      // Install Date Range Match (rep.installDate: 'YYYY-MM-DD')
      let matchInstallDate = true;
      if (appliedInstallStartDate && rep.installDate < appliedInstallStartDate) matchInstallDate = false;
      if (appliedInstallEndDate && rep.installDate > appliedInstallEndDate) matchInstallDate = false;

      // Report Date Range Match (rep.reportTime: 'YYYY-MM-DD HH:mm')
      const reportDateOnly = rep.reportTime ? rep.reportTime.slice(0, 10) : '';
      let matchReportDate = true;
      if (appliedReportStartDate && reportDateOnly < appliedReportStartDate) matchReportDate = false;
      if (appliedReportEndDate && reportDateOnly > appliedReportEndDate) matchReportDate = false;

      // Search Query Match (Site name, dong/ho, installerName)
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        rep.siteName.toLowerCase().includes(query) ||
        `${rep.dong}동`.includes(query) ||
        `${rep.ho}호`.includes(query) ||
        rep.reporterName.toLowerCase().includes(query);

      return matchRegion && matchStatus && matchInstallDate && matchReportDate && matchSearch;
    });
  }, [reports, region, appliedStatusFilter, appliedInstallStartDate, appliedInstallEndDate, appliedReportStartDate, appliedReportEndDate, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'PENDING').length;
    const needsFix = reports.filter(r => r.status === 'REJECTED').length;
    return { total, pending, needsFix };
  }, [reports]);

  // Open Status Change Dialog
  const handleOpenStatusModal = (report: WorkReport, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTargetReport(report);
    setStatusFormData({
      status: report.status,
      fixReason: report.fixReason || '',
    });
    setIsStatusModalOpen(true);
  };

  // Submit Status Change
  const handleSubmitStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReport) return;

    if (statusFormData.status === 'REJECTED' && !statusFormData.fixReason.trim()) {
      enqueueSnackbar('작업자가 확인할 수 있도록 반려 사유를 작성해 주세요.', { variant: 'warning' });
      return;
    }

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
    enqueueSnackbar(`[${updatedReport.siteName} ${updatedReport.dong}동 ${updatedReport.ho}호] 상태가 '${updatedReport.status}'(으)로 변경되었습니다.`, {
      variant: 'success',
    });
  };

  // Handle Print
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

      {/* ── 3. WORK REPORTS TABLE LIST (세대주 컬럼 제외) ── */}
      <div className="work-table-wrapper">
        <table className="work-reports-table">
          <thead>
            <tr>
              <th className="col-num">순번</th>
              <th className="col-date">설치일자 / 보고일시</th>
              <th className="col-site">현장명 (아파트)</th>
              <th className="col-unit">동 / 호수</th>
              <th className="col-installer">보고자</th>
              <th className="col-photos">현장사진</th>
              <th className="col-status">상태</th>
              <th className="col-actions">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report, idx) => (
                <tr key={report.reportId} className="report-table-row">
                  <td className="col-num">
                    <span className="row-index">{idx + 1}</span>
                  </td>
                  <td className="col-date">
                    <div className="report-dates-cluster">
                      <span className="install-date-text">{report.installDateFormatted}</span>
                      <span className="report-time-sub">{report.reportTime}</span>
                    </div>
                  </td>
                  <td className="col-site">
                    <div className="site-name-wrap">
                      <strong className="site-title">{report.siteName}</strong>
                      <span className="site-addr-sub">{report.sigungu} {report.eupmyeondong}</span>
                    </div>
                  </td>
                  <td className="col-unit">
                    <strong className="unit-badge">{report.dong}동 {report.ho}호</strong>
                  </td>
                  <td className="col-installer">
                    <span className="installer-name">{report.reporterName}</span>
                  </td>
                  <td className="col-photos">
                    <span className="photo-count-text">{report.photos.length}장</span>
                  </td>
                  <td className="col-status">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="col-actions">
                    <div className="row-action-btns">
                      <button
                        type="button"
                        className="btn-row-edit"
                        title="상태 및 사유 변경"
                        onClick={(e) => handleOpenStatusModal(report, e)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-row-edit"
                        title="보급지원확인서 보기"
                        onClick={() => setSelectedReport(report)}
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-table-row">
                <td colSpan={8} className="empty-table-cell">
                  <FileText size={36} className="empty-icon" />
                  <p>선택된 날짜 및 조건에 일치하는 작업 보고서가 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── 4. 단독경보형감지기 보급지원확인서 상세 뷰어 모달 ── */}
      <SlideDialog
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport ? `${selectedReport.siteName} (${selectedReport.dong}동 ${selectedReport.ho}호) 보급지원확인서` : '보급지원확인서'}
        className="manage-page confirmation-dialog"
        footer={
          selectedReport ? (
            <div className="confirmation-modal-footer-actions">
              <button
                type="button"
                className="btn-status-action"
                onClick={() => handleOpenStatusModal(selectedReport)}
              >
                <Edit3 size={14} />
                <span>상태 변경 ({selectedReport.status})</span>
              </button>
              <button type="button" className="btn-print-action" onClick={handlePrint}>
                <Printer size={15} />
                <span>인쇄하기</span>
              </button>
              <button type="button" className="btn-close-action" onClick={() => setSelectedReport(null)}>
                닫기
              </button>
            </div>
          ) : undefined
        }
      >
        {selectedReport && (
          <div className="confirmation-modal-content">
            {/* Sheet Actions Bar */}
            <div className="sheet-top-action-bar">
              <div className="sheet-status-info">
                <span>보고자: <strong>{selectedReport.reporterName}</strong></span>
                <span className="dot">·</span>
                <span>일시: {selectedReport.reportTime}</span>
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  className="btn-status-change-action"
                  onClick={() => handleOpenStatusModal(selectedReport)}
                >
                  <Edit3 size={14} />
                  <span>상태 변경 ({selectedReport.status})</span>
                </button>
                <button type="button" className="btn-print-action" onClick={handlePrint}>
                  <Printer size={15} />
                  <span>인쇄하기</span>
                </button>
              </div>
            </div>

            {/* 수정 필요 안내 박스 (작업자 및 관리자 확인용) */}
            {selectedReport.status === 'REJECTED' && (
              <div className="sheet-fix-alert-box">
                <AlertTriangle size={20} className="fix-icon" />
                <div className="fix-content">
                  <strong>수정 및 보완 요청 사유</strong>
                  <p>{selectedReport.fixReason || '사진 재촬영 또는 확인서 보완이 필요합니다.'}</p>
                </div>
              </div>
            )}

            {/* ── PRINTABLE SHEET DOCUMENT (수정안 3. 심플 테이블형 완전 일치) ── */}
            <div className="confirmation-document-paper" id="printable-confirmation-sheet">
              {/* Top Badge */}
              <div className="doc-top-bar">
                <span className="doc-version-badge">수정안 3. 심플 테이블형 (가독성 강조)</span>
              </div>

              {/* Header Title & Approval Stamp Box */}
              <div className="doc-header-row">
                <div className="doc-title-box">
                  <h1 className="doc-main-title">단독경보형감지기 보급지원확인서</h1>
                </div>
                <table className="approval-stamp-table">
                  <thead>
                    <tr>
                      <th>방문자</th>
                      <th>확인자</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="stamp-name-row">
                      <td>{selectedReport.visitorName}</td>
                      <td>{selectedReport.confirmerName}</td>
                    </tr>
                    <tr className="stamp-sign-row">
                      <td className="stamp-cell">
                        <span className="hand-signature">{selectedReport.visitorName}</span>
                      </td>
                      <td className="stamp-cell">
                        <span className="hand-signature">{selectedReport.confirmerName}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Address Banner Box */}
              <div className="doc-address-banner">
                <span className="addr-label">주소</span>
                <span className="addr-content">{selectedReport.address}</span>
              </div>

              {/* Body Content (Left Table + Right Photos) */}
              <div className="doc-body-columns">
                {/* Left Simple Spec Table */}
                <div className="doc-left-table-col">
                  <table className="spec-table">
                    <thead>
                      <tr>
                        <th>구분</th>
                        <th>내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="row-th">성명</td>
                        <td className="row-td">{selectedReport.headName}</td>
                      </tr>
                      <tr>
                        <td className="row-th">동 / 호수</td>
                        <td className="row-td">{selectedReport.dong}동 {selectedReport.ho}호</td>
                      </tr>
                      <tr>
                        <td className="row-th">설치일자</td>
                        <td className="row-td">{selectedReport.installDateFormatted}</td>
                      </tr>
                      <tr>
                        <td className="row-th">보고일시</td>
                        <td className="row-td">{selectedReport.reportTime}</td>
                      </tr>
                      <tr>
                        <td className="row-th">보고자</td>
                        <td className="row-td">{selectedReport.reporterName}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Photo Grid */}
                <div className="doc-right-photos-col">
                  <h3 className="photos-section-title">설치 현장 사진</h3>
                  <div className="photos-frame-box">
                    <div className="photos-2x2-grid">
                      <div className="photo-item-card">
                        <div className="photo-sprite-box photo-door" />
                        <span className="photo-caption">신주소 보이는 대문 등</span>
                      </div>
                      <div className="photo-item-card">
                        <div className="photo-sprite-box photo-before1" />
                        <span className="photo-caption">설치 전 ①</span>
                      </div>
                      <div className="photo-item-card">
                        <div className="photo-sprite-box photo-after1" />
                        <span className="photo-caption">설치 후 ①</span>
                      </div>
                      <div className="photo-item-card">
                        <div className="photo-sprite-box photo-after2" />
                        <span className="photo-caption">설치 전 ② &nbsp;&nbsp;&nbsp; 설치 후 ②</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlideDialog>

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
                  status: e.target.value as WorkReport['status'] 
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
              <Calendar size={15} />
              <span>설치일자 기간 선택</span>
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
              <Calendar size={15} />
              <span>보고일시 기간 선택</span>
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
              <CheckCircle2 size={15} />
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
    </div>
  );
}
