'use client';

import React from 'react';

import { AlertCircle, Calendar, Check, ChevronRight, Hourglass } from 'lucide-react';
import './WorkHistoryCard.scss';

interface WorkHistoryCardProps {
  report: WorkReport;
  onClick?: () => void;
  showSiteName?: boolean;
}

export default function WorkHistoryCard({
  report,
  onClick,
  showSiteName = false,
}: WorkHistoryCardProps) {
  const statusKey =
    report.status === 'COMPLETED'
      ? 'completed'
      : report.status === 'PENDING'
      ? 'pending'
      : 'revise';

  const statusConfig = {
    completed: {
      icon: Check,
      label: '확인완료',
    },
    pending: {
      icon: Hourglass,
      label: '검토대기',
    },
    revise: {
      icon: AlertCircle,
      label: '수정필요',
    },
  }[statusKey];

  const StatusIcon = statusConfig.icon;
  const dateStr = report.installDate || report.reportTime?.split(' ')[0] || '';
  const timeStr = report.reportTime?.includes(' ') ? report.reportTime.split(' ')[1] : '';

  return (
    <div
      className={`work-history-card status-${statusKey}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={`status-avatar ${statusKey}`}>
        <StatusIcon size={16} strokeWidth={2.5} />
      </div>

      <div className="card-body">
        <div className="card-main-line">
          <div className="unit-left">
            <span className="unit-name">
              {showSiteName ? `${report.siteName} ${report.dong}동 ${report.ho}호` : `${report.dong}동 ${report.ho}호`}
            </span>
            {report.headName && (
              <span className="head-name">{report.headName} 세대</span>
            )}
          </div>
        </div>

        <div className="card-sub-line">
          <span className={`status-text ${statusKey}`}>{statusConfig.label}</span>
          {(dateStr || timeStr) && <span className="dot">•</span>}
          {dateStr && (
            <span className="info-date">
              <span>{`${dateStr} ${timeStr ? `${timeStr} 보고` : ''}`}</span>
            </span>
          )}
        </div>
      </div>

      <div className="card-arrow-col">
        <ChevronRight size={15} className="arrow-icon" />
      </div>
    </div>
  );
}
