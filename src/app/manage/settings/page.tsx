'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone,
  Mail
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import '../ManageLayout.scss';

interface SystemSettings {
  // 알림 수신 설정
  notifyWebPush: boolean;
  notifyNewReport: boolean;
  notifyFixReport: boolean;
  notifyDailySummary: boolean;

  // 현장 작업 및 확인서 운영 설정
  includeSignatureOnPrint: boolean;
  autoHighlightPending: boolean;

  // 고객지원 / 비상 연락처
  contactPhone: string;
  contactEmail: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  notifyWebPush: true,
  notifyNewReport: true,
  notifyFixReport: true,
  notifyDailySummary: true,

  includeSignatureOnPrint: true,
  autoHighlightPending: true,

  contactPhone: '010-6761-7665',
  contactEmail: 'minkyu0026@nate.com',
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
          <p>작업 보고서 실시간 알림 수신 및 보급지원확인서 운영 환경을 관리합니다.</p>
        </div>
      </div>

      <div className="settings-container-form">
        <div className="settings-layout-grid">
          
          {/* ── LEFT COLUMN: NOTIFICATION SETTINGS ── */}
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

              <div className="setting-toggle-item">
                <div className="toggle-info">
                  <strong>일일 작업 마감 요약 리포트</strong>
                  <p>매일 18:00 당일 전체 현장 설치 건수 및 승인/보류 현황 요약 알림을 전송합니다.</p>
                </div>
                <label className="custom-switch-label">
                  <input 
                    type="checkbox" 
                    checked={settings.notifyDailySummary} 
                    onChange={() => handleToggle('notifyDailySummary', '일일 마감 요약 리포트')} 
                    disabled={!settings.notifyWebPush}
                  />
                  <span className="switch-slider" />
                </label>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: OPERATIONS & SYSTEM PROFILE ── */}
          <div className="settings-right-column">
            
            {/* Work & Report Operations Card */}
            <div className="settings-card operation-settings-card">
              <h3>
                <span>현장 작업 및 확인서 운영 설정</span>
              </h3>

              <div className="setting-toggle-list">
                <div className="setting-toggle-item">
                  <div className="toggle-info">
                    <strong>확인서 인쇄 시 전자서명 포함</strong>
                    <p>보급지원확인서 출력 시 세대주 확인 전자서명을 함께 인쇄합니다.</p>
                  </div>
                  <label className="custom-switch-label">
                    <input 
                      type="checkbox" 
                      checked={settings.includeSignatureOnPrint} 
                      onChange={() => handleToggle('includeSignatureOnPrint', '전자서명 포함 인쇄')} 
                    />
                    <span className="switch-slider" />
                  </label>
                </div>

                <div className="setting-toggle-item">
                  <div className="toggle-info">
                    <strong>48시간 이상 미검토 보고서 우선 강조</strong>
                    <p>작업현황 테이블에서 장기 미검토 상태의 보고서를 시각적으로 강조 표시합니다.</p>
                  </div>
                  <label className="custom-switch-label">
                    <input 
                      type="checkbox" 
                      checked={settings.autoHighlightPending} 
                      onChange={() => handleToggle('autoHighlightPending', '미검토 보고서 우선 강조')} 
                    />
                    <span className="switch-slider" />
                  </label>
                </div>
              </div>
            </div>

            {/* Customer Support & Contact Card */}
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

          </div>
        </div>
      </div>
    </div>
  );
}
