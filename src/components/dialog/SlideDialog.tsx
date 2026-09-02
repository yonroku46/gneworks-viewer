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
  rightElement?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

export default function SlideDialog({ isOpen, onClose, title, children, footer, rightElement, noPadding, className }: SlideDialogProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return createPortal(
    <div className={`slide-dialog-overlay ${active ? 'open' : ''} ${className || ''}`} onClick={onClose}>
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