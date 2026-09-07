/**
 * 대한민국 표준 전화번호 포맷터
 * 
 * 지원 유형:
 * - 서울 지역 유선전화: 02 (9~10자리) -> 02-123-4567, 02-1234-5678
 * - 전국 지역 유선전화: 031, 032, 033, 041, 042, 043, 044, 051, 052, 053, 054, 055, 061, 062, 063, 064 등 (10~11자리)
 *   -> 031-123-4567, 031-1234-5678
 * - 이동전화/인터넷전화: 010, 011, 016, 017, 018, 019, 070 (10~11자리)
 *   -> 010-1234-5678, 011-123-4567
 * - 평생/안심번호: 050x (11~12자리) -> 0504-123-4567, 0504-1234-5678
 * - 전국 대표번호: 15xx, 16xx, 18xx (8자리) -> 1588-1234
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';
  const clean = value.replace(/[^0-9]/g, '');

  // 1. 전국 대표번호 (15xx, 16xx, 18xx 등 8자리)
  if (clean.startsWith('1') && !clean.startsWith('10') && !clean.startsWith('11') && !clean.startsWith('12')) {
    const s = clean.slice(0, 8);
    if (s.length <= 4) return s;
    return `${s.slice(0, 4)}-${s.slice(4)}`;
  }

  // 2. 평생/안심번호 (0502, 0504, 0505, 0507 등 4자리 국번)
  if (clean.startsWith('050')) {
    const s = clean.slice(0, 12);
    if (s.length <= 4) return s;
    if (s.length <= 7) return `${s.slice(0, 4)}-${s.slice(4)}`;
    if (s.length <= 11) {
      return `${s.slice(0, 4)}-${s.slice(4, 7)}-${s.slice(7)}`;
    }
    return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`;
  }

  // 3. 서울 지역 유선전화 (02)
  if (clean.startsWith('02')) {
    const s = clean.slice(0, 10);
    if (s.length <= 2) return s;
    if (s.length <= 5) return `${s.slice(0, 2)}-${s.slice(2)}`;
    if (s.length <= 9) {
      // 02-123-4567 (9자리)
      return `${s.slice(0, 2)}-${s.slice(2, 5)}-${s.slice(5)}`;
    }
    // 02-1234-5678 (10자리)
    return `${s.slice(0, 2)}-${s.slice(2, 6)}-${s.slice(6)}`;
  }

  // 4. 전국 지역번호 (031 경기 ~ 064 제주) 및 이동전화/인터넷전화 (010, 070 등)
  const s = clean.slice(0, 11);
  if (s.length <= 3) return s;
  if (s.length <= 6) return `${s.slice(0, 3)}-${s.slice(3)}`;
  if (s.length <= 10) {
    // 10자리 (예: 031-123-4567, 051-890-1234, 011-123-4567)
    return `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6)}`;
  }
  // 11자리 (예: 031-1234-5678, 010-1234-5678, 070-1234-5678)
  return `${s.slice(0, 3)}-${s.slice(3, 7)}-${s.slice(7)}`;
};