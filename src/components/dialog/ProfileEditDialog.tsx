'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera } from 'lucide-react';
import ImageCropDialog from './ImageCropDialog';
import UserAvatar from '@/components/common/UserAvatar';
import './ProfileEditDialog.scss';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhoto?: string;
  initialPhone?: string;
  userName?: string;
  onSave: (data: { profileImg?: string; phoneNum?: string }) => void;
}

export default function ProfileEditDialog({
  isOpen,
  onClose,
  initialPhoto = '',
  initialPhone = '',
  userName = '사용자',
  onSave,
}: ProfileEditDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState(initialPhoto);
  const [phone, setPhone] = useState(initialPhone);

  const [cropImageSrc, setCropImageSrc] = useState<string>();
  const [isCropOpen, setIsCropOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhoto(initialPhoto || '');
      setPhone(initialPhone || '');
    }
  }, [isOpen, initialPhoto, initialPhone]);

  if (!isOpen) return null;

  // 휴대폰 번호 자동 하이픈 포맷팅
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 선택할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleCropComplete = (croppedBase64: string) => {
    setPhoto(croppedBase64);
  };

  const handleSave = () => {
    onSave({
      profileImg: photo,
      phoneNum: phone,
    });
    onClose();
  };

  const dialogRoot = typeof document !== 'undefined'
    ? document.getElementById('dialog-root') || document.body
    : null;

  if (!dialogRoot) return null;

  return (
    <>
      {createPortal(
        <div className={`profile-edit-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
          <div className="profile-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">프로필 정보 수정</span>
              <button type="button" className="close-btn" onClick={onClose} title="닫기">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* 프로필 사진 편집 */}
              <div className="avatar-edit-section">
                <UserAvatar 
                  src={photo} 
                  name={userName} 
                  size="huge" 
                />
                <div className="avatar-actions-row">
                  <button
                    type="button"
                    className="btn-change-photo"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={14} />
                    <span>사진 {photo ? '변경' : '등록'}</span>
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden-input"
                />
              </div>

              {/* 연락처 편집 */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone-input">연락처</label>
                <input
                  id="phone-input"
                  type="tel"
                  className="form-input"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="action-btn cancel" onClick={onClose}>
                취소
              </button>
              <button type="button" className="action-btn save" onClick={handleSave}>
                저장하기
              </button>
            </div>
          </div>
        </div>,
        dialogRoot
      )}

      {/* 크롭 다이얼로그 */}
      {cropImageSrc && (
        <ImageCropDialog
          open={isCropOpen}
          imageSrc={cropImageSrc}
          onClose={() => {
            setIsCropOpen(false);
            setCropImageSrc(undefined);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}
