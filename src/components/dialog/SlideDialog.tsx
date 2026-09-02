import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, X } from 'lucide-react';
import './SlideDialog.scss';

interface SlideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  subHeader?: React.ReactNode;
  rightElement?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
  disableBackdropClick?: boolean;
}

// 전역 다이얼로그 열림 스택 카운터 (모달 중첩 시에도 스크롤 락 유지 및 위치 보존)
let openDialogCount = 0;
let savedScrollY = 0;

const lockBodyScroll = () => {
  if (typeof document === 'undefined') return;
  if (openDialogCount === 0) {
    savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  openDialogCount++;
};

const unlockBodyScroll = () => {
  if (typeof document === 'undefined') return;
  openDialogCount = Math.max(0, openDialogCount - 1);
  if (openDialogCount === 0) {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    window.scrollTo(0, savedScrollY);
  }
};

export default function SlideDialog({
  isOpen,
  onClose,
  title,
  children,
  footer,
  subHeader,
  rightElement,
  noPadding,
  className,
  disableBackdropClick = false,
}: SlideDialogProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 바디 스크롤 락 제어 (백드롭 스크롤 누수 완벽 차단)
  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
      return () => {
        unlockBodyScroll();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      setShouldRender(true);
      window.addEventListener('keydown', handleKeyDown);
      const timer = setTimeout(() => {
        setActive(true);
      }, 10);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      setActive(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!shouldRender || !mounted) return null;

  const dialogRoot = document.getElementById('dialog-root') || document.body;

  const handleOverlayClick = () => {
    if (!disableBackdropClick) {
      onClose();
    }
  };

  return createPortal(
    <div className={`slide-dialog-overlay ${active ? 'open' : ''} ${className || ''}`} onClick={handleOverlayClick}>
      <div 
        className={`slide-dialog-content ${active ? 'open' : ''} ${className || ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <header className="dialog-header">
          <button className="back-btn" onClick={onClose}>
            {className?.includes('manage-page') ? <X size={22} /> : <ArrowLeft size={24} />}
          </button>
          <h2 className="dialog-title">{title}</h2>
          <div className="header-right">
            {rightElement}
          </div>
        </header>
        {subHeader && (
          <div className="dialog-sub-header">
            {className ? (
              <div className={className} style={{ display: 'contents' }}>
                {subHeader}
              </div>
            ) : (
              subHeader
            )}
          </div>
        )}
        <div className={`dialog-body ${noPadding ? 'no-padding' : ''}`}>
          {className ? (
            <div className={className} style={{ display: 'contents' }}>
              {children}
            </div>
          ) : (
            children
          )}
        </div>
        {footer && (
          <footer className="dialog-footer">
            {className ? (
              <div className={className} style={{ display: 'contents' }}>
                {footer}
              </div>
            ) : (
              footer
            )}
          </footer>
        )}
      </div>
    </div>,
    dialogRoot
  );
};