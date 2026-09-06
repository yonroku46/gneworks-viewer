'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dayjs from 'dayjs';
import SlideDialog from './SlideDialog';
import SignatureDialog from './SignatureDialog';
import ImageCropDialog from './ImageCropDialog';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/providers/AuthProvider';
import PortalService from '@/api/service/PortalService';
import { Plus, X, Check, AlertCircle, Building2 } from 'lucide-react';
import './WorkReportDialog.scss';

interface WorkReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  site?: Site;
  household?: Household;
  existingReport?: WorkReport;
  onSubmitted?: () => void;
}

const REPORT_PHOTO_SLOTS: { key: PhotoSlotKey; title: string }[] = [
  { key: 'photoDoor', title: '신주소 보이는 대문 등' },
  { key: 'photoBefore1', title: '단독경보형감지기 보급 전 ①' },
  { key: 'photoAfter1', title: '단독경보형감지기 보급 후 ①' },
  { key: 'photoBefore2', title: '단독경보형감지기 보급 전 ②' },
  { key: 'photoAfter2', title: '단독경보형감지기 보급 후 ②' },
];

export default function WorkReportDialog({
  isOpen,
  onClose,
  site,
  household,
  existingReport,
  onSubmitted,
}: WorkReportDialogProps) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // 대상 정보 조립 (site + household 또는 existingReport 기준)
  const target = useMemo(() => {
    if (!site && !household && !existingReport) return null;
    return {
      siteId: site?.siteId || existingReport?.siteId || '',
      siteName: site?.name || existingReport?.siteName || '',
      sido: site?.sido || existingReport?.sido || '',
      sigungu: site?.sigungu || existingReport?.sigungu || '',
      eupmyeondong: site?.eupmyeondong || existingReport?.eupmyeondong || '',
      address: site?.address || existingReport?.address || '',
      dong: household?.dong || existingReport?.dong || '',
      ho: household?.ho || existingReport?.ho || '',
      headName: household?.headName || existingReport?.headName || '',
      householdId: household?.householdId || existingReport?.householdId || '',
      existingReport: existingReport || undefined,
    };
  }, [site, household, existingReport]);

  // 본인 작성 여부 확인
  const isMyReport = useMemo(() => {
    if (!existingReport) return true;
    const authorId = existingReport.installerId || (existingReport as any).userId;
    return !authorId || authorId === user?.userId;
  }, [existingReport, user?.userId]);

  // 확인 완료 상태이거나 다른 작업자가 작성한 보고서인 경우 수정 불가 (읽기 전용)
  const isReadOnly = existingReport?.status === 'COMPLETED' || !isMyReport;

  const [installDate, setInstallDate] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [confirmerName, setConfirmerName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photos, setPhotos] = useState<{ [key in PhotoSlotKey]?: string }>({});
  const [confirmerSignature, setConfirmerSignature] = useState<string>('');

  // 서명 모달 상태
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // 이미지 크롭 모달 상태 (4:3 비율 및 WebP 압축)
  const [cropTarget, setCropTarget] = useState<{ key: PhotoSlotKey; rawSrc: string; title: string }>();

  // 3-Step 마법사 진행 상태 (1: 세대·일자 확인, 2: 시공 사진 등록, 3: 서명 및 최종 제출)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 다이얼로그 열릴 때의 원본 스냅샷 (실제 변경 사항이 있을 때만 닫기 확인 모달 띄우기 위함)
  const initialSnapshotRef = useRef<{
    installDate: string;
    reporterName: string;
    confirmerName: string;
    remarks: string;
    confirmerSignature: string;
    photos: { [key in PhotoSlotKey]?: string };
  } | undefined>(undefined);

  useEffect(() => {
    if (target && isOpen) {
      setStep(1); // 열릴 때 항상 1단계부터 시작
      const todayStr = dayjs().format('YYYY-MM-DD');
      
      const initInstallDate = target.existingReport?.installDate || todayStr;
      const initReporterName = target.existingReport?.reporterName || user?.userName || '현장 작업자';
      const initConfirmerName = target.existingReport?.confirmerName || target.headName;
      const initRemarks = target.existingReport?.remarks || '';
      const initSignature = target.existingReport?.confirmerSignature || '';

      // 사진 초기화
      const photoMap: { [key in PhotoSlotKey]?: string } = {};
      if (target.existingReport) {
        const rep = target.existingReport;
        if (rep.photoDoor) photoMap.photoDoor = rep.photoDoor;
        if (rep.photoBefore1) photoMap.photoBefore1 = rep.photoBefore1;
        if (rep.photoAfter1) photoMap.photoAfter1 = rep.photoAfter1;
        if (rep.photoBefore2) photoMap.photoBefore2 = rep.photoBefore2;
        if (rep.photoAfter2) photoMap.photoAfter2 = rep.photoAfter2;
      }

      setInstallDate(initInstallDate);
      setReporterName(initReporterName);
      setConfirmerName(initConfirmerName);
      setRemarks(initRemarks);
      setConfirmerSignature(initSignature);
      setPhotos(photoMap);

      // 열릴 때의 원본 데이터 스냅샷 저장
      initialSnapshotRef.current = {
        installDate: initInstallDate,
        reporterName: initReporterName,
        confirmerName: initConfirmerName,
        remarks: initRemarks,
        confirmerSignature: initSignature,
        photos: { ...photoMap },
      };
    }
  }, [target, isOpen, user]);

  if (!target) return null;

  // 1단계 -> 2단계 이동
  const handleGoToStep2 = () => {
    if (!installDate) {
      enqueueSnackbar('설치 일자를 입력해 주세요.', { variant: 'warning' });
      return;
    }
    setStep(2);
  };

  // 2단계 -> 3단계 이동 (5장 고정 필수 검증)
  const handleGoToStep3 = () => {
    const missingSlots = REPORT_PHOTO_SLOTS.filter(s => !photos[s.key]);
    if (missingSlots.length > 0) {
      enqueueSnackbar(`필수 현장 사진 5장을 모두 등록해 주세요. (${missingSlots.length}장 미등록)`, { variant: 'warning' });
      return;
    }
    setStep(3);
  };

  // 사진 업로드 핸들러 (선택 즉시 4:3 크롭 & WebP 압축 모달 오픈)
  const handlePhotoUpload = (key: PhotoSlotKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const slotInfo = REPORT_PHOTO_SLOTS.find(s => s.key === key);
      const reader = new FileReader();
      reader.onload = () => {
        setCropTarget({
          key,
          rawSrc: reader.result as string,
          title: slotInfo ? `${slotInfo.title} 편집` : '사진 자르기 (4:3)',
        });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  // 등록된 사진 재편집 (크롭/위치 조정)
  const handleReCrop = (key: PhotoSlotKey) => {
    if (photos[key]) {
      const slotInfo = REPORT_PHOTO_SLOTS.find(s => s.key === key);
      setCropTarget({
        key,
        rawSrc: photos[key]!,
        title: slotInfo ? `${slotInfo.title} 편집` : '사진 자르기 (4:3)',
      });
    }
  };

  // 사진 삭제 핸들러
  const handleRemovePhoto = (key: PhotoSlotKey) => {
    setPhotos(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // 닫기 전 변경사항 보호 (실제 수정 내역이 발생했을 때만 확인 모달 오픈)
  const handleSafeClose = () => {
    if (isReadOnly) {
      onClose();
      return;
    }

    const init = initialSnapshotRef.current;
    if (!init) {
      onClose();
      return;
    }

    // 1) 사진 변경 여부 비교
    const photoKeys: PhotoSlotKey[] = ['photoDoor', 'photoBefore1', 'photoAfter1', 'photoBefore2', 'photoAfter2'];
    const isPhotosChanged = photoKeys.some(k => (photos[k] || '') !== (init.photos[k] || ''));

    // 2) 텍스트 및 서명 변경 여부 비교
    const isTextChanged =
      installDate !== init.installDate ||
      reporterName !== init.reporterName ||
      confirmerName !== init.confirmerName ||
      remarks !== init.remarks ||
      confirmerSignature !== init.confirmerSignature;

    const isDirty = isPhotosChanged || isTextChanged;

    if (isDirty) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말 닫으시겠습니까?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // 보고서 제출
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly || isSubmitting) return;

    const missingSlots = REPORT_PHOTO_SLOTS.filter(slot => !photos[slot.key]);
    if (missingSlots.length > 0) {
      enqueueSnackbar(`필수 현장 사진 5장을 모두 등록해 주세요. (${missingSlots.length}장 누락)`, { variant: 'warning' });
      return;
    }

    if (!confirmerName.trim()) {
      enqueueSnackbar('확인자 성명을 입력해 주세요.', { variant: 'warning' });
      return;
    }

    if (!confirmerSignature) {
      enqueueSnackbar('확인자 서명을 받아주세요.', { variant: 'warning' });
      return;
    }

    if (!user?.userId) {
      enqueueSnackbar('작업자 로그인 정보가 확인되지 않습니다.', { variant: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);
      await PortalService.submitReport({
        householdId: target.householdId,
        siteId: target.siteId,
        dong: target.dong,
        ho: target.ho,
        headName: target.headName,
        installDate,
        reporterName,
        confirmerName: confirmerName.trim() || target.headName,
        confirmerSignature,
        photoDoor: photos.photoDoor || '',
        photoBefore1: photos.photoBefore1 || '',
        photoAfter1: photos.photoAfter1 || '',
        photoBefore2: photos.photoBefore2 || '',
        photoAfter2: photos.photoAfter2 || '',
        remarks,
      });

      enqueueSnackbar(`[${target.dong}동 ${target.ho}호] 작업 보고서가 성공적으로 등록되었습니다.`, {
        variant: 'success',
      });

      if (onSubmitted) {
        onSubmitted();
      }
      onClose();
    } catch (err: any) {
      console.error('[WorkReportDialog] submitReport error:', err);
      enqueueSnackbar(err?.message || '작업 보고서 제출 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <SlideDialog
        isOpen={isOpen}
        onClose={handleSafeClose}
        disableBackdropClick={!isReadOnly}
        title={isReadOnly ? "작업 보고서" : "작업 보고서 작성"}
        className="work-report-slide-dialog"
        subHeader={
          isReadOnly ? (
            <div className="target-summary-bar">
              <div className="summary-header">
                <span className="site-badge">{target.siteName}</span>
                <span className="unit-badge">
                  {target.dong}동 {target.ho}호
                </span>
                <span className="head-badge">{target.headName} 세대</span>
              </div>
            </div>
          ) : (
            <div className="wizard-sub-header">
              <div className="wizard-header-line">
                <div className="wizard-target-info">
                  {step === 1 ? (
                    <>
                      <span className="target-site-badge guide">STEP 1</span>
                      <span className="target-guide-text">작업 장소 및 설치 일자 확인</span>
                    </>
                  ) : step === 2 ? (
                    <>
                      <span className="target-site-badge guide">STEP 2</span>
                      <span className="target-unit-text">
                        {target.dong}동 {target.ho}호 사진 등록
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="target-site-badge guide">STEP 3</span>
                      <span className="target-unit-text">
                        {target.dong}동 {target.ho}호 서명 및 완료
                      </span>
                    </>
                  )}
                </div>
                <div className="wizard-step-dots" role="status" aria-label={`3단계 중 ${step}단계 진행 중`}>
                  <span
                    className={`step-dot ${step >= 1 ? 'active' : ''}`}
                    onClick={() => setStep(1)}
                    role="button"
                    tabIndex={0}
                    title="1단계: 세대·일자 확인"
                  />
                  <span
                    className={`step-dot ${step >= 2 ? 'active' : ''}`}
                    onClick={() => {
                      if (installDate) setStep(2);
                    }}
                    role="button"
                    tabIndex={0}
                    title="2단계: 현장 사진"
                  />
                  <span
                    className={`step-dot ${step >= 3 ? 'active' : ''}`}
                    onClick={() => {
                      if (Object.keys(photos).length > 0) setStep(3);
                    }}
                    role="button"
                    tabIndex={0}
                    title="3단계: 확인자 서명 및 완료"
                  />
                </div>
              </div>
            </div>
          )
        }
        footer={
          isReadOnly ? (
            <>
              <div className="readonly-notice-banner footer-banner">
                <Check size={13} />
                <span>관리자 확인이 완료되어 수정이 불가합니다.</span>
              </div>
              <div className="work-report-dialog-footer">
                <button
                  type="button"
                  className="btn-cancel btn-close-only"
                  onClick={handleSafeClose}
                >
                  닫기
                </button>
              </div>
            </>
          ) : (
            <>
              {target?.existingReport?.status === 'REJECTED' && (
                <div className="readonly-notice-banner footer-banner revise">
                  <AlertCircle size={13} />
                  <span>반려 사유: {target.existingReport.fixReason || '기재된 사유가 없습니다.'}</span>
                </div>
              )}
              <div className="work-report-dialog-footer">
                <div className="wizard-footer-actions">
                {step === 1 && (
                  <>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleSafeClose}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="btn-wizard-next"
                      onClick={handleGoToStep2}
                    >
                      <span>다음: 사진 등록 (1/3)</span>
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <button
                      type="button"
                      className="btn-wizard-prev"
                      onClick={() => setStep(1)}
                    >
                      <span>이전</span>
                    </button>
                    <button
                      type="button"
                      className="btn-wizard-next"
                      onClick={handleGoToStep3}
                    >
                      <span>다음: 서명 및 완료 (2/3)</span>
                    </button>
                  </>
                )}

                {step === 3 && (
                  <>
                    <button
                      type="button"
                      className="btn-wizard-prev"
                      onClick={() => setStep(2)}
                    >
                      <span>이전</span>
                    </button>
                    <button
                      type="button"
                      className="btn-submit"
                      disabled={isSubmitting}
                      onClick={() => handleSubmit()}
                    >
                      <span>{isSubmitting ? '제출 중...' : '보고서 제출'}</span>
                    </button>

                  </>
                )}
              </div>
            </div>
            </>
          )
        }
      >
        <form className="work-report-form" onSubmit={handleSubmit}>

          {/* ══════════════════════════════════════════════════
              [모드 A] 읽기 전용 뷰 (isReadOnly === true)
              전체 폼을 한 번에 스크롤하며 확인하는 요약 뷰
          ══════════════════════════════════════════════════ */}
          {isReadOnly ? (
            <div className="readonly-report-wrapper">
              {/* 기본 정보 통합 카드 (관리자 보고서 다이얼로그와 통일) */}
              <div className="step-location-card">
                <div className="report-target-summary">
                  <div className="target-title-line">
                    <Building2 size={16} />
                    <h3>{target.siteName} {target.dong}동 {target.ho}호</h3>
                    {target.headName && (
                      <span className="head-badge">{target.headName} 세대주</span>
                    )}
                  </div>
                  {target.address && (
                    <p className="target-address">
                      {target.address && target.siteName && !target.address.includes(target.siteName)
                        ? `${target.address} (${target.siteName})`
                        : target.address}
                    </p>
                  )}
                </div>

                <div className="report-quick-meta-grid">
                  <div className="meta-cell">
                    <span className="label">설치 일자</span>
                    <span className="val">{installDate || '-'}</span>
                  </div>
                  <div className="meta-cell">
                    <span className="label">작업자</span>
                    <span className="val">{reporterName || '-'}</span>
                  </div>
                </div>
              </div>

              {/* 2. 현장 사진 (5종) */}
              <div className="form-group">
                <div className="photos-header-row">
                  <label className="form-label">
                    <span>현장 사진 (총 5개)</span>
                  </label>
                  <span className="photos-count-badge">
                    {Object.keys(photos).length} / 5개 등록
                  </span>
                </div>

                <div className="photos-clean-layout">
                  <div className="door-single-section">
                    <div className="photo-upload-box">
                      <span className="photo-label">1. 신주소 대문</span>
                      {photos.photoDoor ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos.photoDoor} alt="신주소 대문" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                  </div>

                  <div className="sensor-pairs-grid">
                    <div className="photo-upload-box">
                      <span className="photo-label">2. 보급 전 ①</span>
                      {photos.photoBefore1 ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos.photoBefore1} alt="보급 전 ①" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                    <div className="photo-upload-box">
                      <span className="photo-label">3. 보급 후 ①</span>
                      {photos.photoAfter1 ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos.photoAfter1} alt="보급 후 ①" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                    <div className="photo-upload-box">
                      <span className="photo-label">4. 보급 전 ②</span>
                      {photos.photoBefore2 ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos.photoBefore2} alt="보급 전 ②" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                    <div className="photo-upload-box">
                      <span className="photo-label">5. 보급 후 ②</span>
                      {photos.photoAfter2 ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos.photoAfter2} alt="보급 후 ②" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 서명 섹션 */}
              <div className="form-group signature-section">
                <div className="signature-header-row">
                  <label className="form-label">
                    <span>확인자 서명</span>
                  </label>
                  <span className="signature-badge completed">서명 완료</span>
                </div>
                <div className="confirmer-name-field">
                  <input
                    type="text"
                    className="form-input confirmer-name-input"
                    value={confirmerName}
                    disabled
                  />
                </div>
                {confirmerSignature ? (
                  <div className="signature-display-box readonly">
                    <div className="signature-canvas-view">
                      <img src={confirmerSignature} alt="확인자 서명" className="signature-result-img" />
                    </div>
                  </div>
                ) : (
                  <div className="signature-touch-pad readonly">
                    <div className="pad-empty-state">
                      <span className="pad-sub-prompt">등록된 서명이 없습니다</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. 비고 */}
              <div className="form-group">
                <label className="form-label">
                  <span>특이사항 및 비고</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={remarks}
                  disabled
                />
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════
                [모드 B] 작업 작성 모드 (3-Step Wizard 진행형)
            ══════════════════════════════════════════════════ */
            <div className="wizard-panels-container">
              {/* ── STEP 1: 세대 및 설치 일자 확인 ── */}
              {step === 1 && (
                <div className="wizard-step-panel step-1-panel">
                  {/* 단일 통합 정보 및 입력 카드 */}
                  <div className="step-fields-card integrated-card">
                    {/* 상단: 작업 대상 세대 정보 (관리자 화면과 완벽 통일) */}
                    <div className="card-location-header report-target-summary">
                      <div className="target-title-line">
                        <Building2 size={16} />
                        <h3>{target.siteName} {target.dong}동 {target.ho}호</h3>
                        {target.headName && (
                          <span className="head-badge">{target.headName} 세대주</span>
                        )}
                      </div>
                      {target.address && (
                        <p className="target-address">
                          {target.address && target.siteName && !target.address.includes(target.siteName)
                            ? `${target.address} (${target.siteName})`
                            : target.address}
                        </p>
                      )}
                    </div>

                    {/* 하단: 설치 일자 & 작업자 입력 */}
                    <div className="card-fields-body">
                      <div className="form-group">
                        <label className="form-label">
                          <span>설치 일자</span>
                          <span className="required-tag">(필수)</span>
                        </label>
                        <input
                          type="date"
                          className="form-input"
                          value={installDate}
                          onChange={e => setInstallDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <span>작업자 (보고자)</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={reporterName}
                          readOnly
                          tabIndex={-1}
                          title="로그인된 작업자 본인 계정으로 자동 고정됩니다."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: 현장 사진 등록 ── */}
              {step === 2 && (
                <div className="wizard-step-panel step-2-panel">
                  <div className="step-section-header">
                    <h4 className="section-title">현장 사진 (총 5개)</h4>
                    <span className={`photos-count-pill ${Object.keys(photos).length === 5 ? 'completed' : 'pending'}`}>
                      {Object.keys(photos).length === 5 ? '✓ 5개 완료' : `${Object.keys(photos).length} / 5개 등록`}
                    </span>
                  </div>

                  <div className="form-group photos-form-group">
                    <div className="photos-clean-layout">
                    {/* 1. 신주소 대문 */}
                    <div className="door-single-section">
                      <div className="photo-upload-box">
                        <span className="photo-label">1. 신주소 대문</span>
                        {photos.photoDoor ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('photoDoor')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos.photoDoor} alt="신주소 보이는 대문 등" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('photoDoor');
                              }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <label className="photo-placeholder-btn">
                            <Plus size={20} className="plus-icon" />
                            <span className="placeholder-text">대문 사진 촬영/등록</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => handlePhotoUpload('photoDoor', e)}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* 2 & 3. 감지기 1차/2차 전후 4장 그리드 */}
                    <div className="sensor-pairs-grid">
                      {/* 보급 전 ① */}
                      <div className="photo-upload-box">
                        <span className="photo-label">2. 보급 전 ①</span>
                        {photos.photoBefore1 ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('photoBefore1')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos.photoBefore1} alt="보급 전 ①" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('photoBefore1');
                              }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <label className="photo-placeholder-btn">
                            <Plus size={20} className="plus-icon" />
                            <span className="placeholder-text">사진 등록</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => handlePhotoUpload('photoBefore1', e)}
                            />
                          </label>
                        )}
                      </div>

                      {/* 보급 후 ① */}
                      <div className="photo-upload-box">
                        <span className="photo-label">3. 보급 후 ①</span>
                        {photos.photoAfter1 ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('photoAfter1')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos.photoAfter1} alt="보급 후 ①" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('photoAfter1');
                              }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <label className="photo-placeholder-btn">
                            <Plus size={20} className="plus-icon" />
                            <span className="placeholder-text">사진 등록</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => handlePhotoUpload('photoAfter1', e)}
                            />
                          </label>
                        )}
                      </div>

                      {/* 보급 전 ② */}
                      <div className="photo-upload-box">
                        <span className="photo-label">4. 보급 전 ②</span>
                        {photos.photoBefore2 ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('photoBefore2')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos.photoBefore2} alt="보급 전 ②" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('photoBefore2');
                              }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <label className="photo-placeholder-btn">
                            <Plus size={20} className="plus-icon" />
                            <span className="placeholder-text">사진 등록</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => handlePhotoUpload('photoBefore2', e)}
                            />
                          </label>
                        )}
                      </div>

                      {/* 보급 후 ② */}
                      <div className="photo-upload-box">
                        <span className="photo-label">5. 보급 후 ②</span>
                        {photos.photoAfter2 ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('photoAfter2')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos.photoAfter2} alt="보급 후 ②" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('photoAfter2');
                              }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <label className="photo-placeholder-btn">
                            <Plus size={20} className="plus-icon" />
                            <span className="placeholder-text">사진 등록</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => handlePhotoUpload('photoAfter2', e)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

              {/* ── STEP 3: 서명 및 최종 제출 ── */}
              {step === 3 && (
                <div className="wizard-step-panel step-3-panel">
                  {/* 확인자 서명 섹션 */}
                  <div className="form-group signature-section">
                    <div className="signature-header-row">
                      <label className="form-label">
                        <span>확인자 서명</span>
                        <span className="required-tag">(필수)</span>
                      </label>
                      {confirmerSignature ? (
                        <span className="signature-badge completed">서명 등록됨</span>
                      ) : (
                        <span className="signature-badge pending">서명 필요</span>
                      )}
                    </div>

                    {/* 확인자 성명 입력 */}
                    <div className="confirmer-name-field">
                      <div className="input-clear-wrapper">
                        <input
                          type="text"
                          className="form-input confirmer-name-input"
                          placeholder="확인자 성명 입력 (예: 홍길동)"
                          value={confirmerName}
                          onChange={e => setConfirmerName(e.target.value)}
                          required
                        />
                        {confirmerName && (
                          <button
                            type="button"
                            className="btn-clear-input"
                            title="이름 지우기"
                            onClick={() => setConfirmerName('')}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 큼직한 서명 터치 패드 */}
                    {confirmerSignature ? (
                      <div
                        className="signature-display-box"
                        onClick={() => setIsSignatureModalOpen(true)}
                      >
                        <div className="signature-canvas-view">
                          <img src={confirmerSignature} alt="확인자 서명" className="signature-result-img" />
                        </div>
                        <div className="signature-overlay-actions" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            className="btn-action-pill edit"
                            onClick={() => setIsSignatureModalOpen(true)}
                          >
                            서명 다시하기
                          </button>
                          <button
                            type="button"
                            className="btn-action-pill delete"
                            onClick={() => setConfirmerSignature('')}
                          >
                            지우기
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="signature-touch-pad"
                        role="button"
                        tabIndex={0}
                        onClick={() => setIsSignatureModalOpen(true)}
                      >
                        <div className="pad-empty-state">
                          <span className="pad-main-prompt">이곳을 터치하여 서명받기</span>
                          <span className="pad-sub-prompt">고객 서명을 화면에 입력받습니다</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 특이사항 및 비고 */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>특이사항 및 비고 (선택)</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="현장 특이사항이나 전달사항이 있으면 입력해 주세요."
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </SlideDialog>

      {/* ── SAFE FULL-SCREEN SIGNATURE DIALOG ── */}
      <SignatureDialog
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={(sigData) => {
          setConfirmerSignature(sigData);
          enqueueSnackbar(`${confirmerName || target.headName} 확인자 서명이 등록되었습니다.`, { variant: 'success' });
        }}
        userName={confirmerName || target.headName}
        title={`${confirmerName || target.headName} 확인자 서명`}
        disableBackdropClick={true}
      />

      {/* ── IMAGE CROP DIALOG (4:3 WebP Compression) ── */}
      {cropTarget && (
        <ImageCropDialog
          isOpen={!!cropTarget}
          imageSrc={cropTarget.rawSrc}
          title={cropTarget.title}
          aspect={4 / 3}
          onClose={() => setCropTarget(undefined)}
          onCropComplete={(croppedWebPUrl) => {
            setPhotos(prev => ({ ...prev, [cropTarget.key]: croppedWebPUrl }));
            setCropTarget(undefined);
            enqueueSnackbar('4:3 비율로 사진이 최적화되었습니다.', { variant: 'success' });
          }}
          disableBackdropClick={true}
        />
      )}
    </>
  );
}
