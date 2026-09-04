'use client';

import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import SlideDialog from './SlideDialog';
import SignatureDialog from './SignatureDialog';
import ImageCropDialog from './ImageCropDialog';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/providers/AuthProvider';
import { upsertReport } from '@/data/reportStorage';

import { Plus, X, Check, AlertCircle, Building2, MapPin, Calendar, User } from 'lucide-react';
import './WorkReportDialog.scss';

export type { TargetHousehold };

interface WorkReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  target: TargetHousehold | null;
  onSubmitted?: () => void;
}

// ── 사진 5종 슬롯 규격 ──
const REPORT_PHOTO_SLOTS: { type: ReportPhoto['type']; title: string; defaultUrl?: string }[] = [
  { type: 'DOOR', title: '신주소 보이는 대문 등' },
  { type: 'BEFORE1', title: '단독경보형감지기 보급 전 ①' },
  { type: 'AFTER1', title: '단독경보형감지기 보급 후 ①' },
  { type: 'BEFORE2', title: '단독경보형감지기 보급 전 ②' },
  { type: 'AFTER2', title: '단독경보형감지기 보급 후 ②' },
];

export default function WorkReportDialog({
  isOpen,
  onClose,
  target,
  onSubmitted,
}: WorkReportDialogProps) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // 확인 완료 상태인 경우 수정 불가 (읽기 전용)
  const isReadOnly = target?.existingReport?.status === 'COMPLETED';

  const [installDate, setInstallDate] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [confirmerName, setConfirmerName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photos, setPhotos] = useState<{ [key: string]: string }>({});
  const [confirmerSignature, setConfirmerSignature] = useState<string>('');

  // 서명 모달 상태
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // 이미지 크롭 모달 상태 (4:3 비율 및 WebP 압축)
  const [cropTarget, setCropTarget] = useState<{ type: string; rawSrc: string; title: string } | null>(null);

  // 3-Step 마법사 진행 상태 (1: 세대·일자 확인, 2: 시공 사진 등록, 3: 서명 및 최종 제출)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // 다이얼로그 열릴 때의 원본 스냅샷 (실제 변경 사항이 있을 때만 닫기 확인 모달 띄우기 위함)
  const initialSnapshotRef = useRef<{
    installDate: string;
    reporterName: string;
    confirmerName: string;
    remarks: string;
    confirmerSignature: string;
    photos: { [key: string]: string };
  } | null>(null);

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
      const photoMap: { [key: string]: string } = {};
      if (target.existingReport?.photos && target.existingReport.photos.length > 0) {
        target.existingReport.photos.forEach(p => {
          photoMap[p.type] = p.url;
        });
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

  // 2단계 -> 3단계 이동
  const handleGoToStep3 = () => {
    const photoCount = Object.keys(photos).length;
    if (photoCount === 0) {
      enqueueSnackbar('최소 1장 이상의 현장 사진을 등록해 주세요.', { variant: 'warning' });
      return;
    }
    setStep(3);
  };

  // 사진 업로드 핸들러 (선택 즉시 4:3 크롭 & WebP 압축 모달 오픈)
  const handlePhotoUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const slotInfo = REPORT_PHOTO_SLOTS.find(s => s.type === type);
      const reader = new FileReader();
      reader.onload = () => {
        setCropTarget({
          type,
          rawSrc: reader.result as string,
          title: slotInfo ? `${slotInfo.title} 편집` : '사진 자르기 (4:3)',
        });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  // 등록된 사진 재편집 (크롭/위치 조정)
  const handleReCrop = (type: string) => {
    if (photos[type]) {
      const slotInfo = REPORT_PHOTO_SLOTS.find(s => s.type === type);
      setCropTarget({
        type,
        rawSrc: photos[type],
        title: slotInfo ? `${slotInfo.title} 편집` : '사진 자르기 (4:3)',
      });
    }
  };

  // 사진 삭제 핸들러
  const handleRemovePhoto = (type: string) => {
    setPhotos(prev => {
      const next = { ...prev };
      delete next[type];
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
    const currentPhotoKeys = Object.keys(photos);
    const initPhotoKeys = Object.keys(init.photos);
    const isPhotosChanged =
      currentPhotoKeys.length !== initPhotoKeys.length ||
      currentPhotoKeys.some(k => photos[k] !== init.photos[k]);

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
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    const photoList: ReportPhoto[] = REPORT_PHOTO_SLOTS.filter(slot => photos[slot.type]).map(slot => ({
      title: slot.title,
      url: photos[slot.type],
      type: slot.type,
    }));

    if (photoList.length === 0) {
      enqueueSnackbar('최소 1장 이상의 현장 사진을 등록해 주세요.', { variant: 'warning' });
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

    upsertReport({
      siteId: target.siteId,
      siteName: target.siteName,
      sido: target.sido,
      sigungu: target.sigungu,
      eupmyeondong: target.eupmyeondong,
      address: target.address,
      dong: target.dong,
      ho: target.ho,
      headName: target.headName,
      installDate,
      reporterName,
      installerId: user?.userId || 'worker_current',
      visitorName: reporterName,
      confirmerName: confirmerName.trim() || target.headName,
      confirmerSignature,
      photos: photoList,
      remarks,
    });

    enqueueSnackbar(`[${target.dong}동 ${target.ho}호] 작업 보고서가 성공적으로 등록되었습니다.`, {
      variant: 'success',
    });

    if (onSubmitted) {
      onSubmitted();
    }
    onClose();
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
                      onClick={() => handleSubmit()}
                    >
                      <span>보고서 제출</span>
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
                      {photos['door'] ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos['door']} alt="신주소 대문" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                  </div>

                  <div className="sensor-pairs-grid">
                    <div className="photo-upload-box">
                      <span className="photo-label">2. 보급 전 ①</span>
                      {photos['before1'] ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos['before1']} alt="보급 전 ①" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                    <div className="photo-upload-box">
                      <span className="photo-label">3. 보급 후 ①</span>
                      {photos['after1'] ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos['after1']} alt="보급 후 ①" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                    <div className="photo-upload-box">
                      <span className="photo-label">4. 보급 전 ②</span>
                      {photos['before2'] ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos['before2']} alt="보급 전 ②" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                    <div className="photo-upload-box">
                      <span className="photo-label">5. 보급 후 ②</span>
                      {photos['after2'] ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={photos['after2']} alt="보급 후 ②" className="preview-img" />
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
                        {photos['door'] ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('door')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos['door']} alt="신주소 보이는 대문 등" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('door');
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
                              onChange={e => handlePhotoUpload('door', e)}
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
                        {photos['before1'] ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('before1')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos['before1']} alt="보급 전 ①" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('before1');
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
                              onChange={e => handlePhotoUpload('before1', e)}
                            />
                          </label>
                        )}
                      </div>

                      {/* 보급 후 ① */}
                      <div className="photo-upload-box">
                        <span className="photo-label">3. 보급 후 ①</span>
                        {photos['after1'] ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('after1')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos['after1']} alt="보급 후 ①" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('after1');
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
                              onChange={e => handlePhotoUpload('after1', e)}
                            />
                          </label>
                        )}
                      </div>

                      {/* 보급 전 ② */}
                      <div className="photo-upload-box">
                        <span className="photo-label">4. 보급 전 ②</span>
                        {photos['before2'] ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('before2')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos['before2']} alt="보급 전 ②" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('before2');
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
                              onChange={e => handlePhotoUpload('before2', e)}
                            />
                          </label>
                        )}
                      </div>

                      {/* 보급 후 ② */}
                      <div className="photo-upload-box">
                        <span className="photo-label">5. 보급 후 ②</span>
                        {photos['after2'] ? (
                          <div
                            className="photo-preview-wrapper"
                            onClick={() => handleReCrop('after2')}
                            title="클릭하여 사진 자르기/위치 조절"
                          >
                            <img src={photos['after2']} alt="보급 후 ②" className="preview-img" />
                            <button
                              type="button"
                              className="btn-remove-photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto('after2');
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
                              onChange={e => handlePhotoUpload('after2', e)}
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
          onClose={() => setCropTarget(null)}
          onCropComplete={(croppedWebPUrl) => {
            setPhotos(prev => ({ ...prev, [cropTarget.type]: croppedWebPUrl }));
            setCropTarget(null);
            enqueueSnackbar('4:3 비율로 사진이 최적화되었습니다.', { variant: 'success' });
          }}
          disableBackdropClick={true}
        />
      )}
    </>
  );
}
