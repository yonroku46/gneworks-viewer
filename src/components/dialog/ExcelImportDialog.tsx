'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import SlideDialog from './SlideDialog';
import AdminService from '@/api/service/AdminService';
import { useManageRegion } from '@/providers/ManageRegionProvider';
import { getDbSidoList } from '@/common/utils/regionUtils';
import './ExcelImportDialog.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fireRegions: FireRegion[];
  onImported?: () => void;
}

// 파일명에서 소방관할(FireRegion) 자동 감지
function detectRegionFromFilename(filename: string, fireRegions: FireRegion[]): FireRegion | null {
  if (!filename || !fireRegions || fireRegions.length === 0) return null;

  const isAdmin = filename.includes('관리자');

  // 관리자 파일이면 관리자용 관할, 일반 파일이면 일반 관할 우선 검색
  const targetRegions = fireRegions.filter(fr =>
    isAdmin ? fr.name.includes('관리자') : !fr.name.includes('관리자')
  );

  // 긴 지명 우선 정렬 (예: '수원남부'가 '수원'보다 먼저 매칭되도록)
  const sorted = [...(targetRegions.length > 0 ? targetRegions : fireRegions)]
    .sort((a, b) => b.name.length - a.name.length);

  for (const fr of sorted) {
    // 관할 이름에서 '(관리자용)' 등을 제외한 순수 지역명 (예: '수원(관리자용)' → '수원')
    const baseName = fr.name.replace(/\(관리자.*?\)/, '').trim();

    if (filename.includes(fr.name) || filename.includes(baseName)) {
      return fr;
    }
  }

  return null;
}

type ImportStep = 'select' | 'confirm' | 'loading' | 'result';

export default function ExcelImportDialog({ isOpen, onClose, fireRegions, onImported }: Props) {
  const { region: currentManageRegion } = useManageRegion();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ImportStep>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 시·도 및 시·군·구(소방관할) 선택 상태
  const [selectedSido, setSelectedSido] = useState<string>(() => currentManageRegion?.sido || '경기도');
  const [selectedRegionId, setSelectedRegionId] = useState<string>(() => currentManageRegion?.regionId || '');
  const [autoDetectedName, setAutoDetectedName] = useState<string | null>(null);
  const [result, setResult] = useState<AdminImportResultRes | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLoading = step === 'loading';

  // 1. DB 소방관할 기반 시/도 목록
  const sidoList = useMemo(() => {
    const set = new Set<string>();
    fireRegions.forEach(fr => {
      if (fr.sidoName) set.add(fr.sidoName);
    });
    if (set.size > 0) {
      const standardOrder = getDbSidoList();
      return Array.from(set).sort((a, b) => {
        const idxA = standardOrder.indexOf(a);
        const idxB = standardOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b, 'ko');
      });
    }
    return getDbSidoList();
  }, [fireRegions]);

  // 2. 선택된 시/도의 DB 소방관할 목록 (일반 관할 우선, 관리자용은 맨 아래)
  const availableFireRegions = useMemo(() => {
    if (!selectedSido) return [];
    return fireRegions
      .filter(fr => fr.sidoName === selectedSido)
      .sort((a, b) => {
        const aAdmin = (a.name && a.name.includes('관리자')) || (a.regionId && a.regionId.startsWith('ADMIN_'));
        const bAdmin = (b.name && b.name.includes('관리자')) || (b.regionId && b.regionId.startsWith('ADMIN_'));
        if (aAdmin !== bAdmin) return aAdmin ? 1 : -1;
        return (a.regionId || '').localeCompare(b.regionId || '');
      });
  }, [fireRegions, selectedSido]);

  // 3. 선택된 소방관할 FireRegion 객체
  const selectedRegion = useMemo(() => {
    return fireRegions.find(fr => fr.regionId === selectedRegionId);
  }, [fireRegions, selectedRegionId]);

  // 다이얼로그 열릴 때 관리페이지의 현재 지역으로 기본 설정
  useEffect(() => {
    if (isOpen) {
      if (currentManageRegion?.sido) {
        setSelectedSido(currentManageRegion.sido);
      }
      if (currentManageRegion?.regionId) {
        setSelectedRegionId(currentManageRegion.regionId);
      }
    }
  }, [isOpen, currentManageRegion]);

  // 시/도 변경 핸들러
  const handleSidoChange = (newSido: string) => {
    setSelectedSido(newSido);
    const regions = fireRegions
      .filter(fr => fr.sidoName === newSido)
      .sort((a, b) => {
        const aAdmin = (a.name && a.name.includes('관리자')) || (a.regionId && a.regionId.startsWith('ADMIN_'));
        const bAdmin = (b.name && b.name.includes('관리자')) || (b.regionId && b.regionId.startsWith('ADMIN_'));
        if (aAdmin !== bAdmin) return aAdmin ? 1 : -1;
        return (a.regionId || '').localeCompare(b.regionId || '');
      });
    if (regions.length > 0) {
      setSelectedRegionId(regions[0].regionId);
    } else {
      setSelectedRegionId('');
    }
  };

  // 선택된 Sido 내에 현재 selectedRegionId가 없으면 첫 번째 관할소방서로 동기화
  useEffect(() => {
    if (availableFireRegions.length > 0) {
      const exists = availableFireRegions.some(fr => fr.regionId === selectedRegionId);
      if (!exists) {
        setSelectedRegionId(availableFireRegions[0].regionId);
      }
    }
  }, [availableFireRegions, selectedRegionId]);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setStep('select');
    setSelectedFile(null);
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

    // 자동 감지: 파일명 키워드 → FireRegion
    const detectedFr = detectRegionFromFilename(file.name, fireRegions);
    if (detectedFr) {
      setAutoDetectedName(`${detectedFr.sidoName} ${detectedFr.name}`);
      setSelectedSido(detectedFr.sidoName);
      setSelectedRegionId(detectedFr.regionId);
    } else {
      setAutoDetectedName(null);
      if (!selectedRegionId && availableFireRegions.length > 0) {
        setSelectedRegionId(availableFireRegions[0].regionId);
      }
    }

    setSelectedFile(file);
    setStep('confirm');
    e.target.value = '';
  };

  const handleImport = async () => {
    if (!selectedFile || isLoading || !selectedRegionId) return;
    setStep('loading');
    setError(null);
    try {
      const res = await AdminService.importExcel(selectedFile, selectedRegionId);
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
    setAutoDetectedName(null);
    setResult(null);
    setError(null);
  };

  if (!isOpen) return null;

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
              보급대상 세대 파악 엑셀 파일을 업로드하면<br />
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
              <div className="eid-region-header">
                <label className="eid-region-label">
                  지역 선택
                </label>
                {autoDetectedName && (
                  <span className="eid-auto-badge">
                    파일명에서 &quot;{autoDetectedName}&quot; 자동 감지
                  </span>
                )}
              </div>

              <div className="eid-region-grid">
                <div className="eid-region-col">
                  <span className="eid-field-label">시·도</span>
                  <div className="eid-select-wrap">
                    <select
                      value={selectedSido}
                      onChange={e => handleSidoChange(e.target.value)}
                      className="eid-region-select"
                    >
                      {sidoList.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="eid-select-icon" />
                  </div>
                </div>

                <div className="eid-region-col">
                  <span className="eid-field-label">시·군·구</span>
                  <div className="eid-select-wrap">
                    <select
                      value={selectedRegionId}
                      onChange={e => setSelectedRegionId(e.target.value)}
                      className="eid-region-select"
                    >
                      {availableFireRegions.length === 0 ? (
                        <option value="">선택 가능한 지역 없음</option>
                      ) : (
                        availableFireRegions.map(fr => (
                          <option key={fr.regionId} value={fr.regionId}>
                            {fr.name}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown size={15} className="eid-select-icon" />
                  </div>
                </div>
              </div>
            </div>

            <div className="eid-confirm-actions">
              <button type="button" className="eid-btn-cancel" onClick={handleReset}>
                다시 선택
              </button>
              <button
                type="button"
                className="eid-btn-import"
                onClick={handleImport}
                disabled={!selectedRegionId}
              >
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
              <p className="eid-result-region">{result.regionName}</p>
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
