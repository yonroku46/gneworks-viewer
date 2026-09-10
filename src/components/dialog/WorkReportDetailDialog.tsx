'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  CameraOff, 
  Download,
  Loader2,
  ArrowRight,
  Check,
  XCircle,
  RotateCcw,
  MoreVertical,
  Trash2,
  Edit3,
  AlertTriangle,
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AdminService from '@/api/service/AdminService';
import StatusBadge from '@/components/common/StatusBadge';
import SlideDialog from '@/components/dialog/SlideDialog';
import CustomSelect from '@/components/common/CustomSelect';
import ConfirmationDocumentPaper from '@/components/common/ConfirmationDocumentPaper';
import { getImageUrl } from '@/common/utils/imageUtils';
import './WorkReportDetailDialog.scss';

export interface WorkReportDetailDialogProps {
  isOpen: boolean;
  report?: WorkReport;
  onClose: () => void;
  onReportUpdated?: (updated: WorkReport) => void;
  onOpenStatusModal?: (report: WorkReport, defaultStatus?: ReportStatus) => void;
  onDeleteSuccess?: (reportId: string) => void;
}

export default function WorkReportDetailDialog({
  isOpen,
  report,
  onClose,
  onReportUpdated,
  onOpenStatusModal,
  onDeleteSuccess,
}: WorkReportDetailDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [reportDialogMode, setReportDialogMode] = useState<'review' | 'document'>('review');
  const [isReviewEditing, setIsReviewEditing] = useState(false);
  const [isDocEditing, setIsDocEditing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const isCancelledRef = useRef(false);

  // PDF 생성 중 브라우저 탭 닫기 / 새로고침 방어
  useEffect(() => {
    if (!isPdfGenerating) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPdfGenerating]);

  // PDF 생성 중 다이얼로그 닫기 방어 로직 (X버튼, ESC, 백드롭, 닫기 버튼 공통)
  const handleSafeClose = () => {
    if (isPdfGenerating) {
      const confirmClose = window.confirm('현재 PDF 생성 작업이 진행 중입니다. 작업을 중단하고 창을 닫으시겠습니까?');
      if (!confirmClose) {
        return;
      }
      isCancelledRef.current = true;
    }
    onClose();
  };

  // 헤더 더보기(More) 메뉴 및 삭제 확인 모달 상태
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const QUICK_DELETE_REASONS = [
    '오등록/중복 세대',
    '작업자 오입력 요청',
    '세대 현장 취소',
    '사진 오류/재작성 예정',
  ];

  // 더보기 메뉴 외부 클릭 감지
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

  // 자체 내장 상태 변경 팝업 상태 (대시보드 / 보고서관리 공통 지원)
  const [isInternalStatusModalOpen, setIsInternalStatusModalOpen] = useState(false);
  const [statusFormData, setStatusFormData] = useState<{
    status: ReportStatus;
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
      setIsMoreMenuOpen(false);
      setIsDeleteModalOpen(false);
      setDeleteReason('');
    }
  }, [report]);

  if (!report) return null;

  // 보고서 영구 삭제 확인 처리 (API 연동)
  const handleConfirmDelete = async () => {
    if (!report || isDeleting) return;
    if (!deleteReason.trim() || deleteReason.trim().length < 5) {
      enqueueSnackbar('삭제 사유를 최소 5자 이상 구체적으로 입력해주세요.', { variant: 'warning' });
      return;
    }
    setIsDeleting(true);
    try {
      await AdminService.deleteReport(report.reportId, deleteReason.trim());
      enqueueSnackbar('보고서가 영구 삭제되었습니다.', { variant: 'success' });
      setIsDeleteModalOpen(false);
      onDeleteSuccess?.(report.reportId);
      onClose();
    } catch (err: any) {
      console.error('[WorkReportDetailDialog] deleteReport error:', err);
      enqueueSnackbar('보고서 삭제 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  // 원클릭 확인완료(승인) 즉시 처리
  const handleApprove = async () => {
    if (!report || isApproving) return;
    setIsApproving(true);
    try {
      await AdminService.updateReportStatus(report.reportId, {
        status: 'COMPLETED',
        fixReason: '',
      });

      const updated: WorkReport = {
        ...report,
        status: 'COMPLETED',
        fixReason: '',
      };

      if (onReportUpdated) {
        onReportUpdated(updated);
      }
      enqueueSnackbar('작업 보고서가 확인완료되었습니다.', { variant: 'success' });
    } catch (err: any) {
      console.error('[WorkReportDetailDialog] handleApprove error:', err);
      enqueueSnackbar(err?.message || '확인완료 처리 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsApproving(false);
    }
  };

  // 반려 (사유작성) 모달 오픈
  const handleOpenRejectModal = () => {
    if (!report) return;
    setStatusFormData({
      status: 'REJECTED',
      fixReason: report.fixReason || '',
    });
    if (onOpenStatusModal) {
      onOpenStatusModal(report, 'REJECTED');
    } else {
      setIsInternalStatusModalOpen(true);
    }
  };

  const handleOpenStatusModal = () => {
    if (!report) return;
    setStatusFormData({
      status: report.status,
      fixReason: report.fixReason || '',
    });
    if (onOpenStatusModal) {
      onOpenStatusModal(report);
    } else {
      setIsInternalStatusModalOpen(true);
    }
  };

  const handleSubmitInternalStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    if (statusFormData.status === 'REJECTED' && !statusFormData.fixReason.trim()) {
      enqueueSnackbar('작업자가 확인할 수 있도록 반려 사유를 작성해 주세요.', { variant: 'warning' });
      return;
    }

    try {
      await AdminService.updateReportStatus(report.reportId, {
        status: statusFormData.status,
        fixReason: statusFormData.status === 'REJECTED' ? statusFormData.fixReason.trim() : '',
      });

      const updated: WorkReport = {
        ...report,
        status: statusFormData.status,
        fixReason: statusFormData.status === 'REJECTED' ? statusFormData.fixReason.trim() : '',
      };

      if (onReportUpdated) {
        onReportUpdated(updated);
      }
      setIsInternalStatusModalOpen(false);
      enqueueSnackbar('작업 보고서 상태가 성공적으로 변경되었습니다.', { variant: 'success' });
    } catch (err: any) {
      console.error('[WorkReportDetailDialog] updateReportStatus error:', err);
      enqueueSnackbar(err?.message || '상태 변경 중 오류가 발생했습니다.', { variant: 'error' });
    }
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
    if (isPdfGenerating) {
      enqueueSnackbar('PDF 생성 중에는 탭을 전환할 수 없습니다.', { variant: 'warning' });
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

    isCancelledRef.current = false;
    try {
      setIsPdfGenerating(true);

      const siteName = (report.siteName || '현장').trim();
      const dong = (report.dong || '').trim();
      const ho = (report.ho || '').trim();
      const pdfFileName = `${siteName}_${dong}동_${ho}호_보급지원확인서.pdf`;

      // 1. 서식 내 모든 이미지가 완전히 로드될 때까지 대기
      const imgElements = Array.from(docElement.querySelectorAll<HTMLImageElement>('img'));
      await Promise.all(
        imgElements.map(img => {
          if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 2000);
          });
        })
      );
      if (isCancelledRef.current) return;

      // 2. Next.js rewrite 경로(/report/...)를 통해 S3 이미지를 CORS 없이 동일 오리진으로 fetch -> DataURL 변환
      const s3Prefix = process.env.NEXT_PUBLIC_S3_PREFIX;
      const toSameOriginUrl = (url: string) => {
        if (!url) return '';
        if (s3Prefix && url.includes(s3Prefix)) {
          const idx = url.indexOf(s3Prefix);
          return url.substring(idx + s3Prefix.length);
        }
        return url;
      };

      const originalSources = new Map<HTMLImageElement, string>();
      await Promise.all(
        imgElements.map(async (img) => {
          const src = img.src;
          if (!src || src.startsWith('data:')) return;
          try {
            const proxyUrl = toSameOriginUrl(src);
            const res = await fetch(proxyUrl);
            if (res.ok) {
              const blob = await res.blob();
              const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              originalSources.set(img, src);
              img.src = dataUrl;
            }
          } catch {
            // fetch 실패 시 기존 src 유지
          }
        })
      );
      if (isCancelledRef.current) return;

      // 3. 서식 캡처 준비 (스타일 안정화 대기)
      docElement.classList.add('capturing-for-pdf');
      await new Promise(resolve => setTimeout(resolve, 100));

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(docElement, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0,
          width: docElement.offsetWidth,
          height: docElement.offsetHeight,
        });
      } finally {
        docElement.classList.remove('capturing-for-pdf');
        // 임시 DataURL 이미지 원상 복원
        originalSources.forEach((origSrc, img) => {
          img.src = origSrc;
        });
      }

      if (isCancelledRef.current) return;

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgProps = pdf.getImageProperties(imgData);

      // A4 용지 내 여백을 기존의 절반인 약 7mm 수준으로 최적화하여 꽉 찬 서식 인쇄
      const maxWidth = 196; // 좌우 여백 각 약 7mm
      const maxHeight = 282; // 상하 여백 각 약 7.5mm

      let renderWidth = maxWidth;
      let renderHeight = (imgProps.height * renderWidth) / imgProps.width;

      if (renderHeight > maxHeight) {
        renderHeight = maxHeight;
        renderWidth = (imgProps.width * renderHeight) / imgProps.height;
      }

      const leftMargin = (pdfWidth - renderWidth) / 2;
      const topMargin = (pdfHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'JPEG', leftMargin, topMargin, renderWidth, renderHeight);
      pdf.save(pdfFileName);

      enqueueSnackbar('PDF가 다운로드되었습니다.', { variant: 'success' });
    } catch (err) {
      if (isCancelledRef.current) return;
      console.error('PDF 직접 다운로드 실패:', err);
      enqueueSnackbar('PDF 변환에 실패하여 시스템 인쇄 창으로 연결합니다.', { variant: 'warning' });
      handlePrintDoc();
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const getPhoto = (type: string): { url?: string; title?: string } | undefined => {
    if (type === 'DOOR' && report.photoDoor) return { url: getImageUrl(report.photoDoor), title: '대문' };
    if (type === 'BEFORE1' && report.photoBefore1) return { url: getImageUrl(report.photoBefore1), title: '설치 전 ①' };
    if (type === 'AFTER1' && report.photoAfter1) return { url: getImageUrl(report.photoAfter1), title: '설치 후 ①' };
    if (type === 'BEFORE2' && report.photoBefore2) return { url: getImageUrl(report.photoBefore2), title: '설치 전 ②' };
    if (type === 'AFTER2' && report.photoAfter2) return { url: getImageUrl(report.photoAfter2), title: '설치 후 ②' };
    return undefined;
  };

  const doorPhoto = getPhoto('DOOR');
  const before1Photo = getPhoto('BEFORE1');
  const after1Photo = getPhoto('AFTER1');
  const before2Photo = getPhoto('BEFORE2');
  const after2Photo = getPhoto('AFTER2');

  const submittedCount = [doorPhoto, before1Photo, after1Photo, before2Photo, after2Photo].filter(
    (p: { url?: string } | undefined) => Boolean(p?.url)
  ).length;

  const renderPhotoUploadBox = (label: string, photo: { url?: string; title?: string } | undefined) => {
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
              decoding="async"
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
        onClose={handleSafeClose}
        title={`보고서 상세`}
        className="manage-page manage-dashboard-report-dialog confirmation-dialog"
        rightElement={
          <div className="report-detail-more-menu-wrap" ref={moreMenuRef}>
            <button
              type="button"
              className={`btn-more-menu-trigger ${isMoreMenuOpen ? 'active' : ''}`}
              onClick={() => {
                if (isPdfGenerating) return;
                setIsMoreMenuOpen(prev => !prev);
              }}
              disabled={isPdfGenerating}
              aria-label="추가 작업 메뉴"
              title="더보기"
            >
              <MoreVertical size={19} />
            </button>
            {isMoreMenuOpen && (
              <div className="report-detail-dropdown-menu">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    if (reportDialogMode !== 'review') {
                      setReportDialogMode('review');
                    }
                    setIsReviewEditing(true);
                  }}
                >
                  <Edit3 size={15} />
                  <span>보고서 수정</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item danger"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash2 size={15} />
                  <span>보고서 삭제</span>
                </button>
              </div>
            )}
          </div>
        }
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
                  {report.status !== 'COMPLETED' ? (
                    <>
                      <button
                        type="button"
                        className="btn-status-action btn-reject-action btn-flex-secondary"
                        onClick={handleOpenRejectModal}
                      >
                        <XCircle size={14} />
                        <span>반려</span>
                      </button>
                      <button
                        type="button"
                        className="btn-status-action btn-approve-action btn-flex-primary"
                        onClick={handleApprove}
                        disabled={isApproving}
                      >
                        {isApproving ? (
                          <Loader2 size={15} className="mask-spinner" />
                        ) : (
                          <Check size={15} />
                        )}
                        <span>{isApproving ? '처리 중...' : '확인완료'}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn-status-action btn-edit-trigger btn-flex-secondary"
                        onClick={handleOpenStatusModal}
                        title="상태를 다시 변경하려면 클릭하세요"
                      >
                        <RotateCcw size={14} />
                        <span>상태 변경</span>
                      </button>
                      <button
                        type="button"
                        className="btn-status-action btn-close-action btn-flex-primary"
                        onClick={handleSafeClose}
                      >
                        <span>닫기</span>
                      </button>
                    </>
                  )}
                </>
              )
            ) : (
              <button 
                type="button" 
                className="btn-print-action btn-flex-primary" 
                onClick={handleDownloadPdf}
                disabled={isPdfGenerating}
                style={{ width: '100%' }}
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
            )}
          </div>
        }
      >
      <div className="dashboard-dialog-content">
        {/* ── MODE SWITCH TOGGLE (검토용 / 제출용) ── */}
        <div className={`dialog-mode-switch-bar ${isEditingAny || isPdfGenerating ? 'is-disabled' : ''}`}>
          <button
            type="button"
            className={`switch-tab-btn ${reportDialogMode === 'review' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('review')}
            disabled={isPdfGenerating}
            title={isEditingAny ? '보고서 수정중에는 불가합니다' : isPdfGenerating ? 'PDF 생성 중에는 이동할 수 없습니다' : undefined}
          >
            <span>검토 및 수정</span>
          </button>
          <button
            type="button"
            className={`switch-tab-btn ${reportDialogMode === 'document' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('document')}
            disabled={isPdfGenerating}
            title={isEditingAny ? '보고서 수정중에는 불가합니다' : isPdfGenerating ? 'PDF 생성 중에는 이동할 수 없습니다' : undefined}
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
                      src={getImageUrl(report.confirmerSignature) || '/assets/img/sample_signature.svg'} 
                      alt="확인자 서명" 
                      className="confirmer-signature-img" 
                      decoding="async"
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
            <ConfirmationDocumentPaper
              id="printable-confirmation-sheet"
              report={report}
              docFormData={docFormData}
              isEditing={isDocEditing}
              onFormChange={(field, val) => setDocFormData(prev => ({ ...prev, [field]: val }))}
            />
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

    {/* ── 보고서 영구 삭제 확인 모달 ── */}
    <SlideDialog
      isOpen={isDeleteModalOpen}
      onClose={() => { if (!isDeleting) setIsDeleteModalOpen(false); }}
      title="보고서 영구 삭제"
      className="report-delete-slide-dialog manage-page"
      disableBackdropClick={isDeleting}
      hideCloseButton={isDeleting}
      footer={
        <div className="dialog-btn-group">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            취소
          </button>
          <button
            type="button"
            className="btn-confirm-delete"
            onClick={handleConfirmDelete}
            disabled={deleteReason.trim().length < 5 || isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="mask-spinner" />
                <span>삭제 처리 중...</span>
              </>
            ) : (
              <>
                <span>영구 삭제 진행</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="report-delete-dialog-content">
        <div className="delete-warning-banner">
          <AlertTriangle size={20} className="warning-icon" />
          <div className="warning-text">
            <strong>주의: 삭제 시 복구할 수 없습니다.</strong>
            <p>보고서 원본 및 S3 사진들이 즉시 영구 삭제되며, 해당 세대({report.dong}동 {report.ho}호)는 &apos;미설치&apos; 상태로 자동 원복됩니다.</p>
          </div>
        </div>

        <div className="delete-target-card">
          <div className="target-item">
            <span className="lbl">현장명</span>
            <strong className="val">{report.siteName}</strong>
          </div>
          <div className="target-item">
            <span className="lbl">동/호수</span>
            <strong className="val">{report.dong}동 {report.ho}호 ({report.headName || '세대주 미상'})</strong>
          </div>
          <div className="target-item">
            <span className="lbl">작업자</span>
            <span className="val">{report.reporterName || '-'} (시공일: {report.installDateFormatted || report.installDate || '-'})</span>
          </div>
        </div>

        <div className="delete-reason-section">
          <label className="reason-label">
            <span>삭제 사유 <span className="req">*</span></span>
          </label>
          <div className="quick-reason-chips">
            {QUICK_DELETE_REASONS.map(r => (
              <button
                key={r}
                type="button"
                className="quick-chip"
                onClick={() => setDeleteReason(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <textarea
            className="reason-textarea"
            placeholder="구체적인 삭제 사유를 입력하세요 (예: 오등록 중복 세대, 재작성 요청 등 최소 5자 이상)"
            value={deleteReason}
            onChange={e => setDeleteReason(e.target.value)}
            rows={5}
          />
        </div>
      </div>
    </SlideDialog>
  </>
  );
}
