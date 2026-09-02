'use client';

import React from 'react';
import './StatusBadge.scss';

export type StatusVariant = 'installed' | 'needs-fix' | 'hold' | 'scheduled' | 'uninstalled';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * 영문 상태 코드(API)에 대응하는 한글 표시 레이블 맵
 */
export const STATUS_LABEL_MAP: Record<string, string> = {
  // 작업 보고서 상태 (ReportStatus)
  COMPLETED: '확인완료',
  PENDING: '검토대기',
  REJECTED: '수정필요',
  UNSUBMITTED: '미제출',

  // 세대 설치 상태 (InstallStatus)
  INSTALLED: '설치완료',
  SCHEDULED: '방문예정',
  HOLD: '부재/보류',
  ON_HOLD: '부재/보류',
  ABSENT: '부재/보류',
  UNINSTALLED: '미설치',

  // 문의 내역 상태 (InquiryStatus)
  RESOLVED: '답변완료',
  ANSWERED: '답변완료',
  WAITING: '답변대기',

  // 일반 진행 상태
  DONE: '완료',
  IN_PROGRESS: '처리중',
};

/**
 * 상태 코드에 맞춰 자동으로 컬러 및 스타일 variant를 반환하는 헬퍼
 */
export function getStatusVariant(status: string): StatusVariant {
  const code = (status || '').toUpperCase();

  switch (code) {
    // 1. 설치완료 / 확인완료 / 답변완료 / 완료
    case 'COMPLETED':
    case 'INSTALLED':
    case 'RESOLVED':
    case 'ANSWERED':
    case 'DONE':
    case '확인완료':
    case '설치완료':
    case '완료':
    case '답변완료':
      return 'installed';

    // 2. 수정필요 / 보완요청 (반려)
    case 'REJECTED':
    case 'NEEDS_FIX':
    case '수정필요':
      return 'needs-fix';

    // 3. 보류 / 부재 / 검토대기 / 답변대기 / 처리중
    case 'PENDING':
    case 'WAITING':
    case 'HOLD':
    case 'ON_HOLD':
    case 'ABSENT':
    case 'IN_PROGRESS':
    case '답변대기':
    case '보류':
    case '부재/보류':
    case '대기':
    case '처리중':
    case '검토대기':
      return 'hold';

    // 4. 방문예정
    case 'SCHEDULED':
    case '방문예정':
      return 'scheduled';

    // 5. 미설치 / 미제출
    case 'UNINSTALLED':
    case 'UNSUBMITTED':
    case '미설치':
    case '미제출':
    default:
      return 'uninstalled';
  }
}

export default function StatusBadge({
  status,
  variant,
  size = 'md',
  className = '',
  children,
  ...rest
}: StatusBadgeProps) {
  const resolvedVariant = variant || getStatusVariant(status);
  const displayLabel = children || STATUS_LABEL_MAP[status] || STATUS_LABEL_MAP[(status || '').toUpperCase()] || status;

  return (
    <span
      className={`common-status-badge status-${resolvedVariant} ${size === 'sm' ? 'size-sm' : ''} ${className}`.trim()}
      {...rest}
    >
      {displayLabel}
    </span>
  );
}