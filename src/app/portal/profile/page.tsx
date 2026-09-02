'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from 'notistack';
import ProfileEditDialog from '@/components/dialog/ProfileEditDialog';
import SignatureDialog from '@/components/dialog/SignatureDialog';
import SiteAssignDialog from '@/components/dialog/SiteAssignDialog';
import { SiteInfo, getSiteWorkers } from '@/data/siteData';
import { getStoredSites, assignSiteToWorker, unassignSite, subscribeToSitesUpdate } from '@/data/siteStorage';
import { 
  LogOut, 
  Headphones, 
  ArrowRight, 
  UserCog, 
  FileSignature, 
  Trash2, 
  Building2, 
  Plus, 
  MapPin, 
  X, 
  Layers
} from 'lucide-react';
import './Profile.scss';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isSiteAssignOpen, setIsSiteAssignOpen] = useState(false);

  // Sites state synchronized with storage
  const [allSites, setAllSites] = useState<SiteInfo[]>([]);

  useEffect(() => {
    setAllSites(getStoredSites());
    const unsub = subscribeToSitesUpdate(sites => setAllSites(sites));
    return () => unsub();
  }, []);

  const displayName = user?.userName || '사용자';

  // Current worker's assigned sites (multi-worker support)
  const myAssignedSites = useMemo(() => {
    if (!user?.userId) return [];
    return allSites.filter(s => getSiteWorkers(s).some(w => w.userId === user.userId));
  }, [allSites, user?.userId]);

  const handleSaveProfile = (data: { profileImg?: string; phoneNum?: string }) => {
    updateUser(data);
    enqueueSnackbar('프로필 정보가 저장되었습니다.', { variant: 'success' });
  };

  const handleSaveSignature = (signatureDataUrl: string) => {
    updateUser({ signatureImg: signatureDataUrl });
    enqueueSnackbar('보고서용 전자서명이 저장되었습니다.', { variant: 'success' });
  };

  const handleDeleteSignature = () => {
    updateUser({ signatureImg: '' });
    enqueueSnackbar('전자서명이 삭제되었습니다.', { variant: 'info' });
  };

  const handleAssignSite = (site: SiteInfo) => {
    if (!user) return;
    assignSiteToWorker(site.id, {
      userId: user.userId,
      userName: user.userName,
      phoneNum: user.phoneNum,
    });
    enqueueSnackbar(`[${site.name}] 현장이 담당 현장으로 배정되었습니다.`, { variant: 'success' });
    setIsSiteAssignOpen(false);
  };

  const handleUnassignSite = (site: SiteInfo) => {
    if (!user?.userId) return;
    if (confirm(`[${site.name}] 현장의 담당 배정을 해제하시겠습니까?`)) {
      unassignSite(site.id, user.userId);
      enqueueSnackbar(`[${site.name}] 현장 배정이 해제되었습니다.`, { variant: 'info' });
    }
  };

  return (
    <div className="portal-profile-page">
      <div className="profile-card">
        {/* 상단 편집 버튼 */}
        <div className="profile-card-top-actions">
          <button
            type="button"
            className="btn-edit-profile"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <UserCog size={15} />
            <span>프로필 편집</span>
          </button>
        </div>

        {/* 아바타 */}
        <div className="avatar-wrapper">
          {user?.profileImg ? (
            <img src={user.profileImg} alt={displayName} className="avatar-img" />
          ) : (
            displayName.charAt(0)
          )}
        </div>

        <h2 className="profile-name">{displayName}</h2>

        <div className="profile-info-list">
          <div className="info-item">
            <span className="info-label">아이디</span>
            <span className="info-value">{user?.userId || '-'}</span>
          </div>

          <div className="info-item">
            <span className="info-label">연락처</span>
            <span className="info-value">{user?.phoneNum || '연락처 미등록'}</span>
          </div>
        </div>
      </div>

      {/* ── 내 담당 현장 관리 카드 ── */}
      <div className="worker-sites-card">
        <div className="card-header-row">
          <div className="header-title-group">
            <Building2 size={18} />
            <span>내 담당 현장 관리</span>
            <span className="badge-count">{myAssignedSites.length}개소 배정</span>
          </div>
          <button
            type="button"
            className="btn-add-site"
            onClick={() => setIsSiteAssignOpen(true)}
          >
            <Plus size={14} />
            <span>현장 배정 추가</span>
          </button>
        </div>

        <div className="card-content-body">
          {myAssignedSites.length > 0 ? (
            <div className="assigned-sites-list">
              {myAssignedSites.map(site => (
                <div key={site.id} className="assigned-site-item">
                  <div className="item-main-info">
                    <div className="item-title-row">
                      <strong className="site-name">{site.name}</strong>
                      <span className="region-chip">{site.sigungu} {site.eupmyeondong}</span>
                    </div>
                    <div className="item-address">
                      <MapPin size={13} />
                      <span>{site.address}</span>
                    </div>
                    <div className="item-meta">
                      <span className="meta-dong">단지: {site.dongCount}개 동</span>
                      <span className="meta-divider">•</span>
                      <span className="meta-households">대상: <strong>{site.totalHouseholds}</strong>세대</span>
                    </div>
                    {(() => {
                      const otherWorkers = getSiteWorkers(site).filter(w => w.userId !== user?.userId);
                      if (otherWorkers.length > 0) {
                        return (
                          <div className="item-co-workers">
                            <span className="co-label">공동 담당:</span>
                            <span className="co-names">{otherWorkers.map(w => w.userName).join(', ')}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      className="btn-unassign"
                      title="담당 배정 해제"
                      onClick={() => handleUnassignSite(site)}
                    >
                      <Trash2 size={13} />
                      <span>배정 해제</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="assigned-empty-box">
              <Building2 size={32} className="empty-icon" />
              <p className="empty-title">현재 배정된 담당 현장이 없습니다.</p>
              <p className="empty-desc">
                [현장 배정 추가] 버튼을 눌러 작업하실 현장을 직접 등록하세요.
              </p>
              <button
                type="button"
                className="btn-empty-add"
                onClick={() => setIsSiteAssignOpen(true)}
              >
                <Plus size={14} />
                <span>새 담당 현장 배정하기</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── 보고서용 전자서명 관리 카드 ── */}
      <div className="signature-card">
        <div className="signature-card-header">
          <div className="header-title-group">
            <FileSignature size={18} />
            <span>보고서용 전자서명</span>
          </div>
          <span className={`badge-status ${user?.signatureImg ? 'active' : 'empty'}`}>
            {user?.signatureImg ? '등록 완료' : '미등록'}
          </span>
        </div>

        <div className="signature-body">
          <div className="signature-preview-box">
            {user?.signatureImg ? (
              <img src={user.signatureImg} alt="등록된 전자서명" className="signature-img" />
            ) : (
              <p className="signature-empty-desc">
                등록된 전자서명이 없습니다.<br />
                서명을 등록하시면 향후 현장 작업 보고서에 자동 기입됩니다.
              </p>
            )}
          </div>

          <div className="signature-footer-actions">
            {user?.signatureImg && (
              <button
                type="button"
                className="btn-signature-action danger"
                onClick={handleDeleteSignature}
              >
                <Trash2 size={13} />
                <span>서명 삭제</span>
              </button>
            )}
            <button
              type="button"
              className="btn-signature-action primary"
              onClick={() => setIsSignatureDialogOpen(true)}
            >
              <FileSignature size={14} />
              <span>{user?.signatureImg ? '서명 변경' : '서명 등록하기'}</span>
            </button>
          </div>
        </div>
      </div>

      <Link href="/contact" className="support-section">
        <div className="support-left">
          <div className="support-icon">
            <Headphones size={22} />
          </div>
          <div className="support-text">
            <span className="support-title">시스템 지원 및 문의</span>
            <span className="support-desc">계정 정보 변경이나 작업 배정 문의가 필요하신가요?</span>
          </div>
        </div>
        <ArrowRight size={18} className="support-arrow" />
      </Link>

      <button 
        type="button" 
        className="profile-logout-btn" 
        onClick={logout}
      >
        <LogOut size={18} />
        <span>계정 로그아웃</span>
      </button>

      {/* 프로필 편집 통합 다이얼로그 */}
      <ProfileEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        initialPhoto={user?.profileImg || ''}
        initialPhone={user?.phoneNum || ''}
        userName={displayName}
        onSave={handleSaveProfile}
      />

      {/* 전자서명 등록 다이얼로그 */}
      <SignatureDialog
        isOpen={isSignatureDialogOpen}
        onClose={() => setIsSignatureDialogOpen(false)}
        onSave={handleSaveSignature}
        userName={user?.userName}
      />

      {/* 새 담당 현장 배정 다이얼로그 */}
      <SiteAssignDialog
        isOpen={isSiteAssignOpen}
        onClose={() => setIsSiteAssignOpen(false)}
        sites={allSites}
        currentUserId={user?.userId}
        onAssign={handleAssignSite}
      />
    </div>
  );
}
