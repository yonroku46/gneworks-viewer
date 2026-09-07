'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from 'notistack';
import ProfileEditDialog from '@/components/dialog/ProfileEditDialog';
import PasswordChangeDialog from '@/components/dialog/PasswordChangeDialog';
import RegionAssignDialog from '@/components/dialog/RegionAssignDialog';
import PortalService from '@/api/service/PortalService';
import { isRegionMatch } from '@/common/utils/regionUtils';
import { 
  LogOut, 
  Settings,
  Plus, 
  MapPin,
} from 'lucide-react';
import UserAvatar from '@/components/common/UserAvatar';
import './Profile.scss';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isRegionAssignOpen, setIsRegionAssignOpen] = useState(false);

  // Sites & Regions state synchronized with Backend API
  const [allSites, setAllSites] = useState<SiteDetail[]>([]);
  const [assignedRegions, setAssignedRegions] = useState<UserAssignedRegionDetail[]>([]);
  const [reports] = useState<WorkReport[]>([]);

  const fetchAssignedRegions = useCallback(async () => {
    try {
      const data = await PortalService.getAssignedRegions();
      setAssignedRegions(data || []);
    } catch (error) {
      console.error('[ProfilePage] getAssignedRegions error', error);
    }
  }, []);

  const fetchSites = useCallback(async () => {
    try {
      const data = await PortalService.getSites();
      setAllSites(data || []);
    } catch (error) {
      console.error('[ProfilePage] getSites error', error);
    }
  }, []);

  useEffect(() => {
    fetchAssignedRegions();
    fetchSites();
  }, [fetchAssignedRegions, fetchSites]);

  const completedCount = reports.filter(r => r.status === 'COMPLETED').length;
  const pendingCount = reports.filter(r => r.status === 'PENDING').length;
  const reviseCount = reports.filter(r => r.status === 'REJECTED').length;

  const displayName = user?.userName || '사용자';

  const handleSaveProfile = async (data: { profileImg?: string; phoneNum?: string }) => {
    try {
      const updatedUser = await PortalService.updateProfile(data);
      updateUser({
        phoneNum: updatedUser.phoneNum,
        profileImg: updatedUser.profileImg,
      });
      enqueueSnackbar('프로필 정보가 저장되었습니다.', { variant: 'success' });
    } catch (error) {
      console.error('[ProfilePage] updateProfile error', error);
      enqueueSnackbar('프로필 정보 수정에 실패했습니다.', { variant: 'error' });
    }
  };

  const handleAssignRegion = async (sido: string, sigungu: string, regionId?: string) => {
    try {
      await PortalService.assignRegion(sido, sigungu, regionId);
      await fetchAssignedRegions();
      enqueueSnackbar(`${sido} ${sigungu}이(가) 담당 지역으로 등록되었습니다.`, { variant: 'success' });
    } catch (error) {
      console.error('[ProfilePage] assignRegion error', error);
      enqueueSnackbar('담당 지역 배정에 실패했습니다.', { variant: 'error' });
    }
  };

  const handleRemoveRegion = async (region: UserAssignedRegionDetail) => {
    const targetId = region.regionId || region.assignedRegionId;
    if (!targetId) {
      enqueueSnackbar('지역 정보가 올바르지 않습니다.', { variant: 'error' });
      return;
    }
    try {
      await PortalService.unassignRegion(targetId);
      await fetchAssignedRegions();
      enqueueSnackbar(`${region.sido} ${region.sigungu} 배정이 해제되었습니다.`, { variant: 'info' });
    } catch (error) {
      console.error('[ProfilePage] unassignRegion error', error);
      enqueueSnackbar('담당 지역 해제에 실패했습니다.', { variant: 'error' });
    }
  };

  return (
    <div className="portal-profile-page">
      {/* ── PROFILE CARD (원래 CSS 완벽 복원) ── */}
      <div className="profile-card">
        {/* 상단 편집 버튼 */}
        <div className="profile-card-top-actions">
          <button
            type="button"
            className="btn-edit-profile"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Settings size={14} />
            <span>프로필 편집</span>
          </button>
        </div>

        {/* 아바타 */}
        <UserAvatar 
          src={user?.profileImg} 
          name={displayName} 
          size="huge" 
          className="profile-card-avatar"
        />

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

        {/* ── 누적 작업 실적 바 (무채색 & 총건수 강조) ── */}
        <div className="profile-stats-bar">
          <div className="stats-main-block">
            <span className="stats-label">총 작업건수</span>
            <div className="stats-total-num">
              <span className="num-val">{reports.length}</span>
              <span className="num-unit">건</span>
            </div>
          </div>
          <div className="stats-sub-row">
            <span className="sub-item">
              검토대기 <strong>{pendingCount}</strong>건
            </span>
            <span className="sub-sep">•</span>
            <span className="sub-item">
              반려됨 <strong>{reviseCount}</strong>건
            </span>
            <span className="sub-sep">•</span>
            <span className="sub-item">
              확인완료 <strong>{completedCount}</strong>건
            </span>
          </div>
        </div>
      </div>

      {/* ── 담당 지역 관리 카드 (심플 뷰) ── */}
      <div className="worker-sites-card">
        <div className="card-header-row">
          <div className="header-title-group">
            <span>담당 지역 관리</span>
            <span className="badge-count">{assignedRegions.length}개 지역</span>
          </div>
          <button
            type="button"
            className="btn-add-site"
            onClick={() => setIsRegionAssignOpen(true)}
          >
            <Settings size={14} />
            <span>지역 편집</span>
          </button>
        </div>

        <div className="card-content-body">
          {assignedRegions.length > 0 ? (
            <div className="assigned-sites-list">
              {assignedRegions.map(region => {
                const sitesInRegion = allSites.filter(s => {
                  if (region.regionId || s.regionId) return Boolean(region.regionId && s.regionId && s.regionId === region.regionId);
                  if (s.region) return isRegionMatch(s.sido, s.region, region.sido, region.sigungu);
                  return isRegionMatch(s.sido, s.sigungu, region.sido, region.sigungu);
                });
                const totalHouseholds = sitesInRegion.reduce(
                  (sum, s) => sum + (s.totalHouseholds ?? s.households?.length ?? 0),
                  0
                );

                return (
                  <div key={region.assignedRegionId} className="assigned-site-item">
                    <div className="item-main-info">
                      <strong className="site-name">
                        {region.sido} {region.sigungu}
                      </strong>
                      <div className="item-meta">
                        <span className="meta-dong">총 <strong>{sitesInRegion.length}</strong>개 현장</span>
                        <span className="meta-divider">•</span>
                        <span className="meta-households">총 <strong>{totalHouseholds}</strong>세대</span>
                      </div>
                    </div>

                    {region.assignedDate && (
                      <span className="assigned-date-badge">
                        {region.assignedDate} 등록
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="assigned-empty-box">
              <MapPin size={32} className="empty-icon" />
              <p className="empty-title">현재 배정된 담당 지역이 없습니다.</p>
              <p className="empty-desc">
                [담당 지역 설정] 버튼을 눌러 작업하실 지역을 등록하세요.
              </p>
              <button
                type="button"
                className="btn-empty-add"
                onClick={() => setIsRegionAssignOpen(true)}
              >
                <Plus size={14} />
                <span>담당 지역 설정하기</span>
              </button>
            </div>
          )}
        </div>
      </div>


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
        onOpenPasswordChange={() => {
          setIsEditDialogOpen(false);
          setIsPasswordDialogOpen(true);
        }}
      />

      {/* 비밀번호 변경 다이얼로그 */}
      <PasswordChangeDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />

      {/* 담당 지역 배정 다이얼로그 */}
      <RegionAssignDialog
        isOpen={isRegionAssignOpen}
        onClose={() => setIsRegionAssignOpen(false)}
        assignedRegions={assignedRegions}
        sites={allSites}
        mode="portal"
        onAssignRegion={handleAssignRegion}
        onUnassignRegion={handleRemoveRegion}
      />
    </div>
  );
}
