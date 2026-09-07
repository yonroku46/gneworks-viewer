'use client';

import React, { useState, useEffect, useRef } from 'react';
import SlideDialog from './SlideDialog';
import { Camera, KeyRound, ChevronRight } from 'lucide-react';
import ImageCropDialog from './ImageCropDialog';
import UserAvatar from '@/components/common/UserAvatar';
import { formatPhoneNumber } from '@/utils/formatUtils';
import './ProfileEditDialog.scss';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhoto?: string;
  initialPhone?: string;
  userName?: string;
  onSave: (data: { profileImg?: string; phoneNum?: string }) => void;
  onOpenPasswordChange?: () => void;
}

export default function ProfileEditDialog({
  isOpen,
  onClose,
  initialPhoto = '',
  initialPhone = '',
  userName = '사용자',
  onSave,
  onOpenPasswordChange,
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

  return (
    <>
      <SlideDialog
        isOpen={isOpen}
        onClose={onClose}
        title="프로필 정보 수정"
        className="profile-edit-slide-dialog"
        footer={
          <div className="profile-edit-footer-btns">
            <button type="button" className="btn-cancel" onClick={onClose}>
              취소
            </button>
            <button type="button" className="btn-save" onClick={handleSave}>
              저장하기
            </button>
          </div>
        }
      >
        <div className="profile-edit-body">
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

          {onOpenPasswordChange && (
            <div className="security-section">
              <span className="section-title">계정 보안</span>
              <button
                type="button"
                className="security-nav-tile"
                onClick={onOpenPasswordChange}
              >
                <div className="tile-icon-box">
                  <KeyRound size={18} />
                </div>
                <div className="tile-texts">
                  <strong className="tile-title">비밀번호 변경</strong>
                  <span className="tile-sub">새로운 비밀번호로 계정을 보호하세요.</span>
                </div>
                <ChevronRight size={18} className="tile-arrow" />
              </button>
            </div>
          )}
        </div>
      </SlideDialog>

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
