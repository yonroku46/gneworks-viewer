import dayjs from 'dayjs';
import { getStoredSites } from './siteStorage';
import { SiteInfo } from './siteData';

export type { AssignedRegion };

const REGIONS_STORAGE_KEY = 'gneworks_worker_assigned_regions_v1';
const REGIONS_UPDATE_EVENT = 'gneworks_worker_regions_updated';

// 기본 권장 담당 지역
export const DEFAULT_ASSIGNED_REGIONS: AssignedRegion[] = [
  { id: '경기도_안산시', sido: '경기도', sigungu: '안산시', assignedDate: '2026.08.20' },
  { id: '경기도_연천군', sido: '경기도', sigungu: '연천군', assignedDate: '2026.08.25' },
];

export const getStoredAssignedRegions = (): AssignedRegion[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_ASSIGNED_REGIONS;
  }
  try {
    const raw = localStorage.getItem(REGIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(DEFAULT_ASSIGNED_REGIONS));
      return DEFAULT_ASSIGNED_REGIONS;
    }
    const parsed: AssignedRegion[] = JSON.parse(raw);
    // 기존 데이터에 assignedDate가 없을 경우 폴백 부여
    return parsed.map((r, idx) => ({
      ...r,
      assignedDate: r.assignedDate || (idx === 0 ? '2026.08.20' : '2026.08.25'),
    }));
  } catch (error) {
    console.error('Failed to load assigned regions from storage:', error);
    return DEFAULT_ASSIGNED_REGIONS;
  }
};

export const saveStoredAssignedRegions = (regions: AssignedRegion[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(regions));
    window.dispatchEvent(new CustomEvent(REGIONS_UPDATE_EVENT, { detail: regions }));
  } catch (error) {
    console.error('Failed to save assigned regions to storage:', error);
  }
};

export const addAssignedRegion = (sido: string, sigungu: string, assignedDate?: string): AssignedRegion[] => {
  const id = `${sido}_${sigungu}`;
  const current = getStoredAssignedRegions();
  if (current.some(r => r.id === id)) {
    return current;
  }
  const dateStr = assignedDate || dayjs().format('YYYY.MM.DD');
  const updated = [...current, { id, sido, sigungu, assignedDate: dateStr }];
  saveStoredAssignedRegions(updated);
  return updated;
};

export const removeAssignedRegion = (regionId: string): AssignedRegion[] => {
  const current = getStoredAssignedRegions();
  const updated = current.filter(r => r.id !== regionId);
  saveStoredAssignedRegions(updated);
  return updated;
};

export const getUserAssignedRegions = (userId?: string): AssignedRegion[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_ASSIGNED_REGIONS;
  }
  if (!userId) {
    return getStoredAssignedRegions();
  }
  const key = `${REGIONS_STORAGE_KEY}_user_${userId}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return getStoredAssignedRegions();
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getStoredAssignedRegions();
  } catch (error) {
    console.error(`Failed to load assigned regions for user ${userId}:`, error);
    return getStoredAssignedRegions();
  }
};

export const saveUserAssignedRegions = (userId: string | undefined, regions: AssignedRegion[]): void => {
  if (typeof window === 'undefined') return;
  if (!userId) {
    saveStoredAssignedRegions(regions);
    return;
  }
  const key = `${REGIONS_STORAGE_KEY}_user_${userId}`;
  try {
    localStorage.setItem(key, JSON.stringify(regions));
    window.dispatchEvent(new CustomEvent(REGIONS_UPDATE_EVENT, { detail: regions }));
  } catch (error) {
    console.error(`Failed to save assigned regions for user ${userId}:`, error);
  }
};

export interface RegionWorker {
  userId: string;
  userName: string;
  userPhone?: string;
  assignedDate?: string;
  regionName: string;
}

// 기본 지역별 작업자 매핑 데이터 (행정구역 귀속)
export const DEFAULT_REGION_WORKERS: Record<string, RegionWorker[]> = {
  '경기도_연천군': [
    { userId: 'worker_lee', userName: '이작업', userPhone: '010-3344-5566', assignedDate: '2026.08.25', regionName: '경기도 연천군' },
    { userId: 'worker_kim', userName: '김기술', userPhone: '010-5566-7788', assignedDate: '2026.08.26', regionName: '경기도 연천군' },
  ],
  '경기도_안산시': [
    { userId: 'worker_park', userName: '박안산', userPhone: '010-7788-9900', assignedDate: '2026.08.20', regionName: '경기도 안산시' },
  ],
  '서울특별시_강남구': [
    { userId: 'worker_choi', userName: '최강남', userPhone: '010-9988-1122', assignedDate: '2026.08.15', regionName: '서울특별시 강남구' },
  ],
};

// 특정 시/도, 시/군/구 지역을 담당하는 작업자 목록 조회
export const getRegionWorkers = (sido: string, sigungu: string): RegionWorker[] => {
  const key = `${sido}_${sigungu}`;
  if (DEFAULT_REGION_WORKERS[key]) {
    return DEFAULT_REGION_WORKERS[key];
  }
  const assigned = getStoredAssignedRegions().find(r => r.sido === sido && r.sigungu === sigungu);
  if (assigned) {
    return [
      {
        userId: 'worker_default',
        userName: '현장담당자',
        userPhone: '010-1234-5678',
        assignedDate: assigned.assignedDate || '2026.08.25',
        regionName: `${sido} ${sigungu}`,
      },
    ];
  }
  return [];
};

// 특정 지역에 속한 현장 목록 조회
export const getSitesInRegion = (sido: string, sigungu: string): SiteInfo[] => {
  const allSites = getStoredSites();
  return allSites.filter(site => {
    const matchSido = site.sido === sido;
    const matchSigungu = site.sigungu === sigungu;
    return matchSido && matchSigungu;
  });
};

export const subscribeToAssignedRegionsUpdate = (callback: (regions: AssignedRegion[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<AssignedRegion[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredAssignedRegions());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === REGIONS_STORAGE_KEY) {
      callback(getStoredAssignedRegions());
    }
  };

  window.addEventListener(REGIONS_UPDATE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(REGIONS_UPDATE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};
