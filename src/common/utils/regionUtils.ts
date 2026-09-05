import { normalizeSidoName } from '@/utils/addressUtils';

/**
 * 시/군/구 명칭 정규화 (끝의 '시', '군', '구' 접미사 제거 및 공백 정리)
 * 예: "안산시" -> "안산", "강남구" -> "강남", "가평군" -> "가평"
 */
export const normalizeSigungu = (sigungu?: string): string => {
  if (!sigungu) return '';
  return sigungu.replace(/(시|군|구)$/, '').trim();
};

/**
 * 시/도 및 시/군/구 명칭 유연 매칭
 * - 시/도 일치 여부 확인 ("경기" <-> "경기도", "서울" <-> "서울특별시" 호환)
 * - DB 등록 소방관할명("안산")과 프론트엔드 행정구역명("안산시") 간의 호환 매칭 지원
 * 
 * @param rSido 비교 대상 1 시/도
 * @param rSigungu 비교 대상 1 시/군/구
 * @param targetSido 비교 대상 2 시/도
 * @param targetSigungu 비교 대상 2 시/군/구
 */
export const isRegionMatch = (
  rSido?: string,
  rSigungu?: string,
  targetSido?: string,
  targetSigungu?: string
): boolean => {
  if (!rSido || !targetSido || !rSigungu || !targetSigungu) return false;

  const sido1 = normalizeSidoName(rSido);
  const sido2 = normalizeSidoName(targetSido);
  if (sido1 !== sido2) return false;
  if (rSigungu === targetSigungu) return true;

  const cleanR = normalizeSigungu(rSigungu);
  const cleanT = normalizeSigungu(targetSigungu);

  return cleanR === cleanT || cleanR.startsWith(cleanT) || cleanT.startsWith(cleanR);
};
