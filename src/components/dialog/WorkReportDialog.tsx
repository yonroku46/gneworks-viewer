'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import SlideDialog from './SlideDialog';
import SignatureDialog from './SignatureDialog';
import ImageCropDialog, { autoCropCenterWebP } from './ImageCropDialog';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/providers/AuthProvider';
import PortalService from '@/api/service/PortalService';
import { getImageUrl } from '@/common/utils/imageUtils';
import AdminSiteBadge from '@/components/common/AdminSiteBadge';
import { isAdminRegion } from '@/common/utils/regionUtils';
import { Plus, X, Check, AlertCircle, Building2, Loader2, ClipboardPaste } from 'lucide-react';
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
      siteId: site?.siteId || existingReport?.siteId || household?.siteId || '',
      regionId: site?.regionId || existingReport?.regionId || '',
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

  // 클립보드 붙여넣기 시 슬롯 선택 대기 중인 이미지 데이터
  const [pendingPastedImage, setPendingPastedImage] = useState<{ rawSrc: string; file?: File } | null>(null);
  // 드래그앤드롭 오버 중인 슬롯 키
  const [dragOverSlot, setDragOverSlot] = useState<PhotoSlotKey | null>(null);
  const photosRef = useRef<{ [key in PhotoSlotKey]?: string }>({});

  // 관리자 여부 판별 (AuthProvider 기준과 동일: mngFlg)
  const isManager = Boolean(user?.mngFlg);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // 다이얼로그 열릴 때의 원본 스냅샷 (실제 변경 사항이 있을 때만 닫기 확인 모달 띄우기 위함)
  const initialSnapshotRef = useRef<{
    installDate: string;
    reporterName: string;
    confirmerName: string;
    remarks: string;
    confirmerSignature: string;
    photos: { [key in PhotoSlotKey]?: string };
  } | undefined>(undefined);

  // 세대별 임시 작성 키
  const getDraftKey = (householdId?: string, siteId?: string) => {
    if (!householdId) return null;
    return `gneworks_report_draft_${siteId || ''}_${householdId}`;
  };

  const clearDraft = () => {
    if (target?.householdId && typeof window !== 'undefined') {
      const draftKey = getDraftKey(target.householdId, target.siteId);
      if (draftKey) {
        try {
          sessionStorage.removeItem(draftKey);
        } catch {}
      }
    }
  };

  // 현재 열려있는 대상의 고유 식별자 (SSE 알림 등으로 부모 props가 갱신되어도 작성 중인 폼 리셋 방지)
  const initializedTargetKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      initializedTargetKeyRef.current = null;
      return;
    }

    if (!target) return;

    const currentTargetKey = `${target.siteId || ''}_${target.dong || ''}_${target.ho || ''}_${target.householdId || ''}_${target.existingReport?.reportId || 'new'}`;

    // 이미 열려 있고 동일 세대/보고서를 작성 중인 경우 외부 props(site 등) 변경으로 인한 폼 리셋 방지
    if (initializedTargetKeyRef.current === currentTargetKey) {
      return;
    }

    initializedTargetKeyRef.current = currentTargetKey;
    const todayStr = dayjs().format('YYYY-MM-DD');
    
    const initInstallDate = target.existingReport?.installDate || todayStr;
    const initReporterName = target.existingReport?.reporterName || user?.userName || '현장 작업자';
    const rawConfirmer = target.existingReport?.confirmerName || target.headName || '';
    const cleanConfirmer = (rawConfirmer.trim() === '-') ? '' : rawConfirmer.trim();
    const initConfirmerName = cleanConfirmer;
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

    // 작성 모드일 때 이전에 작성 중이던 임시 저장(Draft) 데이터 확인 및 자동 복원
    let restoredDraft = false;
    if (!isReadOnly && typeof window !== 'undefined') {
      const draftKey = getDraftKey(target.householdId, target.siteId);
      if (draftKey) {
        try {
          const raw = sessionStorage.getItem(draftKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              setStep(parsed.step || 1);
              setInstallDate(parsed.installDate || initInstallDate);
              setReporterName(parsed.reporterName || initReporterName);
              setConfirmerName(parsed.confirmerName || initConfirmerName);
              setRemarks(parsed.remarks || initRemarks);
              setConfirmerSignature(parsed.confirmerSignature || initSignature);
              setPhotos(parsed.photos || photoMap);
              restoredDraft = true;

              initialSnapshotRef.current = {
                installDate: initInstallDate,
                reporterName: initReporterName,
                confirmerName: initConfirmerName,
                remarks: initRemarks,
                confirmerSignature: initSignature,
                photos: { ...photoMap },
              };
            }
          }
        } catch (err) {
          console.warn('[WorkReportDialog] Failed to restore draft:', err);
        }
      }
    }

    if (!restoredDraft) {
      setStep(1); // 열릴 때 항상 1단계부터 시작
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
  }, [target, isOpen, user, isReadOnly]);

  // 작성 중인 데이터를 실시간으로 sessionStorage에 안전 백업 (카메라 촬영, 회전, 브라우저 백그라운드 리로드 대응)
  useEffect(() => {
    if (!isOpen || isReadOnly || !target?.householdId || typeof window === 'undefined') return;

    const draftKey = getDraftKey(target.householdId, target.siteId);
    if (!draftKey) return;

    try {
      const draftData = {
        step,
        installDate,
        reporterName,
        confirmerName,
        remarks,
        confirmerSignature,
        photos,
        updatedAt: Date.now(),
      };
      sessionStorage.setItem(draftKey, JSON.stringify(draftData));
    } catch (e) {
      console.warn('[WorkReportDialog] Auto-save draft error:', e);
    }
  }, [isOpen, isReadOnly, target?.householdId, target?.siteId, step, installDate, reporterName, confirmerName, remarks, confirmerSignature, photos]);

  // 1단계 -> 2단계 이동 (확인자 성명 및 서명 검증)
  const handleGoToStep2 = () => {
    if (!confirmerName.trim() || confirmerName.trim() === '-') {
      enqueueSnackbar('확인자 성명을 입력해 주세요.', { variant: 'warning' });
      return;
    }
    if (!confirmerSignature) {
      enqueueSnackbar('확인자 서명을 받아주세요.', { variant: 'warning' });
      return;
    }
    setStep(2);
  };

  // 2단계 -> 3단계 이동 (사진 선택 사항)
  const handleGoToStep3 = () => {
    setStep(3);
  };

  // 슬롯에 이미지 적용 (관리자: 4:3 수동 크롭 다이얼로그 오픈 / 작업자: 중앙 4:3 자동 크롭 & WebP 압축 즉시 반영)
  const applyImageToSlot = async (key: PhotoSlotKey, rawSrc: string, modalTitle?: string) => {
    if (isManager) {
      const slotInfo = REPORT_PHOTO_SLOTS.find(s => s.key === key);
      setCropTarget({
        key,
        rawSrc,
        title: modalTitle || (slotInfo ? `${slotInfo.title} 편집` : '사진 자르기 (4:3)'),
      });
    } else {
      try {
        const autoWebP = await autoCropCenterWebP(rawSrc, 4 / 3, 1200);
        setPhotos(prev => ({ ...prev, [key]: autoWebP }));
      } catch (err) {
        console.error('[WorkReportDialog] autoCropCenterWebP error:', err);
        setPhotos(prev => ({ ...prev, [key]: rawSrc }));
      }
    }
  };

  // 공통 이미지 파일 처리
  const processImageFile = (key: PhotoSlotKey, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      applyImageToSlot(key, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 사진 업로드 핸들러
  const handlePhotoUpload = (key: PhotoSlotKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(key, file);
      e.target.value = '';
    }
  };

  // 클립보드 붙여넣기 (Ctrl+V) 핸들러 - 사용자가 등록 위치를 직접 선택할 수 있도록 모달 오픈
  const handleClipboardPaste = (
    e: ClipboardEvent | React.ClipboardEvent
  ) => {
    if (isReadOnly || step !== 2) return;
    if (cropTarget || isSignatureModalOpen) return;

    // 텍스트 input / textarea 등에 포커스가 있을 경우 텍스트 복붙을 방해하지 않음
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') &&
      (activeEl as HTMLInputElement).type !== 'file'
    ) {
      return;
    }

    const clipboardData = (e as any).clipboardData || (window as any).clipboardData;
    if (!clipboardData) return;

    let imageFile: File | null = null;
    const items = clipboardData.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            imageFile = file;
            break;
          }
        }
      }
    }

    if (!imageFile && clipboardData.files && clipboardData.files.length > 0) {
      for (let i = 0; i < clipboardData.files.length; i++) {
        const file = clipboardData.files[i];
        if (file.type && file.type.startsWith('image/')) {
          imageFile = file;
          break;
        }
      }
    }

    if (!imageFile) return;

    e.preventDefault();

    const reader = new FileReader();
    reader.onload = () => {
      setPendingPastedImage({
        rawSrc: reader.result as string,
        file: imageFile!,
      });
    };
    reader.readAsDataURL(imageFile);
  };

  // 슬롯 선택 팝업에서 사용자가 슬롯을 선택했을 때 실행
  const handleSelectPasteSlot = (key: PhotoSlotKey) => {
    if (!pendingPastedImage) return;
    const rawSrc = pendingPastedImage.rawSrc;
    setPendingPastedImage(null);
    applyImageToSlot(key, rawSrc);
  };

  // 슬롯 선택 팝업 열려있을 때 ESC 키 누르면 닫기
  useEffect(() => {
    if (!pendingPastedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPendingPastedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingPastedImage]);

  // 전역 클립보드 붙여넣기 리스너 (Step 2에서 어디서든 Ctrl+V 누르면 동작)
  useEffect(() => {
    if (!isOpen || step !== 2 || isReadOnly) return;

    const onWindowPaste = (e: ClipboardEvent) => {
      handleClipboardPaste(e);
    };

    window.addEventListener('paste', onWindowPaste);
    return () => {
      window.removeEventListener('paste', onWindowPaste);
    };
  }, [isOpen, step, isReadOnly]);

  // 등록된 사진 재편집 (관리자만 수동 크롭 가능)
  const handleReCrop = (key: PhotoSlotKey) => {
    if (!isManager) return;
    if (photos[key]) {
      const slotInfo = REPORT_PHOTO_SLOTS.find(s => s.key === key);
      setCropTarget({
        key,
        rawSrc: getImageUrl(photos[key]!),
        title: slotInfo ? `${slotInfo.title} 편집` : '사진 자르기 (4:3)',
      });
    }
  };

  // 사진 삭제 핸들러
  const handleRemovePhoto = (key: PhotoSlotKey) => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setPhotos(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // 드래그앤드롭으로 특정 슬롯에 이미지를 놓았을 때 처리 (외부 웹페이지 이미지 / 파일 탐색기 드롭 지원)
  const handleDropOnSlot = async (key: PhotoSlotKey, e: React.DragEvent) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const dt = e.dataTransfer;
    if (!dt) return;

    const slotInfo = REPORT_PHOTO_SLOTS.find(s => s.key === key);
    const modalTitle = slotInfo ? `${slotInfo.title} 편집` : '사진 자르기 (4:3)';

    // 1. 파일 객체 처리 (로컬 파일 탐색기 드롭 등)
    if (dt.files && dt.files.length > 0) {
      for (let i = 0; i < dt.files.length; i++) {
        const file = dt.files[i];
        if (file.type && file.type.startsWith('image/')) {
          processImageFile(key, file);
          return;
        }
      }
    }

    // 2. dataTransfer items에 파일이 있는 경우
    if (dt.items && dt.items.length > 0) {
      for (let i = 0; i < dt.items.length; i++) {
        const item = dt.items[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            processImageFile(key, file);
            return;
          }
        }
      }
    }

    // 3. 웹페이지에서 이미지를 끌고 온 경우 (HTML 또는 URL 추출)
    let imageUrl: string | null = null;

    const htmlData = dt.getData('text/html');
    if (htmlData) {
      const match = htmlData.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) {
        imageUrl = match[1];
      }
    }

    if (!imageUrl) {
      const uriList = dt.getData('text/uri-list');
      if (uriList && (uriList.startsWith('http://') || uriList.startsWith('https://') || uriList.startsWith('data:image/'))) {
        imageUrl = uriList.split('\n')[0].trim();
      }
    }

    if (!imageUrl) {
      const plainText = dt.getData('text/plain');
      if (plainText && (plainText.startsWith('http://') || plainText.startsWith('https://') || plainText.startsWith('data:image/'))) {
        imageUrl = plainText.trim();
      }
    }

    if (!imageUrl) {
      enqueueSnackbar('지원되지 않는 파일 형식입니다. 이미지 파일을 드래그해 주세요.', { variant: 'warning' });
      return;
    }

    // data:image URL인 경우 바로 적용
    if (imageUrl.startsWith('data:image/')) {
      applyImageToSlot(key, imageUrl, modalTitle);
      return;
    }

    // 외부 HTTP/HTTPS URL인 경우 blob 변환 시도
    try {
      const res = await fetch(imageUrl, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        if (blob.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            applyImageToSlot(key, reader.result as string, modalTitle);
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
      throw new Error('CORS or invalid blob');
    } catch {
      // fetch 실패 시 Image 객체 및 Canvas로 로드 시도
      const testImg = new Image();
      testImg.crossOrigin = 'anonymous';
      testImg.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = testImg.naturalWidth;
          canvas.height = testImg.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(testImg, 0, 0);
            const dataUrl = canvas.toDataURL('image/webp', 0.85);
            applyImageToSlot(key, dataUrl, modalTitle);
            return;
          }
        } catch {
          // Tainted Canvas
        }
        enqueueSnackbar('외부 사이트 보안 정책(CORS)으로 인해 직접 드래그할 수 없습니다. 이미지를 우클릭하여 "이미지 복사" 후 Ctrl+V로 붙여넣어 주세요!', {
          variant: 'warning',
          autoHideDuration: 5000,
        });
      };
      testImg.onerror = () => {
        enqueueSnackbar('외부 사이트 보안 정책(CORS)으로 인해 직접 드래그할 수 없습니다. 이미지를 우클릭하여 "이미지 복사" 후 Ctrl+V로 붙여넣어 주세요!', {
          variant: 'warning',
          autoHideDuration: 5000,
        });
      };
      testImg.src = imageUrl;
    }
  };

  // 닫기 전 변경사항 보호 (실제 수정 내역이 발생했을 때만 확인 모달 오픈)
  const handleSafeClose = () => {
    if (isSubmitting) return;
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
        clearDraft();
        onClose();
      }
    } else {
      clearDraft();
      onClose();
    }
  };

  // 보고서 제출
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly || isSubmitting || !target) return;

    if (!confirmerName.trim() || confirmerName.trim() === '-') {
      enqueueSnackbar('확인자 성명을 입력해 주세요.', { variant: 'warning' });
      setStep(1);
      return;
    }

    if (!confirmerSignature) {
      enqueueSnackbar('확인자 서명을 받아주세요.', { variant: 'warning' });
      setStep(1);
      return;
    }

    if (!installDate) {
      enqueueSnackbar('설치 일자를 입력해 주세요.', { variant: 'warning' });
      setStep(3);
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
        confirmerName: confirmerName.trim(),
        confirmerSignature,
        photoDoor: photos.photoDoor || '',
        photoBefore1: photos.photoBefore1 || '',
        photoAfter1: photos.photoAfter1 || '',
        photoBefore2: photos.photoBefore2 || '',
        photoAfter2: photos.photoAfter2 || '',
        remarks,
      });

      clearDraft();

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

  // Step 2 사진 슬롯 렌더러
  const renderEditablePhotoSlot = (key: PhotoSlotKey, label: string, buttonText = '사진 등록') => {
    const hasPhoto = !!photos[key];
    const isDragOver = dragOverSlot === key;

    return (
      <div
        key={key}
        className={`photo-upload-box ${isDragOver ? 'is-drag-over' : ''}`}
        onPaste={(e) => handleClipboardPaste(e)}
        onDragOver={(e) => {
          if (isReadOnly) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDragEnter={(e) => {
          if (isReadOnly) return;
          e.preventDefault();
          setDragOverSlot(key);
        }}
        onDragLeave={(e) => {
          if (isReadOnly) return;
          e.preventDefault();
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          if (dragOverSlot === key) setDragOverSlot(null);
        }}
        onDrop={(e) => {
          if (isReadOnly) return;
          e.preventDefault();
          setDragOverSlot(null);
          handleDropOnSlot(key, e);
        }}
      >
        <span className="photo-label">{label}</span>
        {hasPhoto ? (
          <div
            className={`photo-preview-wrapper ${isManager ? 'is-manager' : ''}`}
            onClick={isManager ? () => handleReCrop(key) : undefined}
            title={isManager ? '클릭하여 사진 자르기/위치 조절 (이미지 드래그 또는 Ctrl+V로 교체)' : '등록된 사진'}
            style={{ cursor: isManager ? 'pointer' : 'default' }}
            tabIndex={isManager ? 0 : -1}
            onKeyDown={isManager ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleReCrop(key);
              }
            } : undefined}
          >
            <img src={getImageUrl(photos[key]!)} alt={label} className="preview-img" />
            <button
              type="button"
              className="btn-remove-photo"
              title="사진 삭제"
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePhoto(key);
              }}
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <label
            className="photo-placeholder-btn"
            tabIndex={0}
            title="클릭하여 파일 업로드, 이미지 드래그&드롭, 또는 Ctrl+V로 붙여넣기"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
                input?.click();
              }
            }}
          >
            <Plus size={20} className="plus-icon" />
            <span className="placeholder-text">{buttonText}</span>
            <span className="placeholder-paste-hint">
              {isManager ? '또는 드래그 / Ctrl+V' : '카메라 촬영 또는 등록'}
            </span>
            <input
              type="file"
              accept="image/*"
              capture={isManager ? undefined : 'environment'}
              style={{ display: 'none' }}
              onChange={e => handlePhotoUpload(key, e)}
            />
          </label>
        )}
      </div>
    );
  };

  if (!target) return null;

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
                <div className="site-badge">
                  {isAdminRegion(target.regionId) && <AdminSiteBadge />}
                  {target.siteName}
                </div>
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
                      <span className="target-guide-text">
                        확인자 서명
                      </span>
                    </>
                  ) : step === 2 ? (
                    <>
                      <span className="target-site-badge guide">STEP 2</span>
                      <span className="target-unit-text">
                        사진 등록
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="target-site-badge guide">STEP 3</span>
                      <span className="target-guide-text">작업 장소 및 설치 일자 확인</span>
                    </>
                  )}
                </div>
                <div className="wizard-step-dots" role="status" aria-label={`3단계 중 ${step}단계 진행 중`}>
                  <span
                    className={`step-dot ${step >= 1 ? 'active' : ''}`}
                    onClick={() => setStep(1)}
                    role="button"
                    tabIndex={0}
                    title="1단계: 확인자 서명"
                  />
                  <span
                    className={`step-dot ${step >= 2 ? 'active' : ''}`}
                    onClick={() => {
                      if (!confirmerName.trim() || confirmerName.trim() === '-') {
                        enqueueSnackbar('확인자 성명을 입력해 주세요.', { variant: 'warning' });
                        return;
                      }
                      if (!confirmerSignature) {
                        enqueueSnackbar('확인자 서명을 받아주세요.', { variant: 'warning' });
                        return;
                      }
                      setStep(2);
                    }}
                    role="button"
                    tabIndex={0}
                    title="2단계: 현장 사진"
                  />
                  <span
                    className={`step-dot ${step >= 3 ? 'active' : ''}`}
                    onClick={() => {
                      if (!confirmerName.trim() || confirmerName.trim() === '-') {
                        enqueueSnackbar('확인자 성명을 입력해 주세요.', { variant: 'warning' });
                        return;
                      }
                      if (!confirmerSignature) {
                        enqueueSnackbar('확인자 서명을 받아주세요.', { variant: 'warning' });
                        return;
                      }
                      setStep(3);
                    }}
                    role="button"
                    tabIndex={0}
                    title="3단계: 작업 장소 및 설치 일자 확인"
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
                      <span>다음: 작업 확인 및 제출 (2/3)</span>
                    </button>
                  </>
                )}

                {step === 3 && (
                  <>
                    <button
                      type="button"
                      className="btn-wizard-prev"
                      disabled={isSubmitting}
                      onClick={() => !isSubmitting && setStep(2)}
                    >
                      <span>이전</span>
                    </button>
                    <button
                      type="button"
                      className="btn-submit"
                      disabled={isSubmitting}
                      onClick={() => !isSubmitting && handleSubmit()}
                    >
                      {isSubmitting && <Loader2 size={16} className="btn-spinner" />}
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
                          <img src={getImageUrl(photos.photoDoor)} alt="신주소 대문" className="preview-img" />
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
                          <img src={getImageUrl(photos.photoBefore1)} alt="보급 전 ①" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                    <div className="photo-upload-box">
                      <span className="photo-label">3. 보급 후 ①</span>
                      {photos.photoAfter1 ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={getImageUrl(photos.photoAfter1)} alt="보급 후 ①" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                    <div className="photo-upload-box">
                      <span className="photo-label">4. 보급 전 ②</span>
                      {photos.photoBefore2 ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={getImageUrl(photos.photoBefore2)} alt="보급 전 ②" className="preview-img" />
                        </div>
                      ) : (
                        <div className="photo-placeholder-readonly">사진 미등록</div>
                      )}
                    </div>
                    <div className="photo-upload-box">
                      <span className="photo-label">5. 보급 후 ②</span>
                      {photos.photoAfter2 ? (
                        <div className="photo-preview-wrapper readonly">
                          <img src={getImageUrl(photos.photoAfter2)} alt="보급 후 ②" className="preview-img" />
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
                      <img src={getImageUrl(confirmerSignature)} alt="확인자 서명" className="signature-result-img" />
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
              {/* ── STEP 1: 확인자 성명 및 서명 ── */}
              {step === 1 && (
                <div className="wizard-step-panel step-1-panel">
                  {/* 상단: 세대 간략 안내 카드 */}
                  <div className="step-target-brief-card">
                    <div className="brief-title-line">
                      <Building2 size={16} />
                      <span className="brief-unit">{target.siteName} {target.dong}동 {target.ho}호</span>
                      {target.headName && (
                        <span className="brief-head">{target.headName} 세대</span>
                      )}
                    </div>
                  </div>

                  {/* 확인자 서명 섹션 */}
                  <div className="form-group signature-section">
                    <div className="signature-header-row">
                      <label className="form-label">
                        <span>확인자 성명 및 서명</span>
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
                        className={`signature-display-box ${confirmerSignature ? 'readonly' : ''}`}
                        onClick={() => {
                          if (confirmerSignature) {
                            return;
                          }
                          setIsSignatureModalOpen(true)
                        }}
                      >
                        <div className="signature-canvas-view">
                          <img src={getImageUrl(confirmerSignature)} alt="확인자 서명" className="signature-result-img" />
                        </div>
                        <div className="signature-overlay-actions" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            className="btn-action-pill"
                            onClick={() => setIsSignatureModalOpen(true)}
                          >
                            재서명
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
                </div>
              )}

              {/* ── STEP 2: 현장 사진 등록 ── */}
              {step === 2 && (
                <div className="wizard-step-panel step-2-panel">
                  <div className="step-section-header">
                    <div className="title-with-hint">
                      <h4 className="section-title">현장 사진 (선택)</h4>
                      <span className="clipboard-hint-badge" title="다른 사이트나 파일 탐색기에서 이미지를 각 칸에 직접 끌어다 놓거나(드래그&드롭), 복사(Win+Shift+S 등) 후 Ctrl+V로 붙여넣을 수 있습니다.">
                        <ClipboardPaste size={12} />
                        <span>드래그&드롭 및 Ctrl+V 지원</span>
                      </span>
                    </div>
                    <span className={`photos-count-pill ${Object.keys(photos).length === 5 ? 'completed' : 'pending'}`}>
                      {Object.keys(photos).length === 5 ? '✓ 5개 완료' : `${Object.keys(photos).length} / 5개 등록`}
                    </span>
                  </div>

                  <div className="form-group photos-form-group">
                    <div className="photos-clean-layout">
                      {/* 1. 신주소 대문 */}
                      <div className="door-single-section">
                        {renderEditablePhotoSlot('photoDoor', '1. 신주소 대문', '대문 사진 등록')}
                      </div>

                      {/* 2 & 3. 감지기 1차/2차 전후 4장 그리드 */}
                      <div className="sensor-pairs-grid">
                        {renderEditablePhotoSlot('photoBefore1', '2. 보급 전 ①')}
                        {renderEditablePhotoSlot('photoAfter1', '3. 보급 후 ①')}
                        {renderEditablePhotoSlot('photoBefore2', '4. 보급 전 ②')}
                        {renderEditablePhotoSlot('photoAfter2', '5. 보급 후 ②')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: 작업 장소 및 설치 일자 확인 하고 최종 제출 ── */}
              {step === 3 && (
                <div className="wizard-step-panel step-3-panel">
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
          const displayName = confirmerName.trim() || (target.headName && target.headName !== '-' ? target.headName : '확인자');
          enqueueSnackbar(`${displayName} 확인자 서명이 등록되었습니다.`, { variant: 'success' });
        }}
        userName={confirmerName.trim() || (target.headName && target.headName !== '-' ? target.headName : '')}
        title={`${confirmerName.trim() || (target.headName && target.headName !== '-' ? target.headName : '')} 확인자 서명`}
        disableBackdropClick={true}
      />

      {/* ── 클립보드 붙여넣기 슬롯 선택 팝업 모달 ── */}
      {pendingPastedImage && typeof document !== 'undefined' && createPortal(
        <div
          className="photo-slot-select-modal-backdrop"
          onClick={() => setPendingPastedImage(null)}
        >
          <div
            className="photo-slot-select-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="slot-select-modal-title"
          >
            {/* 1. 표준 다이얼로그 헤더 (좌측 닫기 버튼, 중앙 타이틀) */}
            <div className="dialog-header">
              <button
                type="button"
                className="back-btn"
                onClick={() => setPendingPastedImage(null)}
                aria-label="닫기"
              >
                <X size={20} />
              </button>
              <h3 id="slot-select-modal-title" className="dialog-title">사진 등록 위치 선택</h3>
              <div className="header-right" />
            </div>

            {/* 3. 슬롯 카드 목록 */}
            <div className="slot-selection-body">
              <div className="slot-selection-list">
                {REPORT_PHOTO_SLOTS.map((slot, index) => {
                  const hasPhoto = !!photos[slot.key];
                  return (
                    <button
                      key={slot.key}
                      type="button"
                      className={`slot-choice-card ${hasPhoto ? 'has-photo' : 'is-empty'}`}
                      onClick={() => handleSelectPasteSlot(slot.key)}
                    >
                      <div className="slot-preview-box">
                        {hasPhoto ? (
                          <img src={getImageUrl(photos[slot.key]!)} alt={slot.title} className="slot-thumb" />
                        ) : (
                          <div className="slot-empty-thumb">
                            <Plus size={16} />
                          </div>
                        )}
                      </div>
                      <div className="slot-meta-content">
                        <span className="slot-index-label">{index + 1}번 사진</span>
                        <span className="slot-title-text">{slot.title}</span>
                      </div>
                      <div className="slot-action-badge">
                        {hasPhoto ? (
                          <span className="badge-status replace">교체하기</span>
                        ) : (
                          <span className="badge-status select">등록하기</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. 표준 푸터 버튼 */}
            <div className="dialog-footer">
              <button
                type="button"
                className="btn-cancel btn-close-only"
                onClick={() => setPendingPastedImage(null)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

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
          }}
          disableBackdropClick={true}
        />
      )}
    </>
  );
}
