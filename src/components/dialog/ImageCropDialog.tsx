'use client';

import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import './ImageCropDialog.scss';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropDialogProps {
  isOpen?: boolean;
  open?: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
  aspect?: number;
  title?: string;
  disableBackdropClick?: boolean;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.src = url;
  });

/**
 * Blob 또는 File을 안전하게 가져오기 (문자열 URL/DataURL인 경우 fetch로 Blob 변환)
 */
const toBlob = async (source: File | Blob | string): Promise<Blob> => {
  if (source instanceof Blob) {
    return source;
  }
  if (typeof source === 'string') {
    const res = await fetch(source);
    return await res.blob();
  }
  throw new Error('지원되지 않는 이미지 소스 형식입니다.');
};

/**
 * Canvas를 고효율 WebP DataURL로 변환 (브라우저 WebP 미지원 시 JPEG fallback)
 */
const canvasToDataUrl = (canvas: HTMLCanvasElement, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob && blob.type === 'image/webp') {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      } else {
        canvas.toBlob((jpegBlob) => {
          if (jpegBlob) {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(jpegBlob);
          } else {
            resolve(canvas.toDataURL('image/jpeg', quality));
          }
        }, 'image/jpeg', quality);
      }
    }, 'image/webp', quality);
  });
};

/**
 * 모바일 카메라 촬영 / 대용량 이미지(50MP 등)의 브라우저 메모리 폭증(OOM) 방지를 위한 사전 다운스케일링 유틸
 * - createImageBitmap의 백그라운드 리사이징을 활용하여 거대한 비트맵을 메인 스레드에 올리지 않고 즉시 축소
 */
export const prepareSafeImageSrc = async (
  source: File | Blob | string,
  maxDim = 1600
): Promise<string> => {
  try {
    const blob = await toBlob(source);

    if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
      // 1. 메타데이터 크기 확인용 임시 비트맵
      const tempBitmap = await createImageBitmap(blob);
      const origW = tempBitmap.width;
      const origH = tempBitmap.height;
      tempBitmap.close(); // 메모리 즉시 반환

      let targetW = origW;
      let targetH = origH;

      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        } else {
          targetW = Math.round((targetW * maxDim) / targetH);
          targetH = maxDim;
        }
      }

      // 브라우저 백그라운드 엔진에서 사전 다운스케일링
      const resizedBitmap = await createImageBitmap(blob, {
        resizeWidth: targetW,
        resizeHeight: targetH,
        resizeQuality: 'high',
      });

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) {
        resizedBitmap.close();
        throw new Error('Canvas 2D Context 오류');
      }

      ctx.drawImage(resizedBitmap, 0, 0);
      resizedBitmap.close(); // 메모리 즉시 해제

      const resultUrl = await canvasToDataUrl(canvas, 0.85);
      canvas.width = 0;
      canvas.height = 0;
      return resultUrl;
    }
  } catch (err) {
    console.warn('[prepareSafeImageSrc] createImageBitmap 최적화 실패, fallback 수행:', err);
  }

  // Fallback: HTMLImageElement 방식
  return new Promise((resolve, reject) => {
    let src = '';
    try {
      src = typeof source === 'string' ? source : URL.createObjectURL(source);
      const img = new Image();
      img.onload = () => {
        try {
          if (typeof source !== 'string') {
            URL.revokeObjectURL(src);
          }

          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }

          ctx.drawImage(img, 0, 0, w, h);
          canvasToDataUrl(canvas, 0.85).then(res => {
            canvas.width = 0;
            canvas.height = 0;
            resolve(res);
          });
        } catch {
          resolve(src);
        }
      };
      img.onerror = (e) => {
        if (typeof source !== 'string') URL.revokeObjectURL(src);
        reject(e);
      };
      img.src = src;
    } catch (e) {
      if (typeof source !== 'string' && src) URL.revokeObjectURL(src);
      reject(e);
    }
  });
};

export const getCroppedImgWebP = async (
  imageSrc: string,
  pixelCrop: CropArea,
  maxDim = 1200
): Promise<string> => {
  // createImageBitmap 최적화 시도 (네이티브 크롭 & 리사이징)
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      const blob = await toBlob(imageSrc);
      let targetWidth = Math.round(pixelCrop.width);
      let targetHeight = Math.round(pixelCrop.height);

      if (targetWidth > maxDim || targetHeight > maxDim) {
        if (targetWidth > targetHeight) {
          targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
          targetWidth = maxDim;
        } else {
          targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
          targetHeight = maxDim;
        }
      }

      const croppedBitmap = await createImageBitmap(
        blob,
        Math.round(pixelCrop.x),
        Math.round(pixelCrop.y),
        Math.round(pixelCrop.width),
        Math.round(pixelCrop.height),
        {
          resizeWidth: targetWidth,
          resizeHeight: targetHeight,
          resizeQuality: 'high',
        }
      );

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (ctx) {
        ctx.drawImage(croppedBitmap, 0, 0);
        croppedBitmap.close();
        const res = await canvasToDataUrl(canvas, 0.85);
        canvas.width = 0;
        canvas.height = 0;
        return res;
      }
      croppedBitmap.close();
    } catch (e) {
      console.warn('[getCroppedImgWebP] createImageBitmap 실패, Canvas fallback:', e);
    }
  }

  // Fallback: 기존 Canvas drawImage 방식
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: false });

  if (!ctx) {
    throw new Error('Canvas 2D Context를 가져올 수 없습니다.');
  }

  let targetWidth = Math.round(pixelCrop.width);
  let targetHeight = Math.round(pixelCrop.height);

  if (targetWidth > maxDim || targetHeight > maxDim) {
    if (targetWidth > targetHeight) {
      targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
      targetWidth = maxDim;
    } else {
      targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
      targetHeight = maxDim;
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  const res = await canvasToDataUrl(canvas, 0.85);
  canvas.width = 0;
  canvas.height = 0;
  return res;
};

/**
 * 일반 작업자 전용: 기기 무관(모바일/PC) 대화상자 없이 이미지 중앙을 4:3 비율로 자동 크롭하고 WebP로 압축 반환
 * - 초고화소 스마트폰 카메라 OOM 방지를 위해 createImageBitmap을 통한 고속 네이티브 크롭+리사이징 지원
 */
export const autoCropCenterWebP = async (
  source: File | Blob | string,
  aspect = 4 / 3,
  maxDim = 1200
): Promise<string> => {
  try {
    const blob = await toBlob(source);

    if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
      // 1. 메타데이터 크기 확인
      const tempBitmap = await createImageBitmap(blob);
      const w = tempBitmap.width;
      const h = tempBitmap.height;
      tempBitmap.close();

      let cropWidth = w;
      let cropHeight = h;
      let cropX = 0;
      let cropY = 0;

      if (w / h > aspect) {
        cropHeight = h;
        cropWidth = h * aspect;
        cropX = (w - cropWidth) / 2;
        cropY = 0;
      } else {
        cropWidth = w;
        cropHeight = w / aspect;
        cropX = 0;
        cropY = (h - cropHeight) / 2;
      }

      let targetWidth = Math.round(cropWidth);
      let targetHeight = Math.round(cropHeight);

      if (targetWidth > maxDim || targetHeight > maxDim) {
        if (targetWidth > targetHeight) {
          targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
          targetWidth = maxDim;
        } else {
          targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
          targetHeight = maxDim;
        }
      }

      // 네이티브 크롭 + 리사이징을 한 번에 수행하여 메모리 사용량 최소화
      const croppedBitmap = await createImageBitmap(
        blob,
        Math.round(cropX),
        Math.round(cropY),
        Math.round(cropWidth),
        Math.round(cropHeight),
        {
          resizeWidth: targetWidth,
          resizeHeight: targetHeight,
          resizeQuality: 'high',
        }
      );

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) {
        croppedBitmap.close();
        throw new Error('Canvas 2D Context 오류');
      }

      ctx.drawImage(croppedBitmap, 0, 0);
      croppedBitmap.close();

      const result = await canvasToDataUrl(canvas, 0.85);
      canvas.width = 0;
      canvas.height = 0;
      return result;
    }
  } catch (err) {
    console.warn('[autoCropCenterWebP] createImageBitmap 네이티브 크롭 실패, fallback 수행:', err);
  }

  // Fallback: 기존 getCroppedImgWebP 호출 방식
  let imageSrc = '';
  try {
    imageSrc = typeof source === 'string' ? source : URL.createObjectURL(source);
    const image = await createImage(imageSrc);
    const w = image.naturalWidth || image.width;
    const h = image.naturalHeight || image.height;

    let cropWidth = w;
    let cropHeight = h;
    let cropX = 0;
    let cropY = 0;

    if (w / h > aspect) {
      cropHeight = h;
      cropWidth = h * aspect;
      cropX = (w - cropWidth) / 2;
      cropY = 0;
    } else {
      cropWidth = w;
      cropHeight = w / aspect;
      cropX = 0;
      cropY = (h - cropHeight) / 2;
    }

    const pixelCrop: CropArea = {
      x: Math.round(cropX),
      y: Math.round(cropY),
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
    };

    const res = await getCroppedImgWebP(imageSrc, pixelCrop, maxDim);
    if (typeof source !== 'string') URL.revokeObjectURL(imageSrc);
    return res;
  } catch (err) {
    if (typeof source !== 'string' && imageSrc) URL.revokeObjectURL(imageSrc);
    throw err;
  }
};

/**
 * 이미지를 시계방향으로 90도 회전하여 WebP DataURL로 반환
 */
export const rotateImage90Cw = async (imageSrc: string): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;

  // 90도 회전 시 폭과 높이가 서로 바뀜
  canvas.width = h;
  canvas.height = w;

  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) throw new Error('Canvas 2D Context 오류');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((90 * Math.PI) / 180);
  ctx.drawImage(image, -w / 2, -h / 2);

  const res = await canvasToDataUrl(canvas, 0.85);
  canvas.width = 0;
  canvas.height = 0;
  return res;
};

export default function ImageCropDialog({
  isOpen,
  open,
  imageSrc,
  onClose,
  onCropComplete,
  aspect = 4 / 3,
  title = '사진 자르기 (4:3)',
  disableBackdropClick = true,
}: ImageCropDialogProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(imageSrc);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea>();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setCurrentSrc(imageSrc);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, [imageSrc]);

  const isShow = isOpen ?? open ?? false;
  if (!isShow || !imageSrc) return null;

  const handleCropChange = (location: { x: number; y: number }) => {
    setCrop(location);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleCropAreaChange = (_croppedArea: any, croppedPixels: CropArea) => {
    setCroppedAreaPixels(croppedPixels);
  };

  // 시계방향 90도 회전 핸들러
  const handleRotate = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      const rotated = await rotateImage90Cw(currentSrc);
      setCurrentSrc(rotated);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      console.error('이미지 회전 실패:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedDataUrl = await getCroppedImgWebP(currentSrc, croppedAreaPixels, 1200);
      onCropComplete(croppedDataUrl);
      onClose();
    } catch (err) {
      console.error('이미지 크롭 실패:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="image-crop-overlay"
      onClick={() => {
        if (!disableBackdropClick && !isProcessing) onClose();
      }}
    >
      <div className="image-crop-modal" onClick={e => e.stopPropagation()}>
        <header className="crop-header">
          <button
            type="button"
            className="crop-header-btn back"
            onClick={onClose}
            disabled={isProcessing}
            title="닫기"
          >
            <X size={20} />
          </button>
          <h3 className="crop-title">{title}</h3>
          <div className="crop-header-spacer" />
        </header>

        <div className="crop-cropper-body">
          <Cropper
            image={currentSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            minZoom={1}
            maxZoom={3}
            zoomSpeed={0.2}
            restrictPosition={true}
            showGrid={true}
            onCropChange={handleCropChange}
            onZoomChange={handleZoomChange}
            onCropComplete={handleCropAreaChange}
          />
          <button
            type="button"
            className="btn-cropper-rotate"
            onClick={handleRotate}
            disabled={isProcessing}
            title="시계방향 90° 회전"
          >
            <RotateCw size={15} />
            <span>90° 회전</span>
          </button>
        </div>

        <div className="crop-footer">
          <div className="zoom-controller">
            <ZoomOut size={16} className="zoom-icon" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.02}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="zoom-slider"
            />
            <ZoomIn size={16} className="zoom-icon" />
          </div>
          <div className="crop-actions">
            <button
              type="button"
              className="btn-crop-cancel"
              onClick={onClose}
              disabled={isProcessing}
            >
              취소
            </button>
            <button
              type="button"
              className="btn-crop-submit"
              onClick={handleApply}
              disabled={isProcessing}
            >
              {isProcessing ? '압축 중...' : '자르기 완료'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
