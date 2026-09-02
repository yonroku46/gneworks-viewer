'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SignatureCanvas from 'react-signature-canvas';
import { RotateCcw } from 'lucide-react';
import { useSnackbar } from 'notistack';
import './SignatureDialog.scss';

interface SignatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  userName?: string;
}

export default function SignatureDialog({
  isOpen,
  onClose,
  onSave,
  userName,
}: SignatureDialogProps) {
  const sigPadRef = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isOpen) {
      setHasDrawn(false);
      const updateDimensions = () => {
        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          if (clientWidth > 0 && clientHeight > 0) {
            setCanvasDimensions({ width: clientWidth, height: clientHeight });
          }
        }
      };

      const timer1 = setTimeout(updateDimensions, 50);
      const timer2 = setTimeout(updateDimensions, 150);
      window.addEventListener('resize', updateDimensions);
      window.addEventListener('orientationchange', updateDimensions);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        window.removeEventListener('resize', updateDimensions);
        window.removeEventListener('orientationchange', updateDimensions);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !sigPadRef.current) return;

    try {
      const sigPad = sigPadRef.current.getSignaturePad();
      if (!sigPad) return;

      const anyPad = sigPad as any;

      if (!anyPad._originalCreatePoint) {
        anyPad._originalCreatePoint = anyPad._createPoint.bind(sigPad);
      }

      anyPad._createPoint = function (x: number, y: number, time?: number) {
        const canvas = anyPad._canvas as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isPortrait = window.innerHeight > window.innerWidth;
        const isRotated = isMobile && isPortrait;

        if (isRotated) {
          const scaleX = canvas.width / rect.height;
          const scaleY = canvas.height / rect.width;
          const localX = (y - rect.top) * scaleX;
          const localY = (rect.right - x) * scaleY;
          return anyPad._originalCreatePoint(rect.left + localX, rect.top + localY, time);
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const localX = (x - rect.left) * scaleX;
        const localY = (y - rect.top) * scaleY;
        return anyPad._originalCreatePoint(rect.left + localX, rect.top + localY, time);
      };
    } catch (err) {
      console.warn('Failed to attach coordinate mapper to signature pad:', err);
    }
  }, [isOpen, canvasDimensions]);

  if (!isOpen) return null;

  const handleClear = () => {
    sigPadRef.current?.clear();
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      enqueueSnackbar('서명을 먼저 입력해 주세요.', { variant: 'warning' });
      return;
    }

    try {
      const trimmedCanvas = sigPadRef.current.getTrimmedCanvas();
      const signatureDataUrl = trimmedCanvas.toDataURL('image/png');
      onSave(signatureDataUrl);
      onClose();
    } catch (e) {
      console.error('Failed to export signature:', e);
      enqueueSnackbar('서명 저장 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const dialogRoot = typeof document !== 'undefined'
    ? document.getElementById('dialog-root') || document.body
    : null;

  if (!dialogRoot) return null;

  return createPortal(
    <div className={`signature-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="signature-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="pad-terminal">
            <div className="pad-terminal-header">
              <div className="pad-status">
                <span className="pad-status-text">GNE 전자서명</span>
              </div>
              <button type="button" className="btn-clear" onClick={handleClear}>
                <RotateCcw size={12} />
                <span>지우기</span>
              </button>
            </div>

            <div className="canvas-container" ref={containerRef}>
              {userName ? (
                <div className={`pad-guide-wrap ${hasDrawn ? 'drawn' : ''}`}>
                  <div className={`guide-name len-${Math.min(Math.max(userName.trim().length, 2), 6)}`}>
                    {userName}
                  </div>
                  <span className="guide-sub">이름을 따라 정자로 서명해 주세요</span>
                </div>
              ) : (
                !hasDrawn && <div className="pad-watermark">정자로 또렷하게 작성해 주세요</div>
              )}
              <SignatureCanvas
                ref={sigPadRef}
                penColor="#0f172a"
                onBegin={() => setHasDrawn(true)}
                canvasProps={{
                  className: 'sig-canvas',
                  width: canvasDimensions.width || undefined,
                  height: canvasDimensions.height || undefined,
                }}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="action-btn cancel" onClick={onClose}>
            취소
          </button>
          <button type="button" className="action-btn save" onClick={handleSave}>
            서명 저장하기
          </button>
        </div>
      </div>
    </div>,
    dialogRoot
  );
}
