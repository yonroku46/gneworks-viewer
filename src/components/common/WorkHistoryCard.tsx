'use client';

import React from 'react';
import { WorkReport } from '@/data/reportData';
import { Calendar, ChevronRight } from 'lucide-react';
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
    report.status === '확인완료'
      ? 'completed'
      : report.status === '검토대기'
      ? 'pending'
      : 'revise';

  const dateStr = report.installDate || report.reportTime?.split(' ')[0] || '';
  const timeStr = report.reportTime?.includes(' ') ? report.reportTime.split(' ')[1] : '';

  return (
    <div
      className={`work-history-card status-${statusKey}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* 1) 좌측 3.5px 슬림 컬러 인디케이터 바 */}
      <div className={`status-indicator ${statusKey}`} />

      {/* 2) 본문 정보 */}
      <div className="card-body">
        <div className="card-main-line">
          <div className="unit-left">
            <span className="unit-name">
              {showSiteName ? `${report.siteName} ${report.dong}동 ${report.ho}호` : `${report.dong}동 ${report.ho}호`}
            </span>
            {report.headName && (
              <span className="head-name">({report.headName})</span>
            )}
          </div>
        </div>

        <div className="card-sub-line">
          {dateStr && (
            <span className="info-date">
              <Calendar size={11} />
              <span>{dateStr}</span>
            </span>
          )}
          {timeStr && (
            <>
              <span className="dot">•</span>
              <span className="info-time">{timeStr} 보고</span>
            </>
          )}
        </div>
      </div>

      {/* 3) 우측 이동 화살표 */}
      <div className="card-arrow-col">
        <ChevronRight size={15} className="arrow-icon" />
      </div>
    </div>
  );
}
