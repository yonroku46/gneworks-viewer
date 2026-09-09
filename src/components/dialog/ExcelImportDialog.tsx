'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import SlideDialog from './SlideDialog';
import AdminService from '@/api/service/AdminService';
import './ExcelImportDialog.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fireRegions: FireRegion[];
  onImported?: () => void;
}

// 파일명에서 소방서명 자동 감지
function detectRegionFromFilename(filename: string): string | null {
  // 괄호 안의 텍스트 추출: "(수원남부)" → "수원남부"
  const match = filename.match(/[(\uff08]([^)\uff09]+)[)\uff09]/);
  if (!match) return null;
  return match[1].trim();
}

type ImportStep = 'select' | 'confirm' | 'loading' | 'result';

export default function ExcelImportDialog({ isOpen, onClose, fireRegions, onImported }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ImportStep>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [autoDetectedName, setAutoDetectedName] = useState<string | null>(null);
  const [result, setResult] = useState<AdminImportResultRes | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLoading = step === 'loading';

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setStep('select');
    setSelectedFile(null);
    setSelectedRegionId('');
    setAutoDetectedName(null);
    setResult(null);
    setError(null);
    onClose();
  }, [isLoading, onClose]);

  // 업로드 도중 브라우저 창 닫기 / 새로고침 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step === 'loading') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const detected = detectRegionFromFilename(file.name);
    setAutoDetectedName(detected);

    // 자동 매칭: 파일명 키워드 → fire_region.name
    let matchedRegionId = '';
    if (detected) {
      const match = fireRegions.find(fr =>
        fr.name === detected ||
        fr.name.replace(/(소방서|센터)$/, '').trim() === detected
      );
      if (match) matchedRegionId = match.regionId;
    }

    setSelectedFile(file);
    setSelectedRegionId(matchedRegionId);
    setStep('confirm');
    e.target.value = '';
  };

  const handleImport = async () => {
    if (!selectedFile || isLoading) return;
    setStep('loading');
    setError(null);
    try {
      const res = await AdminService.importExcel(selectedFile, selectedRegionId || undefined);
      setResult(res);
      setStep('result');
      onImported?.();
    } catch (err: any) {
      setError(err?.message || '임포트 중 오류가 발생했습니다.');
      setStep('confirm');
    }
  };

  const handleReset = () => {
    if (isLoading) return;
    setStep('select');
    setSelectedFile(null);
    setSelectedRegionId('');
    setAutoDetectedName(null);
    setResult(null);
    setError(null);
  };

  if (!isOpen) return null;

  const selectedRegion = fireRegions.find(fr => fr.regionId === selectedRegionId);

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="엑셀데이터 일괄 임포트"
      className="excel-import-slide-dialog manage-page"
      disableBackdropClick={isLoading}
      disableHistoryBack
      hideCloseButton={isLoading}
      rightElement={isLoading ? <span className="eid-loading-badge">처리 중...</span> : null}
    >
      <div className="excel-import-body">
        {/* STEP 1: 파일 선택 */}
        {step === 'select' && (
          <div className="eid-step-select">
            <p className="eid-desc">
              소방서에서 제공한 <strong>보급대상 세대 파악</strong> 엑셀 파일을 업로드하면<br />
              현장 및 세대 데이터가 자동으로 등록됩니다.
            </p>
            <button
              type="button"
              className="eid-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={22} />
              <span>파일 선택</span>
              <small>.xlsx 형식만 지원</small>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* STEP 2: 확인 */}
        {step === 'confirm' && selectedFile && (
          <div className="eid-step-confirm">
            <div className="eid-file-card">
              <FileSpreadsheet size={18} />
              <div className="eid-file-info">
                <span className="eid-file-name">{selectedFile.name}</span>
                <span className="eid-file-size">{(selectedFile.size / 1024).toFixed(0)} KB</span>
              </div>
              <button type="button" className="eid-file-remove" onClick={handleReset} aria-label="파일 삭제">
                <X size={14} />
              </button>
            </div>

            {error && (
              <div className="eid-error-msg">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div className="eid-region-section">
              <label className="eid-region-label">
                소방관할 배정
                {autoDetectedName && (
                  <span className="eid-auto-badge">
                    파일명에서 &quot;{autoDetectedName}&quot; 자동 감지
                  </span>
                )}
              </label>
              <div className="eid-select-wrap">
                <select
                  value={selectedRegionId}
                  onChange={e => setSelectedRegionId(e.target.value)}
                  className="eid-region-select"
                >
                  <option value="">소방관할 미지정 (NULL)</option>
                  {fireRegions.map(fr => (
                    <option key={fr.regionId} value={fr.regionId}>
                      {fr.name}소방서
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} className="eid-select-icon" />
              </div>
              {selectedRegion && (
                <p className="eid-region-hint">
                  ✓ {selectedRegion.name}소방서 관할로 현장이 등록됩니다.
                </p>
              )}
            </div>

            <div className="eid-confirm-actions">
              <button type="button" className="eid-btn-cancel" onClick={handleReset}>
                다시 선택
              </button>
              <button type="button" className="eid-btn-import" onClick={handleImport}>
                <Upload size={15} />
                임포트 실행
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 처리 중 */}
        {step === 'loading' && (
          <div className="eid-step-loading">
            <div className="eid-spinner-wrapper">
              <Loader2 size={44} className="eid-spinner" />
              <FileSpreadsheet size={20} className="eid-spinner-icon" />
            </div>
            <div className="eid-loading-text">
              <p className="eid-loading-title">데이터를 일괄 등록하고 있습니다</p>
              <p className="eid-loading-sub">
                엑셀 행 파싱 및 현장/세대 중복을 실시간 검증 중입니다.
              </p>
            </div>
            <div className="eid-loading-notice">
              <AlertCircle size={14} />
              <span>데이터 정합성을 위해 작업이 끝날 때까지 창을 닫거나 이동하지 마세요.</span>
            </div>
          </div>
        )}

        {/* STEP 4: 결과 */}
        {step === 'result' && result && (
          <div className="eid-step-result">
            <div className="eid-result-icon">
              <CheckCircle2 size={40} />
            </div>
            <p className="eid-result-title">임포트 완료!</p>
            {result.regionName && (
              <p className="eid-result-region">{result.regionName}소방서 관할</p>
            )}
            <div className="eid-result-grid">
              <div className="eid-result-card inserted">
                <span className="eid-result-num">{result.siteInserted}</span>
                <span className="eid-result-lbl">현장 신규 등록</span>
              </div>
              <div className="eid-result-card skipped">
                <span className="eid-result-num">{result.siteSkipped}</span>
                <span className="eid-result-lbl">현장 중복 skip</span>
              </div>
              <div className="eid-result-card inserted">
                <span className="eid-result-num">{result.householdInserted.toLocaleString()}</span>
                <span className="eid-result-lbl">세대 신규 등록</span>
              </div>
              <div className="eid-result-card skipped">
                <span className="eid-result-num">{result.householdSkipped.toLocaleString()}</span>
                <span className="eid-result-lbl">세대 중복 skip</span>
              </div>
            </div>
            <div className="eid-result-actions">
              <button type="button" className="eid-btn-another" onClick={handleReset}>
                다른 파일 임포트
              </button>
              <button type="button" className="eid-btn-done" onClick={handleClose}>
                완료
              </button>
            </div>
          </div>
        )}
      </div>
    </SlideDialog>
  );
}
