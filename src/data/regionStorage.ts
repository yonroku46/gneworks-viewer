import { getStoredSites } from './siteStorage';
import { SiteInfo } from './siteData';

export interface AssignedRegion {
  id: string;          // e.g. '경기도_안산시'
  sido: string;        // e.g. '경기도'
  sigungu: string;     // e.g. '안산시'
  assignedDate?: string; // e.g. '2026.09.02'
}

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
  const dateStr = assignedDate || new Date().toISOString().split('T')[0].replace(/-/g, '.');
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
