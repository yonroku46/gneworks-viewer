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
 * 상태 문자열에 맞춰 자동으로 컬러 및 스타일 variant를 반환하는 헬퍼
 */
export function getStatusVariant(status: string): StatusVariant {
  switch (status) {
    case '확인완료':
    case '설치완료':
    case '완료':
    case '답변완료':
    case 'RESOLVED':
    case 'installed':
      return 'installed';

    case '수정필요':
    case '답변대기':
    case 'PENDING':
    case 'needs-fix':
      return 'needs-fix';

    case '보류':
    case '부재/보류':
    case '대기':
    case '처리중':
    case 'IN_PROGRESS':
    case 'hold':
      return 'hold';

    case '방문예정':
    case 'scheduled':
      return 'scheduled';

    case '미설치':
    case 'uninstalled':
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

  return (
    <span
      className={`common-status-badge status-${resolvedVariant} ${size === 'sm' ? 'size-sm' : ''} ${className}`.trim()}
      {...rest}
    >
      {children || status}
    </span>
  );
}