'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Cropper, { Area } from 'react-easy-crop';
import { Crop as CropIcon, X, ZoomIn, ZoomOut } from 'lucide-react';
import './ImageCropDialog.scss';

interface ImageCropDialogProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context is not available');
  }

  const maxDim = 512;
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

  return canvas.toDataURL('image/jpeg', 0.88);
};

export default function ImageCropDialog({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!open || !imageSrc) return null;

  const handleCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleCropPixels = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBase64);
      onClose();
    } catch (e) {
      console.error('Crop failed:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const dialogRoot = typeof document !== 'undefined'
    ? document.getElementById('dialog-root') || document.body
    : null;

  if (!dialogRoot) return null;

  return createPortal(
    <div className={`image-crop-modal-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="image-crop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crop-modal-header">
          <div className="header-title-group">
            <CropIcon size={18} />
            <span>프로필 사진 편집</span>
          </div>
          <button type="button" className="close-btn" onClick={onClose} title="닫기">
            <X size={20} />
          </button>
        </div>

        <div className="crop-modal-body">
          <div className="cropper-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={handleCropChange}
              onZoomChange={handleZoomChange}
              onCropComplete={handleCropPixels}
            />
          </div>

          <div className="zoom-control-row">
            <ZoomOut size={16} />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="zoom-slider"
            />
            <ZoomIn size={16} />
          </div>
        </div>

        <div className="crop-modal-footer">
          <button
            type="button"
            className="action-btn cancel"
            onClick={onClose}
            disabled={isProcessing}
          >
            취소
          </button>
          <button
            type="button"
            className="action-btn confirm"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? '처리 중...' : '적용하기'}
          </button>
        </div>
      </div>
    </div>,
    dialogRoot
  );
}
