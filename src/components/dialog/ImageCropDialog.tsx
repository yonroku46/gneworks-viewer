'use client';

import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
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

const getCroppedImgWebP = async (
  imageSrc: string,
  pixelCrop: CropArea,
  maxDim = 1200
): Promise<string> => {
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

  // 고효율 WebP 압축 (품질 0.85)
  const mimeType = 'image/webp';
  const quality = 0.85;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } else {
        resolve(canvas.toDataURL('image/jpeg', quality));
      }
    }, mimeType, quality);
  });
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
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea>();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedDataUrl = await getCroppedImgWebP(imageSrc, croppedAreaPixels, 1200);
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
          >
            <X size={20} />
          </button>
          <h3 className="crop-title">{title}</h3>
          <div className="crop-header-spacer" />
        </header>

        <div className="crop-cropper-body">
          <Cropper
            image={imageSrc}
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
