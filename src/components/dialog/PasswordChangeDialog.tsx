'use client';

import React, { useState, useEffect } from 'react';
import SlideDialog from './SlideDialog';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useSnackbar } from 'notistack';
import PortalService from '@/api/service/PortalService';
import './PasswordChangeDialog.scss';

interface PasswordChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeDialog({
  isOpen,
  onClose,
}: PasswordChangeDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // 비밀번호 일치 여부 상태
  const isMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isTooShort = newPassword.length > 0 && newPassword.length < 6;

  const handleSubmit = async () => {
    if (!currentPassword.trim()) {
      enqueueSnackbar('현재 비밀번호를 입력해 주세요.', { variant: 'error' });
      return;
    }
    if (!newPassword.trim()) {
      enqueueSnackbar('새 비밀번호를 입력해 주세요.', { variant: 'error' });
      return;
    }
    if (newPassword.trim().length < 6) {
      enqueueSnackbar('새 비밀번호는 최소 6자 이상이어야 합니다.', { variant: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.', { variant: 'error' });
      return;
    }
    if (currentPassword === newPassword) {
      enqueueSnackbar('현재 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await PortalService.changePassword(currentPassword, newPassword.trim());
      enqueueSnackbar('비밀번호가 성공적으로 변경되었습니다.', { variant: 'success' });
      onClose();
    } catch (error: any) {
      const msg = error?.message || '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해 주세요.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SlideDialog
      isOpen={isOpen}
      onClose={onClose}
      title="비밀번호 변경"
      className="password-change-slide-dialog"
      footer={
        <div className="password-change-footer-btns">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
            취소
          </button>
          <button
            type="button"
            className="btn-submit"
            onClick={handleSubmit}
            disabled={isSubmitting || isMismatch || isTooShort || !currentPassword || !newPassword || !confirmPassword}
          >
            {isSubmitting ? '변경 중...' : '비밀번호 변경'}
          </button>
        </div>
      }
    >
      <div className="password-change-body">
        {/* 안내 배너 */}
        <div className="security-notice-box">
          <ShieldCheck size={18} className="notice-icon" />
          <div className="notice-texts">
            <span className="notice-title">안전한 계정 관리를 위해 비밀번호를 주기적으로 변경해 주세요.</span>
            <span className="notice-sub">새 비밀번호는 최소 6자 이상으로 설정해야 합니다.</span>
          </div>
        </div>

        {/* 현재 비밀번호 */}
        <div className="form-group">
          <label className="form-label">
            현재 비밀번호 <span className="req">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type={showCurrent ? 'text' : 'password'}
              className="form-input"
              placeholder="현재 사용 중인 비밀번호"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="btn-toggle-pw"
              onClick={() => setShowCurrent(prev => !prev)}
              tabIndex={-1}
              aria-label={showCurrent ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* 새 비밀번호 */}
        <div className="form-group">
          <label className="form-label">
            새 비밀번호 <span className="req">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type={showNew ? 'text' : 'password'}
              className={`form-input ${isTooShort ? 'input-error' : ''}`}
              placeholder="새로운 비밀번호 (6자 이상)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="btn-toggle-pw"
              onClick={() => setShowNew(prev => !prev)}
              tabIndex={-1}
              aria-label={showNew ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {isTooShort ? (
            <span className="field-msg error">비밀번호는 최소 6자 이상이어야 합니다.</span>
          ) : (
            <span className="field-msg hint">6자 이상 입력해 주세요.</span>
          )}
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="form-group">
          <label className="form-label">
            새 비밀번호 확인 <span className="req">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type={showConfirm ? 'text' : 'password'}
              className={`form-input ${isMismatch ? 'input-error' : isMatch ? 'input-success' : ''}`}
              placeholder="새로운 비밀번호 재입력"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="btn-toggle-pw"
              onClick={() => setShowConfirm(prev => !prev)}
              tabIndex={-1}
              aria-label={showConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {isMismatch && (
            <span className="field-msg error">새 비밀번호가 일치하지 않습니다.</span>
          )}
          {isMatch && (
            <span className="field-msg success">새 비밀번호가 일치합니다.</span>
          )}
        </div>
      </div>
    </SlideDialog>
  );
}
