import { normalizeSidoName } from '@/utils/addressUtils';
import { KOREA_ADMIN_REGIONS, KOREA_OFFICIAL_ADMIN_REGIONS } from '@/constants/regions';

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

/**
 * 시/도 목록 반환 (기본)
 */
export function getSidoList() {
  return KOREA_ADMIN_REGIONS.map(s => ({ code: s.code, name: s.name, shortName: s.shortName }));
}

/**
 * 특정 시/도의 소방관할 시/군/구 목록 반환
 */
export function getSigunguList(sidoName: string): string[] {
  const sido = KOREA_ADMIN_REGIONS.find(s => s.name === sidoName || s.shortName === sidoName);
  return sido ? sido.sigungus.map(sg => sg.name) : [];
}

/**
 * 특정 시/도 및 시/군/구의 세부 행정구역(구/읍/면/동) 목록 반환
 */
export function getEupmyeondongList(sidoName: string, sigunguName: string): string[] {
  const sido = KOREA_ADMIN_REGIONS.find(s => s.name === sidoName || s.shortName === sidoName);
  if (!sido) return [];
  // 정확 일치 또는 부분 일치 지원 (예: '수원'과 '수원시', '동두천'과 '동두천시')
  const sigungu = sido.sigungus.find(sg => 
    sg.name === sigunguName || 
    sg.name === sigunguName.replace(/[시군구]$/, '') ||
    sg.name + '시' === sigunguName ||
    sg.name + '군' === sigunguName ||
    sg.name + '구' === sigunguName
  );
  return sigungu ? sigungu.eupmyeondongs : [];
}

/**
 * 표준 행정구역(공식) 시/군/구 목록 반환
 */
export function getOfficialSigunguList(sidoName: string): string[] {
  const sido = KOREA_OFFICIAL_ADMIN_REGIONS.find(s => s.name === sidoName || s.shortName === sidoName);
  return sido ? sido.sigungus.map(sg => sg.name) : [];
}

/**
 * 표준 행정구역(공식) 읍/면/동 목록 반환
 */
export function getOfficialEupmyeondongList(sidoName: string, sigunguName: string): string[] {
  const sido = KOREA_OFFICIAL_ADMIN_REGIONS.find(s => s.name === sidoName || s.shortName === sidoName);
  if (!sido) return [];
  const sigungu = sido.sigungus.find(sg => sg.name === sigunguName);
  return sigungu ? sigungu.eupmyeondongs : [];
}

/**
 * 소방관할(FireRegion) 목록 전체 반환 (fire_region 매핑 형태)
 */
export function getAllFireRegions(): FireRegion[] {
  const list: FireRegion[] = [];
  KOREA_ADMIN_REGIONS.forEach((sido) => {
    sido.sigungus.forEach((sg, idx) => {
      const regionId = sg.regionId || `REG_${sido.code}_${String(idx + 1).padStart(2, '0')}`;
      list.push({
        regionId,
        sidoCode: sido.code,
        sidoName: sido.name,
        name: sg.name,
        eupmyeondongs: sg.eupmyeondongs,
      });
    });
  });
  return list;
}

export const getAllRegionMasters = getAllFireRegions;

/**
 * 시도명과 소방관할명으로 regionId 찾기
 */
export function findRegionId(sidoName: string, sigunguName: string): string | undefined {
  const sido = KOREA_ADMIN_REGIONS.find(s => s.name === sidoName || s.shortName === sidoName);
  if (!sido) return undefined;
  const idx = sido.sigungus.findIndex(sg => sg.name === sigunguName || sg.name === sigunguName.replace(/[시군구]$/, ''));
  if (idx === -1) return undefined;
  return sido.sigungus[idx].regionId || `REG_${sido.code}_${String(idx + 1).padStart(2, '0')}`;
}

/**
 * regionId로 FireRegion 찾기
 */
export function findRegionById(regionId: string): FireRegion | undefined {
  return getAllFireRegions().find(r => r.regionId === regionId);
}
