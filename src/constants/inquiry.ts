export const INQUIRY_TYPE_MAP: Record<string, { label: string; badgeClass: string }> = {
  password_reset: { label: '비밀번호 재발급', badgeClass: 'type-password' },
  account: { label: '계정/권한 문의', badgeClass: 'type-account' },
  task_report: { label: '작업배정/현장보고', badgeClass: 'type-task' },
  bug: { label: '오류/버그 신고', badgeClass: 'type-bug' },
  feature: { label: '기능개선 제안', badgeClass: 'type-feature' },
  general: { label: '일반/기타 문의', badgeClass: 'type-general' },
};

export const INQUIRY_TYPES = [
  { value: '', label: '문의 유형을 선택해 주세요' },
  { value: 'password_reset', label: '비밀번호 분실 / 재발급 요청' },
  { value: 'account', label: '계정 신규 발급 / 권한 변경' },
  { value: 'task_report', label: '작업 배정 및 현장 보고 문의' },
  { value: 'bug', label: '시스템 오류 / 버그 신고' },
  { value: 'feature', label: '기능 개선 및 추가 제안' },
  { value: 'general', label: '기타 업무 및 시스템 문의' },
];