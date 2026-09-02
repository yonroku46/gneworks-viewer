'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from 'notistack';
import ProfileEditDialog from '@/components/dialog/ProfileEditDialog';
import RegionAssignDialog from '@/components/dialog/RegionAssignDialog';
import { SiteInfo } from '@/data/siteData';
import { getStoredSites, subscribeToSitesUpdate } from '@/data/siteStorage';
import {
  AssignedRegion,
  getStoredAssignedRegions,
  addAssignedRegion,
  removeAssignedRegion,
  subscribeToAssignedRegionsUpdate,
} from '@/data/regionStorage';
import {
  getStoredReports,
  subscribeToReportsUpdate,
} from '@/data/reportStorage';

import { 
  LogOut, 
  Settings,
  Plus, 
  MapPin,
} from 'lucide-react';
import './Profile.scss';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRegionAssignOpen, setIsRegionAssignOpen] = useState(false);

  // Sites, Regions & Reports state synchronized with storage
  const [allSites, setAllSites] = useState<SiteInfo[]>([]);
  const [assignedRegions, setAssignedRegions] = useState<AssignedRegion[]>([]);
  const [reports, setReports] = useState<WorkReport[]>([]);

  useEffect(() => {
    setAllSites(getStoredSites());
    setAssignedRegions(getStoredAssignedRegions());
    setReports(getStoredReports());

    const unsubSites = subscribeToSitesUpdate(sites => setAllSites(sites));
    const unsubRegions = subscribeToAssignedRegionsUpdate(regions => setAssignedRegions(regions));
    const unsubReports = subscribeToReportsUpdate(reps => setReports(reps));

    return () => {
      unsubSites();
      unsubRegions();
      unsubReports();
    };
  }, []);

  const completedCount = reports.filter(r => r.status === 'COMPLETED').length;
  const pendingCount = reports.filter(r => r.status === 'PENDING').length;
  const reviseCount = reports.filter(r => r.status === 'REJECTED').length;

  const displayName = user?.userName || '사용자';

  const handleSaveProfile = (data: { profileImg?: string; phoneNum?: string }) => {
    updateUser(data);
    enqueueSnackbar('프로필 정보가 저장되었습니다.', { variant: 'success' });
  };

  const handleAssignRegion = (sido: string, sigungu: string) => {
    const updated = addAssignedRegion(sido, sigungu);
    setAssignedRegions(updated);
    enqueueSnackbar(`${sido} ${sigungu}이(가) 담당 지역으로 등록되었습니다.`, { variant: 'success' });
  };

  const handleRemoveRegion = (region: AssignedRegion) => {
    const updated = removeAssignedRegion(region.id);
    setAssignedRegions(updated);
    enqueueSnackbar(`${region.sido} ${region.sigungu} 배정이 해제되었습니다.`, { variant: 'info' });
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
                const sitesInRegion = allSites.filter(
                  s => s.sido === region.sido && s.sigungu === region.sigungu
                );
                const totalHouseholds = sitesInRegion.reduce(
                  (sum, s) => sum + (s.totalHouseholds || s.households.length),
                  0
                );

                return (
                  <div key={region.id} className="assigned-site-item">
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
      />


      {/* 담당 지역 배정 다이얼로그 */}
      <RegionAssignDialog
        isOpen={isRegionAssignOpen}
        onClose={() => setIsRegionAssignOpen(false)}
        assignedRegions={assignedRegions}
        onAssignRegion={handleAssignRegion}
        onUnassignRegion={handleRemoveRegion}
      />
    </div>
  );
}
