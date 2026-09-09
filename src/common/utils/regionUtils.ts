import { normalizeSidoName, cleanRegionName } from '@/utils/addressUtils';
import { KOREA_ADMIN_REGIONS } from '@/constants/regions';

/**
 * 시/군/구 명칭 정규화 (끝의 '시', '군', '구' 접미사 제거 및 공백 정리)
 * 예: "안산시" -> "안산", "강남구" -> "강남", "가평군" -> "가평"
 */
export const normalizeSigungu = (sigungu?: string): string => {
  if (!sigungu) return '';
  return sigungu.replace(/(시|군|구)$/, '').trim();
};

/**
 * 시/도 및 시/군/구 명칭 정확 매칭
 * - 시/도 일치 여부 확인 ("경기" <-> "경기도", "서울" <-> "서울특별시" 호환)
 * - DB 등록 소방관할명과 프론트엔드 행정구역명 간의 완전 일치 검증
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

  return cleanR === cleanT;
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

let cachedFireRegions: FireRegion[] | null = null;
let fetchPromise: Promise<FireRegion[]> | null = null;
const regionsBySidoCache = new Map<string, FireRegion[]>();
const regionByIdCache = new Map<string, FireRegion>();
let cachedSidoList: string[] = [];

/**
 * DB에서 fire_region 전체 목록을 로드하고 메모리에 캐싱
 * - 동시 호출 시 단일 Promise로 중복 요청 방지
 * - 시도별 / ID별 인덱스를 Map으로 구성하여 O(1) 초고속 조회 지원
 */
export async function fetchFireRegions(forceReload = false): Promise<FireRegion[]> {
  if (!forceReload && cachedFireRegions && cachedFireRegions.length > 0) {
    return cachedFireRegions;
  }

  if (!forceReload && fetchPromise) {
    return fetchPromise;
  }

  const { default: AdminService } = await import('@/api/service/AdminService');

  fetchPromise = (async () => {
    try {
      const list = await AdminService.getFireRegions();
      const rawList: FireRegion[] = Array.isArray(list) ? list : [];

      // 데이터 정규화 (eupmyeondongs 파싱 등)
      const normalizedList: FireRegion[] = rawList.map(item => {
        let eList: string[] = [];
        if (Array.isArray(item.eupmyeondongs)) {
          eList = item.eupmyeondongs;
        } else if (typeof item.eupmyeondongs === 'string') {
          try {
            const parsed = JSON.parse(item.eupmyeondongs);
            eList = Array.isArray(parsed) ? parsed : [];
          } catch {
            eList = (item.eupmyeondongs as string).split(',').map(s => s.trim()).filter(Boolean);
          }
        }
        return {
          ...item,
          eupmyeondongs: eList,
        };
      });

      // 캐시 및 인덱스 갱신
      cachedFireRegions = normalizedList;
      regionsBySidoCache.clear();
      regionByIdCache.clear();
      const sidoSet = new Set<string>();

      normalizedList.forEach(fr => {
        if (fr.regionId) {
          regionByIdCache.set(fr.regionId, fr);
        }
        if (fr.sidoName) {
          sidoSet.add(fr.sidoName);
          const existing = regionsBySidoCache.get(fr.sidoName) || [];
          existing.push(fr);
          regionsBySidoCache.set(fr.sidoName, existing);
        }
      });

      // 시도 정렬 (표준 순서 보장)
      const standardSidoOrder = KOREA_ADMIN_REGIONS.map(s => s.name);
      cachedSidoList = Array.from(sidoSet).sort((a, b) => {
        const idxA = standardSidoOrder.indexOf(a);
        const idxB = standardSidoOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b, 'ko');
      });

      return cachedFireRegions;
    } catch (err) {
      console.error('[regionUtils] fetchFireRegions error:', err);
      return cachedFireRegions || [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

/**
 * 캐시된 FireRegion 목록 동기 반환
 */
export function getCachedFireRegions(): FireRegion[] {
  return cachedFireRegions || [];
}

/**
 * 캐시된 시도명 목록 반환 (DB 기반)
 */
export function getDbSidoList(): string[] {
  if (cachedSidoList.length > 0) return cachedSidoList;
  return KOREA_ADMIN_REGIONS.map(s => s.name);
}

/**
 * 특정 시도에 속한 소방관할 목록 반환 (DB 캐시 기반 O(1))
 */
export function getFireRegionsBySido(sidoName: string): FireRegion[] {
  if (!sidoName || sidoName === 'ALL') return [];
  const direct = regionsBySidoCache.get(sidoName);
  if (direct && direct.length > 0) return direct;

  const norm = normalizeSidoName(sidoName);
  for (const [key, list] of regionsBySidoCache.entries()) {
    if (normalizeSidoName(key) === norm) {
      return list;
    }
  }

  // 아직 캐시가 비어있을 경우 fallback
  return [];
}

/**
 * regionId로 단건 소방관할 반환 (DB 캐시 기반 O(1))
 */
export function getFireRegionById(regionId: string): FireRegion | undefined {
  if (!regionId) return undefined;
  return regionByIdCache.get(regionId);
}

/**
 * 시도명과 소방관할명으로 regionId 찾기 (DB 캐시 우선, 없을 시 정적 데이터)
 */
export function findRegionId(sidoName: string, sigunguName: string): string | undefined {
  if (!sidoName || !sigunguName || sidoName === 'ALL' || sigunguName === 'ALL') {
    return undefined;
  }

  // 1. DB 캐시에서 매칭
  const dbRegions = getFireRegionsBySido(sidoName);
  if (dbRegions.length > 0) {
    const cleanSg = cleanRegionName(sigunguName);
    const found = dbRegions.find(fr => {
      const cleanFr = cleanRegionName(fr.name);
      return cleanFr === cleanSg || fr.name === sigunguName;
    });
    if (found) return found.regionId;
  }

  // 2. 정적 상수 fallback
  const sido = KOREA_ADMIN_REGIONS.find(s => s.name === sidoName || s.shortName === sidoName);
  if (!sido) return undefined;
  const idx = sido.sigungus.findIndex(sg => sg.name === sigunguName || sg.name === sigunguName.replace(/[시군구]$/, ''));
  if (idx === -1) return undefined;
  return sido.sigungus[idx].regionId;
}

/**
 * regionId로 FireRegion 찾기
 */
export function findRegionById(regionId: string): FireRegion | undefined {
  return getFireRegionById(regionId) || getAllFireRegions().find(r => r.regionId === regionId);
}

/**
 * 실제 DB에서 로드된 FireRegion 목록 중, 선택된 행정구역(sido, sigungu, eupmyeondong)에 가장 적합한 소방관할 탐색
 */
export function findActualFireRegion(
  fireRegions: FireRegion[],
  sido?: string,
  sigungu?: string,
  eupmyeondong?: string
): FireRegion | undefined {
  const regions = (fireRegions && fireRegions.length > 0) ? fireRegions : getCachedFireRegions();
  if (!regions || regions.length === 0 || !sido || sido === 'ALL') {
    return undefined;
  }

  const normSido = normalizeSidoName(sido);
  const sidoRegions = regions.filter(fr => normalizeSidoName(fr.sidoName) === normSido);
  if (sidoRegions.length === 0) return undefined;

  // 1순위: 읍/면/동이 명시되어 있고, 소방서의 관할 읍면동(eupmyeondongs)에 포함된 경우
  if (eupmyeondong && eupmyeondong !== 'ALL') {
    const matchedByEup = sidoRegions.find(fr => {
      if (!fr.eupmyeondongs) return false;
      return fr.eupmyeondongs.includes(eupmyeondong);
    });
    if (matchedByEup) return matchedByEup;
  }

  // 2순위: 시/군/구(소방서명)가 일치하는 경우
  if (sigungu && sigungu !== 'ALL') {
    const cleanSg = cleanRegionName(sigungu);
    const exactMatch = sidoRegions.find(fr => {
      const cleanFr = cleanRegionName(fr.name);
      return cleanFr === cleanSg || fr.name === sigungu;
    });
    if (exactMatch) return exactMatch;

    const partialMatch = sidoRegions.find(fr => {
      const cleanFr = cleanRegionName(fr.name);
      return cleanFr.startsWith(cleanSg) || cleanSg.startsWith(cleanFr);
    });
    if (partialMatch) return partialMatch;
  }

  return undefined;
}
