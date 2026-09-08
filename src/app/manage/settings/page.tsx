'use client';

import React, { useState } from 'react';
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
import '../ManageLayout.scss';

const DEFAULT_SETTINGS: SystemSettings = {
  contactPhone: '010-6761-7665',
  contactEmail: 'minkyu0026@nate.com',
  notifyWebPush: false,
  notifyNewReport: false,
  notifyNewInquiry: false,
  noticeVisible: true,
  noticeTitle: '현장 사진 촬영 및 보고서 작성 지침 안내',
  noticeContent: '작업 전/후 사진은 가이드라인 안내선에 맞추어 선명하게 촬영해 주시기 바라며, 작업 확인 완료된 세대는 임의 수정이 불가하오니 제출 전 확인자 서명 및 기재사항을 꼼꼼히 확인 바랍니다.',
  noticeDate: '2026.09.02',
  visible: true,
};

const STORAGE_KEY = 'gneworks_manage_system_settings';

export default function ManageSettings() {
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<SystemSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            notifyWebPush: parsed.notifyWebPush ?? DEFAULT_SETTINGS.notifyWebPush,
            notifyNewReport: parsed.notifyNewReport ?? DEFAULT_SETTINGS.notifyNewReport,
            notifyNewInquiry: parsed.notifyNewInquiry ?? parsed.notifyFixReport ?? DEFAULT_SETTINGS.notifyNewInquiry,
            noticeVisible: parsed.noticeVisible ?? DEFAULT_SETTINGS.noticeVisible,
            noticeTitle: parsed.noticeTitle ?? DEFAULT_SETTINGS.noticeTitle,
            noticeContent: parsed.noticeContent ?? DEFAULT_SETTINGS.noticeContent,
            noticeDate: parsed.noticeDate ?? DEFAULT_SETTINGS.noticeDate,
          };
        }
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  const {
    permission,
    isSubscribed,
    isLoading: isPushLoading,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = useWebPush();
  const [isTesting, setIsTesting] = useState(false);

  const isMasterActive = Boolean(settings.notifyWebPush && isSubscribed);

  const handleWebPushMasterToggle = async () => {
    const nextVal = !isMasterActive;
    if (nextVal) {
      try {
        const success = await subscribe();
        if (success) {
          setSettings(prev => {
            const needTurnOnSub = !prev.notifyNewReport && !prev.notifyNewInquiry;
            const updated = {
              ...prev,
              notifyWebPush: true,
              notifyNewReport: needTurnOnSub ? true : prev.notifyNewReport,
              notifyNewInquiry: needTurnOnSub ? true : prev.notifyNewInquiry,
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (e) {
              console.error(e);
            }
            return updated;
          });
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
        setSettings(prev => {
          const updated = { ...prev, notifyWebPush: false };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
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

  const handleToggle = (key: keyof SystemSettings, label?: string) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        if (label) {
          enqueueSnackbar(`${label} 설정이 ${updated[key] ? '활성화' : '비활성화'}되었습니다.`, { 
            variant: 'success',
            autoHideDuration: 2000
          });
        }
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleTextChange = (key: keyof SystemSettings, value: string) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleResetNotice = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}.${mm}.${dd}`;

    setSettings(prev => {
      const updated = {
        ...prev,
        noticeTitle: DEFAULT_SETTINGS.noticeTitle,
        noticeContent: DEFAULT_SETTINGS.noticeContent,
        noticeDate: today,
        noticeVisible: DEFAULT_SETTINGS.noticeVisible,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        enqueueSnackbar('현장 안내사항이 기본 문구로 복원되었습니다.', { variant: 'info', autoHideDuration: 2000 });
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleSaveNotice = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}.${mm}.${dd}`;

    const updated = {
      ...settings,
      noticeDate: today
    };
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      enqueueSnackbar(`현장 안내사항이 저장되었습니다. (게시일: ${today})`, { 
        variant: 'success', 
        autoHideDuration: 2500 
      });
    } catch (e) {
      console.error(e);
      enqueueSnackbar('안내사항 저장 중 오류가 발생했습니다.', { variant: 'error' });
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
                      checked={isMasterActive && settings.notifyNewReport} 
                      onChange={() => handleToggle('notifyNewReport', '신규 보고서 제출 알림')} 
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
                      checked={isMasterActive && settings.notifyNewInquiry} 
                      onChange={() => handleToggle('notifyNewInquiry', '신규 문의 접수 알림')} 
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
                  현재 브라우저로 실제 웹 푸시를 발송하여 Windows/OS 알림창 수신을 점검합니다.
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
                  onChange={() => handleToggle('noticeVisible', '안내사항 노출')} 
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
                title="기본 안내사항 문구로 초기화"
              >
                <RotateCcw size={14} /> 기본 문구 복원
              </button>
              <button 
                type="button" 
                className="btn-save" 
                onClick={handleSaveNotice}
              >
                <Save size={14} /> 안내사항 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

