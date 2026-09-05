'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CameraOff, 
  Download,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { saveStoredReports, getStoredReports } from '@/data/reportStorage';
import StatusBadge from '@/components/common/StatusBadge';
import SlideDialog from '@/components/dialog/SlideDialog';
import CustomSelect from '@/components/common/CustomSelect';
import './WorkReportDetailDialog.scss';

export interface WorkReportDetailDialogProps {
  isOpen: boolean;
  report?: WorkReport;
  onClose: () => void;
  onReportUpdated?: (updated: WorkReport) => void;
  onOpenStatusModal?: (report: WorkReport) => void;
  isManageWorkPage?: boolean;
}

export default function WorkReportDetailDialog({
  isOpen,
  report,
  onClose,
  onReportUpdated,
  onOpenStatusModal,
  isManageWorkPage = false,
}: WorkReportDetailDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [reportDialogMode, setReportDialogMode] = useState<'review' | 'document'>('review');
  const [isReviewEditing, setIsReviewEditing] = useState(false);
  const [isDocEditing, setIsDocEditing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // 자체 내장 상태 변경 팝업 상태 (대시보드 / 보고서관리 공통 지원)
  const [isInternalStatusModalOpen, setIsInternalStatusModalOpen] = useState(false);
  const [statusFormData, setStatusFormData] = useState<{
    status: WorkReport['status'];
    fixReason: string;
  }>({
    status: 'PENDING',
    fixReason: '',
  });

  const [docFormData, setDocFormData] = useState({
    headName: '',
    dong: '',
    ho: '',
    address: '',
    installDateFormatted: '',
    reportTime: '',
    reporterName: '',
    visitorName: '',
    confirmerName: '',
    confirmerSignature: '',
    remarks: '',
  });

  useEffect(() => {
    if (report) {
      const rawAddress = report.address || '';
      const site = report.siteName || '';
      const formattedAddress = site && !rawAddress.includes(site)
        ? `${rawAddress} (${site})`
        : rawAddress;

      setDocFormData({
        headName: report.headName || '',
        dong: report.dong || '',
        ho: report.ho || '',
        address: formattedAddress,
        installDateFormatted: report.installDateFormatted || report.installDate || '',
        reportTime: report.reportTime || report.submittedAt || '',
        reporterName: report.reporterName || '',
        visitorName: report.visitorName || report.reporterName || '',
        confirmerName: report.confirmerName || report.headName || '',
        confirmerSignature: report.confirmerSignature || '/assets/img/sample_signature.svg',
        remarks: report.remarks || '',
      });
      setStatusFormData({
        status: report.status,
        fixReason: report.fixReason || '',
      });
      setIsReviewEditing(false);
      setIsDocEditing(false);
      setReportDialogMode('review');
    }
  }, [report]);

  if (!report) return null;

  const handleOpenStatusModal = () => {
    if (!report) return;
    if (onOpenStatusModal) {
      onOpenStatusModal(report);
    } else {
      setStatusFormData({
        status: report.status,
        fixReason: report.fixReason || '',
      });
      setIsInternalStatusModalOpen(true);
    }
  };

  const handleSubmitInternalStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    const updated: WorkReport = {
      ...report,
      status: statusFormData.status,
      fixReason: statusFormData.status === 'REJECTED' ? statusFormData.fixReason : '',
    };

    const allReports = getStoredReports();
    const nextReports = allReports.map(r => r.reportId === updated.reportId ? updated : r);
    saveStoredReports(nextReports);

    if (onReportUpdated) {
      onReportUpdated(updated);
    }
    setIsInternalStatusModalOpen(false);
    enqueueSnackbar('작업 보고서 상태가 성공적으로 변경되었습니다.', { variant: 'success' });
  };

  const handleSaveReviewForm = () => {
    if (!report) return;

    const updated: WorkReport = {
      ...report,
      headName: docFormData.headName,
      dong: docFormData.dong,
      ho: docFormData.ho,
      address: docFormData.address,
      installDate: docFormData.installDateFormatted,
      installDateFormatted: docFormData.installDateFormatted,
      reportTime: docFormData.reportTime,
      reporterName: docFormData.reporterName,
      visitorName: docFormData.visitorName,
      confirmerName: docFormData.confirmerName,
      remarks: docFormData.remarks,
    };

    const allReports = getStoredReports();
    const nextReports = allReports.map(r => r.reportId === updated.reportId ? updated : r);
    saveStoredReports(nextReports);

    if (onReportUpdated) {
      onReportUpdated(updated);
    }
    setIsReviewEditing(false);
    enqueueSnackbar('보고서 정보가 성공적으로 수정되었습니다.', { variant: 'success' });
  };

  const handleCancelReviewEdit = () => {
    if (report) {
      const rawAddress = report.address || '';
      const site = report.siteName || '';
      const formattedAddress = site && !rawAddress.includes(site)
        ? `${rawAddress} (${site})`
        : rawAddress;

      setDocFormData({
        headName: report.headName || '',
        dong: report.dong || '',
        ho: report.ho || '',
        address: formattedAddress,
        installDateFormatted: report.installDateFormatted || report.installDate || '',
        reportTime: report.reportTime || report.submittedAt || '',
        reporterName: report.reporterName || '',
        visitorName: report.visitorName || report.reporterName || '',
        confirmerName: report.confirmerName || report.headName || '',
        confirmerSignature: report.confirmerSignature || '/assets/img/sample_signature.svg',
        remarks: report.remarks || '',
      });
    }
    setIsReviewEditing(false);
  };

  const isEditingAny = isReviewEditing || isDocEditing;

  const handleSwitchTab = (targetMode: 'review' | 'document') => {
    if (isEditingAny) {
      enqueueSnackbar('보고서 수정중에는 불가합니다.', { variant: 'warning' });
      return;
    }
    setReportDialogMode(targetMode);
  };

  const handleSaveDocForm = () => {
    const updated: WorkReport = {
      ...report,
      headName: docFormData.headName,
      dong: docFormData.dong,
      ho: docFormData.ho,
      address: docFormData.address,
      installDateFormatted: docFormData.installDateFormatted,
      reportTime: docFormData.reportTime,
      reporterName: docFormData.reporterName,
      visitorName: docFormData.visitorName,
      confirmerName: docFormData.confirmerName,
      confirmerSignature: docFormData.confirmerSignature || report.confirmerSignature || '/assets/img/sample_signature.svg',
      remarks: docFormData.remarks,
    };

    // 로컬 스토리지에 영구 저장
    const allReports = getStoredReports();
    const nextReports = allReports.map(r => r.reportId === updated.reportId ? updated : r);
    saveStoredReports(nextReports);

    if (onReportUpdated) {
      onReportUpdated(updated);
    }
    setIsDocEditing(false);
    enqueueSnackbar('보급지원확인서 내용이 저장되었습니다.', { variant: 'success' });
  };

  const handlePrintDoc = () => {
    const originalTitle = document.title;
    const siteName = (report.siteName || '현장').trim();
    const dong = (report.dong || '').trim();
    const ho = (report.ho || '').trim();
    const pdfFileName = `${siteName}_${dong}동_${ho}호_보급지원확인서`;

    document.title = pdfFileName;
    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleDownloadPdf = async () => {
    const docElement = document.getElementById('printable-confirmation-sheet');
    if (!docElement) {
      enqueueSnackbar('출력할 서식을 찾을 수 없습니다.', { variant: 'error' });
      return;
    }

    try {
      setIsPdfGenerating(true);

      const siteName = (report.siteName || '현장').trim();
      const dong = (report.dong || '').trim();
      const ho = (report.ho || '').trim();
      const pdfFileName = `${siteName}_${dong}동_${ho}호_보급지원확인서.pdf`;

      // 1. 블러가 서식을 완전히 덮어 깜빡임을 사전에 100% 가리기 위한 시작 전 여유
      await new Promise(resolve => setTimeout(resolve, 400));

      // PDF 캡처/저장 시에만 외곽 테두리(와꾸) 및 그림자 완전 제거 (오버레이도 숨겨짐)
      docElement.classList.add('capturing-for-pdf');
      await new Promise(resolve => setTimeout(resolve, 50));

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(docElement, {
          windowWidth: 1200,
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });
      } finally {
        docElement.classList.remove('capturing-for-pdf');
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = 180;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      const topMargin = Math.max(10, (pdfHeight - imgHeight) / 2);
      const leftMargin = (pdfWidth - imgWidth) / 2;

      pdf.addImage(imgData, 'JPEG', leftMargin, topMargin, imgWidth, imgHeight);

      // 브라우저 다운로드 큐에 파일 자동 저장 (우측 상단 ⬇️에 다운로드 기록)
      pdf.save(pdfFileName);

      // 2. 저장이 끝나고 스타일이 원상복귀될 때까지의 깜빡임을 가려주는 완료 후 여유
      await new Promise(resolve => setTimeout(resolve, 600));

      enqueueSnackbar('PDF가 다운로드되었습니다.', { variant: 'success' });
    } catch (err) {
      console.error('PDF 직접 다운로드 실패:', err);
      enqueueSnackbar('PDF 변환에 실패하여 시스템 인쇄 창으로 연결합니다.', { variant: 'warning' });
      handlePrintDoc();
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const getPhoto = (type: string) => {
    return report.photos?.find(
      p =>
        p.type?.toUpperCase() === type.toUpperCase() ||
        (type === 'DOOR' && (p.title?.includes('대문') || p.type?.toLowerCase() === 'door')) ||
        (type === 'BEFORE1' && (p.title?.includes('전 ①') || p.type?.toLowerCase() === 'before1')) ||
        (type === 'AFTER1' && (p.title?.includes('후 ①') || p.type?.toLowerCase() === 'after1')) ||
        (type === 'BEFORE2' && (p.title?.includes('전 ②') || p.type?.toLowerCase() === 'before2')) ||
        (type === 'AFTER2' && (p.title?.includes('후 ②') || p.type?.toLowerCase() === 'after2'))
    );
  };

  const doorPhoto = getPhoto('DOOR');
  const before1Photo = getPhoto('BEFORE1');
  const after1Photo = getPhoto('AFTER1');
  const before2Photo = getPhoto('BEFORE2');
  const after2Photo = getPhoto('AFTER2');

  const submittedCount = [doorPhoto, before1Photo, after1Photo, before2Photo, after2Photo].filter(
    (p: ReportPhoto | undefined) => Boolean(p?.url)
  ).length;

  const renderPhotoUploadBox = (label: string, photo: ReportPhoto | undefined) => {
    const hasPhoto = Boolean(photo?.url);
    return (
      <div className={`photo-upload-box ${hasPhoto ? 'has-photo' : 'empty-slot'}`}>
        <div className="photo-label-row">
          <span className="photo-label">{label}</span>
          {!hasPhoto && <span className="unsubmitted-tag">미제출</span>}
        </div>
        {hasPhoto ? (
          <div className="photo-preview-wrapper readonly">
            <img 
              src={photo!.url} 
              alt={label} 
              className="preview-img" 
              onError={(e) => {
                e.currentTarget.src = '/assets/img/photo_placeholder.webp';
              }}
            />
          </div>
        ) : (
          <div className="photo-placeholder-readonly">
            <CameraOff size={24} className="empty-icon" />
            <span className="empty-text">사진 미제출</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <SlideDialog
        isOpen={isOpen && !isInternalStatusModalOpen}
        onClose={onClose}
      title={`${report.siteName} (${report.dong}동 ${report.ho}호) 보고서`}
      className="manage-page manage-dashboard-report-dialog confirmation-dialog"
      footer={
        <div className="confirmation-modal-footer-actions">
          {reportDialogMode === 'review' ? (
            isReviewEditing ? (
              <>
                <button
                  type="button"
                  className="btn-close-action btn-flex-tertiary"
                  onClick={handleCancelReviewEdit}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="btn-status-action btn-save-action btn-flex-primary"
                  onClick={handleSaveReviewForm}
                >
                  <span>수정 완료</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-status-action btn-edit-trigger btn-flex-secondary"
                  onClick={() => setIsReviewEditing(true)}
                >
                  <span>정보 수정</span>
                </button>
                <button
                  type="button"
                  className="btn-status-action btn-flex-primary"
                  onClick={handleOpenStatusModal}
                >
                  <span>상태 변경 ({report.status === 'COMPLETED' ? '확인완료' : report.status === 'REJECTED' ? '수정필요' : '검토대기'})</span>
                </button>
              </>
            )
          ) : (
            <>
              <button
                type="button"
                className="btn-status-action btn-edit-trigger btn-flex-secondary"
                onClick={() => {
                  setReportDialogMode('review');
                  setIsReviewEditing(true);
                }}
              >
                <span>정보 수정</span>
              </button>
              <button 
                type="button" 
                className="btn-print-action btn-flex-primary" 
                onClick={handleDownloadPdf}
                disabled={isPdfGenerating}
              >
                {isPdfGenerating ? (
                  <>
                    <Loader2 size={15} className="mask-spinner" />
                    <span>PDF 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    <span>PDF 다운로드</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="dashboard-dialog-content">
        {/* ── MODE SWITCH TOGGLE (검토용 / 제출용) ── */}
        <div className={`dialog-mode-switch-bar ${isEditingAny ? 'is-disabled' : ''}`}>
          <button
            type="button"
            className={`switch-tab-btn ${reportDialogMode === 'review' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('review')}
            title={isEditingAny ? '보고서 수정중에는 불가합니다' : undefined}
          >
            <span>검토 및 수정</span>
          </button>
          <button
            type="button"
            className={`switch-tab-btn ${reportDialogMode === 'document' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('document')}
            title={isEditingAny ? '보고서 수정중에는 불가합니다' : undefined}
          >
            <span>제출용 (출력)</span>
          </button>
        </div>

        {reportDialogMode === 'review' ? (
          /* ── REVIEW MODE (사진 중심 검토 화면) ── */
          <>
            {/* ── 세대 요약 + 메타 4개 + 현장 사진 통합 섹션 ── */}
            <div className="review-main-unified-section">
              <div className="report-target-summary">
                {isReviewEditing ? (
                  <div className="review-edit-grid">
                    <div className="review-edit-field">
                      <label>단지명(현장)</label>
                      <input
                        type="text"
                        className="review-inline-input readonly"
                        value={report.siteName}
                        disabled
                        title="사업지명은 수정할 수 없습니다"
                      />
                    </div>
                    <div className="review-edit-field short">
                      <label>동</label>
                      <input
                        type="text"
                        className="review-inline-input short"
                        value={docFormData.dong}
                        onChange={e => setDocFormData(prev => ({ ...prev, dong: e.target.value }))}
                      />
                    </div>
                    <div className="review-edit-field short">
                      <label>호</label>
                      <input
                        type="text"
                        className="review-inline-input short"
                        value={docFormData.ho}
                        onChange={e => setDocFormData(prev => ({ ...prev, ho: e.target.value }))}
                      />
                    </div>
                    <div className="review-edit-field">
                      <label>세대주 성명</label>
                      <input
                        type="text"
                        className="review-inline-input"
                        value={docFormData.headName}
                        onChange={e => setDocFormData(prev => ({ 
                          ...prev, 
                          headName: e.target.value,
                          confirmerName: prev.confirmerName === prev.headName ? e.target.value : prev.confirmerName
                        }))}
                      />
                    </div>
                    <div className="review-edit-field full">
                      <label>상세 주소</label>
                      <input
                        type="text"
                        className="review-inline-input"
                        value={docFormData.address}
                        onChange={e => setDocFormData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="target-title-line">
                      <Building2 size={16} />
                      <h3>{report.siteName} {report.dong}동 {report.ho}호</h3>
                      <span className="head-badge">{report.headName} 세대주</span>
                    </div>
                    <p className="target-address">
                      {report.address && report.siteName && !report.address.includes(report.siteName)
                        ? `${report.address} (${report.siteName})`
                        : report.address}
                    </p>
                  </>
                )}
              </div>

              <div className="report-quick-meta-grid">
                <div className="meta-cell">
                  <span className="label">설치 일자</span>
                  {isReviewEditing ? (
                    <input
                      type="date"
                      className="review-inline-input"
                      value={docFormData.installDateFormatted}
                      onChange={e => setDocFormData(prev => ({ ...prev, installDateFormatted: e.target.value }))}
                    />
                  ) : (
                    <span className="val">{report.installDate || report.installDateFormatted || '-'}</span>
                  )}
                </div>
                <div className="meta-cell">
                  <span className="label">보고자</span>
                  {isReviewEditing ? (
                    <input
                      type="text"
                      className="review-inline-input"
                      value={docFormData.reporterName}
                      onChange={e => setDocFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                    />
                  ) : (
                    <span className="val">{report.reporterName}</span>
                  )}
                </div>
                <div className="meta-cell">
                  <span className="label">확인 상태</span>
                  <div className="val"><StatusBadge status={report.status} /></div>
                </div>
                <div className="meta-cell">
                  <span className="label">제출 시각</span>
                  {isReviewEditing ? (
                    <input
                      type="text"
                      className="review-inline-input"
                      value={docFormData.reportTime}
                      onChange={e => setDocFormData(prev => ({ ...prev, reportTime: e.target.value }))}
                    />
                  ) : (
                    <span className="val">{report.submittedAt || report.reportTime}</span>
                  )}
                </div>
              </div>

              {/* 현장 사진 섹션 */}
              <div className="dialog-photos-section">
                <div className="photos-header-row">
                  <label className="form-label">
                    <span>현장 사진 (총 5개)</span>
                  </label>
                  <span className={`photos-count-pill ${submittedCount === 5 ? 'completed' : 'pending'}`}>
                    {submittedCount === 5 ? '✓ 5개 완료' : `${submittedCount} / 5개 등록`}
                  </span>
                </div>

                <div className="photos-clean-layout">
                  <div className="door-single-section">
                    {renderPhotoUploadBox('1. 신주소 대문', doorPhoto)}
                  </div>
                  <div className="sensor-pairs-grid">
                    {renderPhotoUploadBox('2. 보급 전 ①', before1Photo)}
                    {renderPhotoUploadBox('3. 보급 후 ①', after1Photo)}
                    {renderPhotoUploadBox('4. 보급 전 ②', before2Photo)}
                    {renderPhotoUploadBox('5. 보급 후 ②', after2Photo)}
                  </div>
                </div>
              </div>
            </div>

            {/* 확인자 확인 및 서명 섹션 (검토용 화면 필수 정보) */}
            <div className="dialog-confirmer-section">
              <div className="confirmer-header-row">
                <label className="form-label">
                  <span>확인자 서명 및 확인 정보</span>
                </label>
              </div>
              <div className="confirmer-card-body">
                <div className="confirmer-info-col">
                  <div className="info-sub-item">
                    <span className="sub-label">확인자 성명</span>
                    {isReviewEditing ? (
                      <input
                        type="text"
                        className="review-inline-input"
                        value={docFormData.confirmerName}
                        onChange={e => setDocFormData(prev => ({ ...prev, confirmerName: e.target.value }))}
                      />
                    ) : (
                      <span className="sub-val">{report.confirmerName || report.headName}</span>
                    )}
                  </div>
                  <div className="info-sub-item">
                    <span className="sub-label">서명 확인 일시</span>
                    <span className="sub-val">{report.submittedAt || report.reportTime || '2026-09-02 14:30'}</span>
                  </div>
                </div>
                <div className="confirmer-sign-col">
                  <div className="signature-preview-frame">
                    <img 
                      src={report.confirmerSignature || '/assets/img/sample_signature.svg'} 
                      alt="확인자 서명" 
                      className="confirmer-signature-img" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 특이사항 및 비고 섹션 */}
            {isReviewEditing ? (
              <div className="dialog-remarks-box editing">
                <span className="box-title">특이사항 및 비고 수정</span>
                <textarea
                  className="review-inline-textarea"
                  rows={3}
                  placeholder="특이사항이나 전달사항을 입력하세요."
                  value={docFormData.remarks}
                  onChange={e => setDocFormData(prev => ({ ...prev, remarks: e.target.value }))}
                />
              </div>
            ) : report.remarks ? (
              <div className="dialog-remarks-box">
                <span className="box-title">특이사항 및 비고</span>
                <p>{report.remarks}</p>
              </div>
            ) : null}

            {report.status === 'REJECTED' && (
              <div className="dialog-rejected-box">
                <span className="box-title">수정 및 보완 요청 사유</span>
                <p>{report.fixReason || '보완 요청 사유가 기재되지 않았습니다.'}</p>
              </div>
            )}
          </>
        ) : (
          /* ── DOCUMENT MODE (개인정보 동의 포함 공식 공문서 서식) ── */
          <div className="document-paper-wrapper">
            {/* PDF 생성 중 100% 완전 차단 모자이크 블러 가림막 */}
            {isPdfGenerating && (
              <div className="document-pdf-mask-overlay">
                <div className="pdf-mask-indicator">
                  <Loader2 size={24} className="animate-spin mask-spinner" />
                  <span>PDF 문서 저장 중...</span>
                </div>
              </div>
            )}
            <div className="confirmation-document-paper" id="printable-confirmation-sheet">
              {/* 1. 문서 헤더: 타이틀 + 우측 끝 확인자 결재칸 */}
            <div className="doc-header-row">
              <div className="doc-title-box">
                <h1 className="doc-main-title">단독경보형감지기 보급지원확인서</h1>
              </div>
              <table className="confirmer-stamp-table">
                <thead>
                  <tr>
                    <th>확인자</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="name-row">
                    <td>
                      {isDocEditing ? (
                        <input
                          type="text"
                          className="doc-stamp-input"
                          value={docFormData.confirmerName || docFormData.headName}
                          onChange={e => setDocFormData(prev => ({ ...prev, confirmerName: e.target.value }))}
                        />
                      ) : (
                        docFormData.confirmerName || docFormData.headName
                      )}
                    </td>
                  </tr>
                  <tr className="sign-row">
                    <td className="stamp-cell stamp-sign-cell">
                      <div className="stamp-signature-frame">
                        <img
                          src={docFormData.confirmerSignature || report.confirmerSignature || '/assets/img/sample_signature.svg'}
                          alt="확인자 서명"
                          className="stamp-signature-img"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. 개인정보 수집 및 이용 동의 (주소 위에 배치) */}
            <div className="doc-privacy-consent-box">
              <div className="privacy-title-row">
                <h4 className="privacy-title">■ 개인정보의 수집 및 이용에 대한 동의</h4>
              </div>
              <div className="privacy-content-text">
                <ul className="privacy-terms-list">
                  <li>
                    <strong className="term-num-title">1. 수집 및 이용 목적</strong>
                    <p className="term-sub-desc">- 경기도 소방재난본부 화제안전취약자 안전 생활환경 조성 지원</p>
                  </li>
                  <li>
                    <strong className="term-num-title">2. 수집 및 이용 항목</strong>
                    <p className="term-sub-desc">- 세대 동, 호수, 이름</p>
                  </li>
                  <li>
                    <strong className="term-num-title">3. 개인정보의 보유 및 이용 기간</strong>
                    <p className="term-sub-desc">- 노후아파트 단독경보형 감지기 무상보급 대상자의 개인정보 수집・이용목적이 달성되고 향후 무상교체까지(10년) 위 이용목적을 위하여 보유 및 이용하게 됩니다.</p>
                  </li>
                  <li>
                    <strong className="term-num-title">4. 동의를 거부할 권리 및 동의를 거부할 경우의 불이익</strong>
                    <p className="term-sub-desc">- 노후아파트 단독경보형 감지기 무상보급 대상자(정보주체)는 개인정보 수집 이용에 대한 동의를 거부할 권리가 있습니다.</p>
                    <p className="term-sub-desc">- 다만 위 개인정보의 수집 이용에 관한 동의는 향후 무상교체를 위해 필수적인 사항으로 동의를 거부하실 경우 단독경보형 감지기 무상교체 대상에서 제한될 수 있습니다.</p>
                  </li>
                  <li>
                    <strong className="term-num-title">5. 경기도 소방재난본부 및 관할 소방서가 위와 같이 개인정보를 수집 이용하는 것에 동의하시면 동, 호수, 성명란에 작성 바랍니다.</strong>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. 주소 배너 */}
            <div className="doc-address-banner">
              <span className="addr-label">주소</span>
              {isDocEditing ? (
                <input
                  type="text"
                  className="doc-inline-input flex-1"
                  value={docFormData.address}
                  onChange={e => setDocFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              ) : (
                <span className="addr-content">{docFormData.address}</span>
              )}
            </div>

            {/* 4. 본문 6칸 그리드 (2열 x 3행: 둘 둘 둘, 동일한 4:3 사이즈 및 상단 띠 바) */}
            <div className="doc-six-cards-grid">
              {/* [1행-1] 1. 보급 지원 세대 정보 카드 (사진과 100% 동일한 사이즈) */}
              <div className="doc-grid-card spec-grid-card">
                <div className="card-top-ribbon">보급 지원 세대 정보</div>
                <table className="doc-official-spec-table">
                  <tbody>
                    <tr>
                      <th className="spec-label-th">1. 성 명</th>
                      <td className="spec-value-td">
                        {isDocEditing ? (
                          <input
                            type="text"
                            className="doc-inline-input"
                            value={docFormData.headName}
                            onChange={e => setDocFormData(prev => ({ ...prev, headName: e.target.value }))}
                          />
                        ) : (
                          <span>{docFormData.headName || '—'}</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="spec-label-th">2. 동/호수</th>
                      <td className="spec-value-td">
                        {isDocEditing ? (
                          <div className="dong-ho-input-group">
                            <input
                              type="text"
                              className="doc-inline-input short"
                              value={docFormData.dong}
                              onChange={e => setDocFormData(prev => ({ ...prev, dong: e.target.value }))}
                            />
                            <span>동</span>
                            <input
                              type="text"
                              className="doc-inline-input short"
                              value={docFormData.ho}
                              onChange={e => setDocFormData(prev => ({ ...prev, ho: e.target.value }))}
                            />
                            <span>호</span>
                          </div>
                        ) : (
                          <span>{docFormData.dong ? `${docFormData.dong}동 ${docFormData.ho}호` : '—'}</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="spec-label-th">3. 설치일</th>
                      <td className="spec-value-td">
                        {isDocEditing ? (
                          <input
                            type="text"
                            className="doc-inline-input"
                            value={docFormData.installDateFormatted}
                            onChange={e => setDocFormData(prev => ({ ...prev, installDateFormatted: e.target.value }))}
                          />
                        ) : (
                          <span>{docFormData.installDateFormatted || '—'}</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="spec-label-th">4. 설치자</th>
                      <td className="spec-value-td">
                        {isDocEditing ? (
                          <input
                            type="text"
                            className="doc-inline-input"
                            value={docFormData.reporterName}
                            onChange={e => setDocFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                          />
                        ) : (
                          <span>{docFormData.reporterName || '—'}</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* [1행-2] 2. 신주소 보이는 대문 등 */}
              <div className="doc-grid-card photo-grid-card">
                <div className="card-top-ribbon">신주소 보이는 대문 등</div>
                <div className="card-photo-content">
                  {doorPhoto?.url ? (
                    <img 
                      src={doorPhoto.url} 
                      alt="신주소 보이는 대문 등" 
                      className="doc-preview-img" 
                      onError={(e) => {
                        e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                      }}
                    />
                  ) : (
                    <span className="doc-photo-placeholder">사진 미등록</span>
                  )}
                </div>
              </div>

              {/* [2행-1] 3. 감지기 1 설치 전 */}
              <div className="doc-grid-card photo-grid-card">
                <div className="card-top-ribbon">감지기 1 설치 전</div>
                <div className="card-photo-content">
                  {before1Photo?.url ? (
                    <img 
                      src={before1Photo.url} 
                      alt="감지기 1 설치 전" 
                      className="doc-preview-img" 
                      onError={(e) => {
                        e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                      }}
                    />
                  ) : (
                    <span className="doc-photo-placeholder">사진 미등록</span>
                  )}
                </div>
              </div>

              {/* [2행-2] 4. 감지기 1 설치 후 */}
              <div className="doc-grid-card photo-grid-card">
                <div className="card-top-ribbon">감지기 1 설치 후</div>
                <div className="card-photo-content">
                  {after1Photo?.url ? (
                    <img 
                      src={after1Photo.url} 
                      alt="감지기 1 설치 후" 
                      className="doc-preview-img" 
                      onError={(e) => {
                        e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                      }}
                    />
                  ) : (
                    <span className="doc-photo-placeholder">사진 미등록</span>
                  )}
                </div>
              </div>

              {/* [3행-1] 5. 감지기 2 설치 전 */}
              <div className="doc-grid-card photo-grid-card">
                <div className="card-top-ribbon">감지기 2 설치 전</div>
                <div className="card-photo-content">
                  {before2Photo?.url ? (
                    <img 
                      src={before2Photo.url} 
                      alt="감지기 2 설치 전" 
                      className="doc-preview-img" 
                      onError={(e) => {
                        e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                      }}
                    />
                  ) : (
                    <span className="doc-photo-placeholder">사진 미등록</span>
                  )}
                </div>
              </div>

              {/* [3행-2] 6. 감지기 2 설치 후 */}
              <div className="doc-grid-card photo-grid-card">
                <div className="card-top-ribbon">감지기 2 설치 후</div>
                <div className="card-photo-content">
                  {after2Photo?.url ? (
                    <img 
                      src={after2Photo.url} 
                      alt="감지기 2 설치 후" 
                      className="doc-preview-img" 
                      onError={(e) => {
                        e.currentTarget.src = '/assets/img/photo_placeholder.webp';
                      }}
                    />
                  ) : (
                    <span className="doc-photo-placeholder">사진 미등록</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </SlideDialog>

    {/* ── 내장 상태 변경 모달 (대시보드 / 보고서관리 공통 지원) ── */}
    <SlideDialog
      isOpen={isInternalStatusModalOpen}
      onClose={() => setIsInternalStatusModalOpen(false)}
      title="작업 보고서 상태 변경"
      className="manage-page"
      footer={
        <div className="dialog-btn-group">
          <button type="button" className="btn-cancel" onClick={() => setIsInternalStatusModalOpen(false)}>
            취소
          </button>
          <button type="submit" form="internal-report-status-form" className="btn-save">
            상태 저장하기
          </button>
        </div>
      }
    >
      <form id="internal-report-status-form" className="report-status-dialog-form" onSubmit={handleSubmitInternalStatus}>
        <div className="target-report-summary-box">
          <div className="summary-row">
            <span className="key">현장명</span>
            <span className="val">{report.siteName} ({report.dong}동 {report.ho}호)</span>
          </div>
          <div className="summary-row">
            <span className="key">세대주</span>
            <span className="val">{report.headName}</span>
          </div>
          <div className="summary-row">
            <span className="key">설치 작업자</span>
            <span className="val">{report.reporterName}</span>
          </div>
          <div className="summary-row">
            <span className="key">설치일자</span>
            <span className="val">{report.installDateFormatted || report.installDate}</span>
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

        {report.status !== statusFormData.status && (
          <div className="status-transition-card is-changed">
            <div className="transition-header">
              <span className="transition-title">상태 변경 확인</span>
              <span className="transition-pill changed">변경 예정</span>
            </div>
            <div className="transition-body">
              <div className="transition-node before">
                <span className="node-label">변경 전</span>
                <StatusBadge status={report.status} />
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
    </SlideDialog>
  </>
  );
}
