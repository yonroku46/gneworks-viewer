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
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import UserAvatar from '@/components/common/UserAvatar';
import { useWebPush } from '@/hooks/useWebPush';
import AppNotificationService from '@/api/service/AppNotificationService';
import './Profile.scss';

const DEFAULT_WORKER_PUSH_SETTINGS: UserNotificationSetting = {
  notifyWebPush: false,
  notifyNewReport: false,
  notifyNewInquiry: false,
  notifyReportStatus: true,
  notifyInquiryAnswer: true,
};

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const {
    permission,
    isSubscribed,
    isLoading: isPushLoading,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = useWebPush();

  const [pushSettings, setPushSettings] = useState<UserNotificationSetting>(DEFAULT_WORKER_PUSH_SETTINGS);
  const [isTestingPush, setIsTestingPush] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AppNotificationService.getUserNotificationSettings()
      .then(settings => {
        if (isMounted && settings) {
          setPushSettings(prev => ({ ...prev, ...settings }));
        }
      })
      .catch(err => {
        console.error('[ProfilePage] getUserNotificationSettings error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isMasterActive = Boolean(pushSettings.notifyWebPush && isSubscribed);

  const handleWorkerPushToggle = async () => {
    const nextVal = !isMasterActive;
    if (nextVal) {
      try {
        const success = await subscribe();
        if (success) {
          const needTurnOnSub = !pushSettings.notifyReportStatus && !pushSettings.notifyInquiryAnswer;
          const updated: UserNotificationSetting = {
            ...pushSettings,
            notifyWebPush: true,
            notifyReportStatus: needTurnOnSub ? true : pushSettings.notifyReportStatus,
            notifyInquiryAnswer: needTurnOnSub ? true : pushSettings.notifyInquiryAnswer,
          };
          setPushSettings(updated);
          await AppNotificationService.updateUserNotificationSettings(updated);
          enqueueSnackbar('웹 브라우저 푸시 알림이 활성화되었습니다.', { variant: 'success', autoHideDuration: 2000 });
        } else {
          enqueueSnackbar('알림 권한이 허용되지 않았습니다. 브라우저 설정에서 권한을 확인해주세요.', { variant: 'warning' });
        }
      } catch (err: any) {
        enqueueSnackbar(err?.message || '알림 활성화 중 오류가 발생했습니다.', { variant: 'error' });
      }
    } else {
      try {
        await unsubscribe();
      } catch (err) {
        console.error(err);
      } finally {
        const updated = { ...pushSettings, notifyWebPush: false };
        setPushSettings(updated);
        await AppNotificationService.updateUserNotificationSettings({ notifyWebPush: false }).catch(console.error);
        enqueueSnackbar('웹 브라우저 푸시 알림이 비활성화되었습니다.', { variant: 'info', autoHideDuration: 2000 });
      }
    }
  };

  const handleSubToggle = async (key: 'notifyReportStatus' | 'notifyInquiryAnswer', label: string) => {
    const nextVal = !pushSettings[key];
    const previous = pushSettings[key];
    setPushSettings(prev => ({ ...prev, [key]: nextVal }));

    try {
      await AppNotificationService.updateUserNotificationSettings({ [key]: nextVal });
      enqueueSnackbar(`${label} 설정이 ${nextVal ? '활성화' : '비활성화'}되었습니다.`, { variant: 'success', autoHideDuration: 2000 });
    } catch (err) {
      console.error('[ProfilePage] updateUserNotificationSettings error:', err);
      setPushSettings(prev => ({ ...prev, [key]: previous }));
      enqueueSnackbar('설정 저장 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleTestPush = async () => {
    setIsTestingPush(true);
    try {
      await sendTestNotification();
      enqueueSnackbar('테스트 알림이 발송되었습니다.', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('테스트 알림 발송 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsTestingPush(false);
    }
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isRegionAssignOpen, setIsRegionAssignOpen] = useState(false);

  // Sites & Regions state synchronized with Backend API
  const [allSites, setAllSites] = useState<SiteDetail[]>([]);
  const [assignedRegions, setAssignedRegions] = useState<UserAssignedRegionDetail[]>([]);
  const [reportSummary, setReportSummary] = useState<WorkerReportSummary>({
    totalReports: 0,
    todayReports: 0,
    pendingReports: 0,
    rejectedReports: 0,
    completedReports: 0,
    issueReportsCount: 0,
  });

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

  const fetchReportSummary = useCallback(async () => {
    try {
      const data = await PortalService.getMyReportSummary();
      if (data) {
        setReportSummary(data);
      }
    } catch (error) {
      console.error('[ProfilePage] getMyReportSummary error', error);
    }
  }, []);

  useEffect(() => {
    fetchAssignedRegions();
    fetchSites();
    fetchReportSummary();
  }, [fetchAssignedRegions, fetchSites, fetchReportSummary]);

  const completedCount = reportSummary.completedReports;
  const pendingCount = reportSummary.pendingReports;
  const reviseCount = reportSummary.rejectedReports;
  const totalReportsCount = reportSummary.totalReports;

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
              <span className="num-val">{totalReportsCount}</span>
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

      {/* ── 웹 푸시 알림 설정 카드 ── */}
      <div className="worker-notification-card">
        <div className="card-header-row">
          <div className="header-title-group">
            <span>웹 푸시 알림 설정</span>
          </div>
          {permission === 'granted' && (
            <span className="push-status-badge granted" title="실시간 웹 푸시를 수신할 수 있습니다.">
              <CheckCircle2 size={12} /> 권한 허용됨
            </span>
          )}
          {permission === 'denied' && (
            <span className="push-status-badge denied" title="브라우저 설정에서 알림이 차단되어 있습니다.">
              <XCircle size={12} /> 권한 차단됨
            </span>
          )}
          {permission === 'default' && (
            <span className="push-status-badge default" title="토글을 켜면 브라우저 권한을 요청합니다.">
              <AlertTriangle size={12} /> 권한 미설정
            </span>
          )}
          {permission === 'unsupported' && (
            <span className="push-status-badge unsupported">
              미지원 브라우저
            </span>
          )}
        </div>

        {permission === 'denied' && (
          <div className="push-denied-guide">
            <strong>알림 권한 차단됨</strong>: 브라우저 주소창 좌측의 설정/자물쇠 아이콘을 클릭하여 알림 권한을 '허용'으로 변경해 주세요.
          </div>
        )}

        <div className="notification-toggle-list">
          <div className="toggle-item">
            <div className="toggle-text">
              <strong>웹 브라우저 푸시 알림</strong>
              <p>보고서 상태 변경 및 문의 답변 소식을 실시간 알림으로 수신합니다.</p>
            </div>
            <label className="custom-switch-label">
              <input
                type="checkbox"
                checked={isMasterActive}
                onChange={handleWorkerPushToggle}
                disabled={isPushLoading || permission === 'denied' || permission === 'unsupported'}
              />
              <span className="switch-slider" />
            </label>
          </div>

          <div className={`sub-toggle-group ${!isMasterActive ? 'is-disabled' : ''}`}>
            <div className="toggle-item">
              <div className="toggle-text">
                <strong>보고서 상태 변경 알림</strong>
                <p>제출한 작업 보고서의 관리자 확인완료(승인) 또는 반려 시 알림을 받습니다.</p>
              </div>
              <label className="custom-switch-label">
                <input
                  type="checkbox"
                  checked={isMasterActive && pushSettings.notifyReportStatus}
                  onChange={() => handleSubToggle('notifyReportStatus', '보고서 상태 변경 알림')}
                  disabled={!isMasterActive}
                />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-text">
                <strong>문의사항 답변 등록 알림</strong>
                <p>등록한 1:1 업무 문의에 관리자 답변이 등록되었을 때 알림을 받습니다.</p>
              </div>
              <label className="custom-switch-label">
                <input
                  type="checkbox"
                  checked={isMasterActive && pushSettings.notifyInquiryAnswer}
                  onChange={() => handleSubToggle('notifyInquiryAnswer', '문의사항 답변 알림')}
                  disabled={!isMasterActive}
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>
        </div>

        <div className="test-push-row">
          <button
            type="button"
            className="btn-test-push"
            onClick={handleTestPush}
            disabled={isTestingPush || !isMasterActive}
            title={!isMasterActive ? '웹 푸시 알림 활성화 후 테스트가 가능합니다.' : '현재 브라우저로 테스트 알림 발송'}
          >
            <Bell size={14} />
            <span>{isTestingPush ? '발송 중...' : '테스트 알림 발송'}</span>
          </button>
          <span className="test-push-desc">
            현재 사용 중인 브라우저로 실제 웹 푸시를 발송하여 알림 수신 상태를 테스트합니다.
          </span>
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
