'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone,
  Mail,
  RotateCcw,
  Save,
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useWebPush } from '@/hooks/useWebPush';
import AdminService from '@/api/service/AdminService';
import AppNotificationService from '@/api/service/AppNotificationService';
import '../ManageLayout.scss';

const DEFAULT_SETTINGS: SystemSettings = {
  contactPhone: '010-6761-7665',
  contactEmail: 'minkyu0026@nate.com',
  noticeVisible: true,
  noticeTitle: '현장 사진 촬영 및 보고서 작성 지침 안내',
  noticeContent: '작업 전/후 사진은 가이드라인 안내선에 맞추어 선명하게 촬영해 주시기 바라며, 작업 확인 완료된 세대는 임의 수정이 불가하오니 제출 전 확인자 서명 및 기재사항을 꼼꼼히 확인 바랍니다.',
  noticeDate: '2026.09.02',
};

const DEFAULT_PUSH_SETTINGS: UserNotificationSetting = {
  notifyWebPush: false,
  notifyNewReport: true,
  notifyNewInquiry: true,
  notifyReportStatus: true,
  notifyInquiryAnswer: true,
};

export default function ManageSettings() {
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [pushSettings, setPushSettings] = useState<UserNotificationSetting>(DEFAULT_PUSH_SETTINGS);
  const [isSavingNotice, setIsSavingNotice] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);

  const {
    permission,
    isSubscribed,
    isLoading: isPushLoading,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = useWebPush();
  const [isTesting, setIsTesting] = useState(false);

  // 초기 설정 데이터 DB에서 로드
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const [loadedSettings, loadedPush] = await Promise.all([
          AdminService.getSettings().catch(err => {
            console.error('[ManageSettings] getSettings error:', err);
            return null;
          }),
          AppNotificationService.getUserNotificationSettings().catch(err => {
            console.error('[ManageSettings] getUserNotificationSettings error:', err);
            return null;
          }),
        ]);

        if (isMounted) {
          if (loadedSettings) {
            setSettings(prev => ({ ...prev, ...loadedSettings }));
          }
          if (loadedPush) {
            setPushSettings(prev => ({ ...prev, ...loadedPush }));
          }
        }
      } catch (err) {
        console.error('[ManageSettings] Initialization error:', err);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const isMasterActive = Boolean(pushSettings.notifyWebPush && isSubscribed);

  const handleWebPushMasterToggle = async () => {
    const nextVal = !isMasterActive;
    if (nextVal) {
      try {
        const success = await subscribe();
        if (success) {
          const needTurnOnSub = !pushSettings.notifyNewReport && !pushSettings.notifyNewInquiry;
          const updated: UserNotificationSetting = {
            ...pushSettings,
            notifyWebPush: true,
            notifyNewReport: needTurnOnSub ? true : pushSettings.notifyNewReport,
            notifyNewInquiry: needTurnOnSub ? true : pushSettings.notifyNewInquiry,
          };
          setPushSettings(updated);
          await AppNotificationService.updateUserNotificationSettings(updated);
          enqueueSnackbar('웹 브라우저 푸시 알림이 활성화되었습니다.', { variant: 'success', autoHideDuration: 2000 });
        } else {
          enqueueSnackbar('푸시 알림 권한이 허용되지 않았습니다. 브라우저 주소창에서 권한을 확인해주세요.', { variant: 'warning' });
        }
      } catch (err: any) {
        enqueueSnackbar(err?.message || '푸시 알림 구독 중 오류가 발생했습니다.', { variant: 'error' });
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

  const handleTestPush = async () => {
    setIsTesting(true);
    try {
      await sendTestNotification();
      enqueueSnackbar('테스트 알림이 성공적으로 발송되었습니다.', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('테스트 알림 발송 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsTesting(false);
    }
  };

  const handlePushToggle = async (key: 'notifyNewReport' | 'notifyNewInquiry', label: string) => {
    const nextVal = !pushSettings[key];
    const previous = pushSettings[key];
    setPushSettings(prev => ({ ...prev, [key]: nextVal }));

    try {
      await AppNotificationService.updateUserNotificationSettings({ [key]: nextVal });
      enqueueSnackbar(`${label} 설정이 ${nextVal ? '활성화' : '비활성화'}되었습니다.`, { 
        variant: 'success',
        autoHideDuration: 2000
      });
    } catch (err) {
      console.error('[ManageSettings] updateUserNotificationSettings error:', err);
      setPushSettings(prev => ({ ...prev, [key]: previous }));
      enqueueSnackbar('알림 설정 저장 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleNoticeVisibleToggle = async () => {
    const nextVal = !settings.noticeVisible;
    const previous = settings.noticeVisible;
    setSettings(prev => ({ ...prev, noticeVisible: nextVal }));

    try {
      await AdminService.updateSettings({ noticeVisible: nextVal });
      enqueueSnackbar(`현장 안내사항 노출이 ${nextVal ? '활성화' : '비활성화'}되었습니다.`, { 
        variant: 'success',
        autoHideDuration: 2000
      });
    } catch (err) {
      console.error('[ManageSettings] updateSettings noticeVisible error:', err);
      setSettings(prev => ({ ...prev, noticeVisible: previous }));
      enqueueSnackbar('안내사항 노출 설정 저장 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleTextChange = (key: keyof SystemSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveContact = async () => {
    setIsSavingContact(true);
    try {
      await AdminService.updateSettings({
        contactPhone: settings.contactPhone,
        contactEmail: settings.contactEmail,
      });
      enqueueSnackbar('고객지원 및 비상 연락처가 저장되었습니다.', { variant: 'success', autoHideDuration: 2000 });
    } catch (err) {
      console.error('[ManageSettings] updateSettings contact error:', err);
      enqueueSnackbar('연락처 저장 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleResetNotice = async () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}.${mm}.${dd}`;

    const resetData: Partial<SystemSettings> = {
      noticeTitle: DEFAULT_SETTINGS.noticeTitle,
      noticeContent: DEFAULT_SETTINGS.noticeContent,
      noticeDate: today,
      noticeVisible: DEFAULT_SETTINGS.noticeVisible,
    };

    try {
      await AdminService.updateSettings(resetData);
      setSettings(prev => ({
        ...prev,
        ...resetData,
      }));
      enqueueSnackbar('현장 안내사항이 기본 문구로 복원되었습니다.', { variant: 'info' });
    } catch (e) {
      console.error('[ManageSettings] resetNotice error:', e);
      enqueueSnackbar('기본 문구 복원 중 오류가 발생했습니다.', { variant: 'error' });
    }
  };

  const handleSaveNotice = async () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}.${mm}.${dd}`;

    setIsSavingNotice(true);
    try {
      await AdminService.updateSettings({
        noticeTitle: settings.noticeTitle,
        noticeContent: settings.noticeContent,
        noticeDate: today,
        noticeVisible: settings.noticeVisible,
      });
      setSettings(prev => ({
        ...prev,
        noticeDate: today,
      }));
      enqueueSnackbar(`현장 안내사항이 저장되었습니다. (게시일: ${today})`, { variant: 'success' });
    } catch (e) {
      console.error('[ManageSettings] saveNotice error:', e);
      enqueueSnackbar('안내사항 저장 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsSavingNotice(false);
    }
  };

  return (
    <div className="manage-settings-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-header-row">
        <div>
          <h2>시스템 설정</h2>
          <p>고객지원 대표 연락처, 현장 안내사항 및 실시간 웹 푸시 알림 환경을 관리합니다.</p>
        </div>
      </div>

      <div className="settings-container-form">
        <div className="settings-layout-grid">
          
          {/* ── LEFT COLUMN: CUSTOMER SUPPORT & EMERGENCY CONTACT ── */}
          <div className="settings-card system-info-card">
            <h3>
              <span>고객지원 / 비상 연락처</span>
            </h3>

            <div className="form-group">
              <label>대표 전화번호</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input 
                  type="tel" 
                  value={settings.contactPhone}
                  onChange={e => handleTextChange('contactPhone', e.target.value)}
                  onBlur={handleSaveContact}
                  placeholder="예: 02-839-2119" 
                />
              </div>
            </div>

            <div className="form-group">
              <label>문의 및 지원 이메일</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email" 
                  value={settings.contactEmail}
                  onChange={e => handleTextChange('contactEmail', e.target.value)}
                  onBlur={handleSaveContact}
                  placeholder="예: support@gneworks.com" 
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: WEB PUSH NOTIFICATION SETTINGS (TREE HIERARCHY) ── */}
          <div className="settings-card notification-settings-card">
            <div className="card-header-with-badge">
              <h3>
                <span>웹 푸시 알림 설정</span>
              </h3>
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
                <strong>알림 권한 차단됨</strong>: 브라우저 주소창 좌측의 설정/자물쇠 아이콘을 클릭하여 알림 권한을 '허용'으로 변경한 후 페이지를 새로고침해 주세요.
              </div>
            )}

            <div className="setting-toggle-list">
              {/* 상위 마스터 스위치 */}
              <div className="setting-toggle-item">
                <div className="toggle-info">
                  <strong>웹 브라우저 푸시 알림 활성화</strong>
                  <p>관리자 대시보드 접속 중 및 백그라운드 환경에서 실시간 웹 푸시 알림을 수신합니다.</p>
                </div>
                <label className="custom-switch-label">
                  <input 
                    type="checkbox" 
                    checked={isMasterActive} 
                    onChange={handleWebPushMasterToggle}
                    disabled={isPushLoading || permission === 'denied' || permission === 'unsupported'}
                  />
                  <span className="switch-slider" />
                </label>
              </div>

              {/* 하위 종속 알림 그룹 */}
              <div className={`setting-sub-group ${!isMasterActive ? 'is-disabled' : ''}`}>
                <div className="setting-toggle-item">
                  <div className="toggle-info">
                    <strong>신규 작업 보고서 제출 알림</strong>
                    <p>설치 작업자가 현장에서 확인서를 신규 제출하면 관리자에게 실시간 알림을 보냅니다.</p>
                  </div>
                  <label className="custom-switch-label">
                    <input 
                      type="checkbox" 
                      checked={isMasterActive && pushSettings.notifyNewReport} 
                      onChange={() => handlePushToggle('notifyNewReport', '신규 보고서 제출 알림')} 
                      disabled={!isMasterActive}
                    />
                    <span className="switch-slider" />
                  </label>
                </div>

                <div className="setting-toggle-item">
                  <div className="toggle-info">
                    <strong>신규 업무 문의 접수 알림</strong>
                    <p>포탈에서 기술 지원이나 현장 업무 문의가 새로 접수되었을 때 알림을 보냅니다.</p>
                  </div>
                  <label className="custom-switch-label">
                    <input 
                      type="checkbox" 
                      checked={isMasterActive && pushSettings.notifyNewInquiry} 
                      onChange={() => handlePushToggle('notifyNewInquiry', '신규 문의 접수 알림')} 
                      disabled={!isMasterActive}
                    />
                    <span className="switch-slider" />
                  </label>
                </div>
              </div>

              {/* 테스트 알림 발송 영역 */}
              <div className="test-push-block">
                <button
                  type="button"
                  className="btn-test-push"
                  onClick={handleTestPush}
                  disabled={isTesting || !isMasterActive}
                  title={!isMasterActive ? '웹 푸시 알림 활성화 후 테스트가 가능합니다.' : '현재 브라우저로 테스트 알림 발송'}
                >
                  <Bell size={14} />
                  <span>{isTesting ? '발송 중...' : '테스트 알림 발송'}</span>
                </button>
                <span className="test-push-desc">
                  현재 브라우저로 실제 웹 푸시를 발송하여 알림창 수신을 점검합니다.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FULL-WIDTH ROW: PORTAL ON-SITE NOTICE SETTINGS ── */}
        <div className="settings-card notice-settings-card">
          <div className="card-header-with-action">
            <h3>
              <span>현장 안내사항 관리</span>
            </h3>
            <div className="header-switch-wrap">
              <span className={`status-badge ${settings.noticeVisible ? 'active' : 'inactive'}`}>
                {settings.noticeVisible ? '노출 중' : '숨김 상태'}
              </span>
              <label className="custom-switch-label" title="페이지 안내사항 표시 여부">
                <input 
                  type="checkbox" 
                  checked={settings.noticeVisible} 
                  onChange={handleNoticeVisibleToggle} 
                />
                <span className="switch-slider" />
              </label>
            </div>
          </div>

          <div className="notice-form-body">
            <div className="form-group">
              <label>안내사항 제목</label>
              <input 
                type="text" 
                value={settings.noticeTitle} 
                onChange={e => handleTextChange('noticeTitle', e.target.value)} 
                placeholder="현장 안내사항 제목을 입력하세요"
              />
            </div>

            <div className="form-group">
              <label>안내 상세 내용</label>
              <textarea 
                rows={4} 
                value={settings.noticeContent} 
                onChange={e => handleTextChange('noticeContent', e.target.value)} 
                placeholder="현장 설치 작업자에게 전달할 필수 지침 및 공지사항을 입력하세요."
              />
            </div>

            <div className="notice-actions">
              <button 
                type="button" 
                className="btn-reset" 
                onClick={handleResetNotice}
                disabled={isSavingNotice}
                title="기본 안내사항 문구로 초기화"
              >
                <RotateCcw size={14} /> 기본 문구 복원
              </button>
              <button 
                type="button" 
                className="btn-save" 
                onClick={handleSaveNotice}
                disabled={isSavingNotice}
              >
                <Save size={14} /> {isSavingNotice ? '저장 중...' : '안내사항 저장'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
