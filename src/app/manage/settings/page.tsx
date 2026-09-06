'use client';

import React, { useState } from 'react';
import { 
  Phone,
  Mail
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import '../ManageLayout.scss';

interface SystemSettings {
  // 고객지원 / 비상 연락처
  contactPhone: string;
  contactEmail: string;

  // 알림 수신 설정
  notifyWebPush: boolean;
  notifyNewReport: boolean;
  notifyFixReport: boolean;
}

const DEFAULT_SETTINGS: SystemSettings = {
  contactPhone: '010-6761-7665',
  contactEmail: 'minkyu0026@nate.com',

  notifyWebPush: true,
  notifyNewReport: true,
  notifyFixReport: true,
};

const STORAGE_KEY = 'gneworks_manage_system_settings';

export default function ManageSettings() {
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

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

  const handleTextChange = (key: 'contactPhone' | 'contactEmail', value: string) => {
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

  return (
    <div className="manage-settings-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-header-row">
        <div>
          <h2>시스템 설정</h2>
          <p>고객지원 대표 연락처 정보 및 실시간 웹 푸시 알림 환경을 관리합니다.</p>
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

          {/* ── RIGHT COLUMN: WEB PUSH NOTIFICATION SETTINGS ── */}
          <div className="settings-card notification-settings-card">
            <h3>
              <span>웹 푸시 알림 설정</span>
            </h3>

            <div className="setting-toggle-list">
              <div className="setting-toggle-item">
                <div className="toggle-info">
                  <strong>웹 브라우저 푸시 알림 활성화</strong>
                  <p>관리자 대시보드 접속 중 실시간 웹 푸시 알림을 수신합니다.</p>
                </div>
                <label className="custom-switch-label">
                  <input 
                    type="checkbox" 
                    checked={settings.notifyWebPush} 
                    onChange={() => handleToggle('notifyWebPush', '웹 브라우저 푸시')} 
                  />
                  <span className="switch-slider" />
                </label>
              </div>

              <div className="setting-toggle-item">
                <div className="toggle-info">
                  <strong>신규 작업 보고서 제출 알림</strong>
                  <p>설치 작업자가 현장에서 확인서를 신규 제출하면 관리자에게 실시간 알림을 보냅니다.</p>
                </div>
                <label className="custom-switch-label">
                  <input 
                    type="checkbox" 
                    checked={settings.notifyNewReport} 
                    onChange={() => handleToggle('notifyNewReport', '신규 보고서 제출 알림')} 
                    disabled={!settings.notifyWebPush}
                  />
                  <span className="switch-slider" />
                </label>
              </div>

              <div className="setting-toggle-item">
                <div className="toggle-info">
                  <strong>수정 보완 보고서 재제출 알림</strong>
                  <p>관리자가 ‘수정필요’ 요청한 보고서가 작업자에 의해 보완 제출되었을 때 알림을 보냅니다.</p>
                </div>
                <label className="custom-switch-label">
                  <input 
                    type="checkbox" 
                    checked={settings.notifyFixReport} 
                    onChange={() => handleToggle('notifyFixReport', '수정 보완 보고서 알림')} 
                    disabled={!settings.notifyWebPush}
                  />
                  <span className="switch-slider" />
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

