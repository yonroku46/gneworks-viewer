'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import SlideDialog from './SlideDialog';
import dayjs from 'dayjs';
import { TARGET_TYPE_LABEL_MAP } from '@/components/common/StatusBadge';
import { Download, Loader2 } from 'lucide-react';
import { useSnackbar } from 'notistack';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CompletionReportCoverPaper from '@/components/common/CompletionReportCoverPaper';
import ConfirmationDocumentPaper from '@/components/common/ConfirmationDocumentPaper';
import './RegionalBatchPrintDialog.scss';

export interface RegionalBatchPrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  region: SelectedRegion;
  regionLabel?: string;
  reports: WorkReport[];
  sites?: SiteDetail[];
}

export default function RegionalBatchPrintDialog({
  isOpen,
  onClose,
  region,
  regionLabel = '',
  reports,
  sites = [],
}: RegionalBatchPrintDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

  // ── Mode: 'filter' (보고서 관리/필터) vs 'preview' (제출용 PDF 미리보기) ──
  const [activeTab, setActiveTab] = useState<'filter' | 'preview'>('filter');

  // ── Filter States ──
  const [datePreset, setDatePreset] = useState<'all' | 'month' | 'custom'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // ── PDF Generating States ──
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState('');
  const [isBatchCapturing, setIsBatchCapturing] = useState(false);
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

  // ── Target Reports: 오직 '확인완료(COMPLETED)' 보고서만 필터링 ──
  const completedReportsInRegion = useMemo(() => {
    return reports.filter(r => r.status === 'COMPLETED');
  }, [reports]);

  // ── Date Filtered Reports ──
  const filteredReports = useMemo(() => {
    return completedReportsInRegion.filter(r => {
      const rDate = r.installDate || (r.reportTime ? r.reportTime.split(' ')[0] : '');
      if (startDate && rDate && rDate < startDate) return false;
      if (endDate && rDate && rDate > endDate) return false;
      return true;
    });
  }, [completedReportsInRegion, startDate, endDate]);

  // ── Final Reports for Export (해당 지역 확인완료 전체 일괄 출력) ──
  const exportReports = filteredReports;

  // Total detector count for export reports
  const totalDetectorCount = useMemo(() => {
    return exportReports.length * 2; // Default standard: 2 per household
  }, [exportReports]);

  // Helper to find household info from sites
  const getHouseholdInfo = (report: WorkReport) => {
    const site = sites.find(s => s.siteId === report.siteId || s.name === report.siteName);
    if (!site) return null;
    return site.households?.find(h => h.dong === report.dong && h.ho === report.ho);
  };

  // Quick Date Preset Handler (전체, 1개월, 기간선택)
  const handleDatePreset = (preset: 'all' | 'month' | 'custom') => {
    setDatePreset(preset);
    const today = dayjs();
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'month') {
      setStartDate(today.subtract(1, 'month').format('YYYY-MM-DD'));
      setEndDate(today.format('YYYY-MM-DD'));
    } else if (preset === 'custom') {
      if (!startDate) {
        setStartDate(today.startOf('month').format('YYYY-MM-DD'));
      }
      if (!endDate) {
        setEndDate(today.format('YYYY-MM-DD'));
      }
    }
  };


  // ── 2. 직접 PDF 파일 다운로드 (jsPDF + html2canvas 일괄 생성) ──
  const handleDownloadPdf = async () => {
    if (exportReports.length === 0) {
      enqueueSnackbar('출력 대상 세대가 없습니다.', { variant: 'warning' });
      return;
    }

    const bundleElement = document.getElementById('printable-regional-batch-bundle');
    if (!bundleElement) {
      enqueueSnackbar('출력할 서식 문서를 찾을 수 없습니다.', { variant: 'error' });
      return;
    }

    isCancelledRef.current = false;
    try {
      setIsPdfGenerating(true);
      setIsBatchCapturing(true);
      setPdfProgressText('PDF 생성 준비 중...');

      // 1. 전체 세대 마운트 및 렌더링 안정화 대기
      await new Promise(resolve => setTimeout(resolve, 300));
      if (isCancelledRef.current) return;

      const coverElements = Array.from(bundleElement.querySelectorAll<HTMLElement>('.completion-report-cover-paper'));
      const paperElements = Array.from(bundleElement.querySelectorAll<HTMLElement>('.confirmation-document-paper'));
      if (coverElements.length === 0 || paperElements.length === 0) {
        enqueueSnackbar('출력할 서식 문서를 렌더링할 수 없습니다.', { variant: 'error' });
        return;
      }

      // 2. 번들 내 모든 이미지 로드 대기
      const imgElements = Array.from(bundleElement.querySelectorAll<HTMLImageElement>('img'));
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

      // 3. S3 rewrite 경로(/report/...)를 통해 CORS 없이 DataURL 변환
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

      // 4. jsPDF 초기화 (A4 세로)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const maxWidth = 196;
      const maxHeight = 282;
      let renderW = maxWidth;
      let renderH = maxHeight;
      let leftM = 0;
      let topM = 0;

      // 5. 보급완료 보고서 대지 캡처 (1장 또는 분할된 복수 페이지)
      const totalPages = coverElements.length + paperElements.length;

      let currentPageNum = 1;
      for (let i = 0; i < coverElements.length; i++) {
        if (isCancelledRef.current) return;
        const coverEl = coverElements[i];
        setPdfProgressText(`대지 보고서 작성 중... (${currentPageNum}/${totalPages})`);
        if (currentPageNum > 1) {
          pdf.addPage();
        }

        coverEl.classList.add('capturing-for-pdf');
        const coverCanvas = await html2canvas(coverEl, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: coverEl.offsetWidth,
          height: coverEl.offsetHeight,
        });
        coverEl.classList.remove('capturing-for-pdf');

        const coverData = coverCanvas.toDataURL('image/jpeg', 0.98);
        const coverProps = pdf.getImageProperties(coverData);
        renderW = maxWidth;
        renderH = (coverProps.height * renderW) / coverProps.width;
        if (renderH > maxHeight) {
          renderH = maxHeight;
          renderW = (coverProps.width * renderH) / coverProps.height;
        }
        leftM = (pdfWidth - renderW) / 2;
        topM = (pdfHeight - renderH) / 2;
        pdf.addImage(coverData, 'JPEG', leftM, topM, renderW, renderH);
        currentPageNum++;
      }

      // 6. 세대별 보급지원확인서 캡처
      for (let i = 0; i < paperElements.length; i++) {
        if (isCancelledRef.current) return;
        const paperEl = paperElements[i];
        setPdfProgressText(`세대 확인서 저장 중... (${currentPageNum}/${totalPages})`);
        pdf.addPage();

        paperEl.classList.add('capturing-for-pdf');
        const canvas = await html2canvas(paperEl, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: paperEl.offsetWidth,
          height: paperEl.offsetHeight,
        });
        paperEl.classList.remove('capturing-for-pdf');

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const imgProps = pdf.getImageProperties(imgData);
        renderW = maxWidth;
        renderH = (imgProps.height * renderW) / imgProps.width;
        if (renderH > maxHeight) {
          renderH = maxHeight;
          renderW = (imgProps.width * renderH) / imgProps.height;
        }
        leftM = (pdfWidth - renderW) / 2;
        topM = (pdfHeight - renderH) / 2;
        pdf.addImage(imgData, 'JPEG', leftM, topM, renderW, renderH);
        currentPageNum++;
      }

      // 7. DataURL 복원
      originalSources.forEach((origSrc, img) => {
        img.src = origSrc;
      });

      if (isCancelledRef.current) return;

      // 8. PDF 다운로드 완료
      const safeLabel = regionLabel ? regionLabel.replace(/\s+/g, '_') : '지역';
      const fileName = `${safeLabel}_단독경보형감지기_보급완료_일괄보고서.pdf`;
      pdf.save(fileName);
      enqueueSnackbar('PDF가 성공적으로 다운로드되었습니다.', { variant: 'success' });
    } catch (err: any) {
      if (isCancelledRef.current) return;
      console.error('Batch PDF 다운로드 실패:', err);
      enqueueSnackbar(err?.message || 'PDF 생성 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsPdfGenerating(false);
      setIsBatchCapturing(false);
      setPdfProgressText('');
    }
  };

  if (!isOpen) return null;

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={handleSafeClose}
      title={`${regionLabel} 일괄 출력`}
      className="regional-batch-modal confirmation-dialog"
      footer={
        <div className="batch-dialog-footer-actions confirmation-modal-footer-actions">
          {activeTab === 'filter' ? (
            <>
              <button
                type="button"
                className="btn-flex-secondary btn-close-action"
                onClick={handleSafeClose}
              >
                <span>닫기</span>
              </button>
              <button
                type="button"
                className="btn-flex-primary btn-status-action"
                onClick={() => setActiveTab('preview')}
                disabled={exportReports.length === 0}
              >
                <span>출력 미리보기</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-flex-secondary btn-edit-trigger"
                onClick={() => setActiveTab('filter')}
                disabled={isPdfGenerating}
              >
                <span>필터 및 목록으로 돌아가기</span>
              </button>
              <button
                type="button"
                className="btn-flex-primary btn-print-action"
                onClick={handleDownloadPdf}
                disabled={exportReports.length === 0 || isPdfGenerating}
              >
                {isPdfGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin mask-spinner" />
                    <span>{pdfProgressText || 'PDF 생성 중...'}</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>PDF 다운로드</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="regional-batch-dialog">
        {/* ── TOP HEADER CARD ── */}
        <div className="batch-dialog-header-card">
          <div className="header-stats">
            <div className="stat-pill">
              <span className="stat-label">확인완료 보고서</span>
              <span className="stat-val">{completedReportsInRegion.length}건</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">출력 대상 세대</span>
              <span className="stat-val">{exportReports.length}세대</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">총 감지기 수량</span>
              <span className="stat-val">{totalDetectorCount}개</span>
            </div>
          </div>
        </div>

        {/* ── TABS BAR (SiteDetailDialog / AccountDetailDialog 와 100% 동일한 탭 디자인, 아이콘 없음) ── */}
        <div className="site-detail-tabs-bar batch-tabs-bar">
          <button
            type="button"
            className={`detail-tab-btn ${activeTab === 'filter' ? 'active' : ''}`}
            onClick={() => setActiveTab('filter')}
            disabled={isPdfGenerating}
          >
            <span>대상현장 목록</span>
          </button>
          <button
            type="button"
            className={`detail-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
            disabled={isPdfGenerating}
          >
            <span>제출용 (출력)</span>
          </button>
        </div>

        {/* ── TAB 1: FILTER & MANAGEMENT ── */}
        {activeTab === 'filter' && (
          <div className="batch-filter-content">
            {/* Filter Section: 줄바꿈 없이 깔끔한 2열 플렉스 레이아웃 */}
            <div className="batch-controls-unified-bar">
              <div className="control-date-inline">
                <div className="date-presets-wrap">
                  <button
                    type="button"
                    className={`btn-preset ${datePreset === 'all' ? 'active' : ''}`}
                    onClick={() => handleDatePreset('all')}
                  >
                    전체
                  </button>
                  <button
                    type="button"
                    className={`btn-preset ${datePreset === 'month' ? 'active' : ''}`}
                    onClick={() => handleDatePreset('month')}
                  >
                    1개월
                  </button>
                  <button
                    type="button"
                    className={`btn-preset ${datePreset === 'custom' ? 'active' : ''}`}
                    onClick={() => handleDatePreset('custom')}
                  >
                    기간선택
                  </button>
                </div>
                <div className="date-range-pickers">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => {
                      setStartDate(e.target.value);
                      setDatePreset('custom');
                    }}
                    placeholder="시작일"
                    aria-label="시작일"
                  />
                  <span className="date-sep">~</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => {
                      setEndDate(e.target.value);
                      setDatePreset('custom');
                    }}
                    placeholder="종료일"
                    aria-label="종료일"
                  />
                </div>
              </div>
            </div>

            {/* Reports Table List */}
            <div className="batch-reports-table-container">
              {filteredReports.length > 0 ? (
                <table className="batch-table">
                  <thead>
                    <tr>
                      <th className="col-num">순번</th>
                      <th>현장(아파트명)</th>
                      <th>동 / 호수</th>
                      <th>세대주</th>
                      <th>보급 대상 구분</th>
                      <th>설치 일자</th>
                      <th>작업자</th>
                      <th style={{ textAlign: 'center' }}>감지기 수량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((rep, idx) => {
                      const hh = getHouseholdInfo(rep);
                      const targetType = (rep.targetType || hh?.targetType || 'GENERAL') as HouseholdTargetType;
                      const targetLabel = TARGET_TYPE_LABEL_MAP[targetType] || targetType;

                      return (
                        <tr key={rep.reportId || idx}>
                          <td className="col-num">
                            <span className="row-index">{idx + 1}</span>
                          </td>
                          <td><strong>{rep.siteName}</strong></td>
                          <td>{rep.dong}동 {rep.ho}호</td>
                          <td>{rep.headName}</td>
                          <td>
                            <span className={`type-tag ${
                              targetType === 'ELDERLY' ? 'elder' : 
                              targetType === 'CHILD' ? 'child' : 
                              targetType === 'DISABLED' ? 'disabled' : ''
                            }`}>
                              {targetLabel}
                            </span>
                          </td>
                          <td>{rep.installDate || rep.installDateFormatted || '—'}</td>
                          <td>{rep.reporterName}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--slate-800)' }}>
                            2개
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="empty-table-state">
                  <p>선택된 필터 조건에 부합하는 확인완료 보고서가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: OFFICIAL A4 PDF PREVIEW & PRINT ── */}
        {activeTab === 'preview' && (
          <div className="batch-preview-content">
            {/* PDF 생성 중 전체 블러 가림막 */}
            {isPdfGenerating && (
              <div className="document-pdf-mask-overlay">
                <div className="pdf-mask-indicator">
                  <Loader2 size={24} className="animate-spin mask-spinner" />
                  <span>{pdfProgressText || 'PDF 문서 생성 중...'}</span>
                </div>
              </div>
            )}

            {/* Scrollable Viewport with A4 Papers */}
            <div id="printable-regional-batch-bundle" className="preview-scroll-viewport">
              {/* ───────────────────────────────────────────────────────────── */}
              {/* PAGE 1 ~ M: 단독경보형감지기 보급완료 보고서 대지 (자동 페이지 분할) */}
              {/* ───────────────────────────────────────────────────────────── */}
              <CompletionReportCoverPaper
                id="printable-cover-sheet"
                regionLabel={regionLabel}
                reports={exportReports}
                sites={sites}
              />

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 세대별 확인서 프리뷰 헤더 안내 뱃지 */}
              {/* ───────────────────────────────────────────────────────────── */}
              {exportReports.length > 0 && !isBatchCapturing && (
                <div className="preview-confirmation-header-bar">
                  <div className="preview-confirmation-title">
                    <span>세대별 보급지원확인서 미리보기</span>
                    <span className="current-sub">(1번째 세대)</span>
                  </div>
                  {exportReports.length > 1 && (
                    <span className="preview-more-count-badge">외 {exportReports.length - 1}개 세대</span>
                  )}
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* PAGE M+1 ~ M+N: 세대별 단독경보형감지기 보급지원확인서 */}
              {/* 프리뷰 최적화를 위해 1개만 렌더링, PDF 다운로드 시 전체 일괄 렌더링 */}
              {/* ───────────────────────────────────────────────────────────── */}
              {exportReports.map((rep, idx) => {
                if (!isBatchCapturing && idx > 0) return null;
                return (
                  <ConfirmationDocumentPaper
                    key={rep.reportId || idx}
                    report={rep}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SlideDialog>
  );
}
