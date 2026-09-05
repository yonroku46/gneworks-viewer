import dayjs from 'dayjs';
import { getStoredSites } from './siteStorage';
import { getStoredUsers } from './userStorage';
import { findRegionId } from './koreaRegions';

const REGIONS_STORAGE_KEY = 'gneworks_worker_assigned_regions_v1';
const REGIONS_UPDATE_EVENT = 'gneworks_worker_regions_updated';

// 기본 권장 담당 지역
export const DEFAULT_ASSIGNED_REGIONS: UserAssignedRegionDetail[] = [];

export const getStoredAssignedRegions = (): UserAssignedRegionDetail[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_ASSIGNED_REGIONS;
  }
  try {
    const raw = localStorage.getItem(REGIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(DEFAULT_ASSIGNED_REGIONS));
      return DEFAULT_ASSIGNED_REGIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_ASSIGNED_REGIONS;

    return parsed.map((r: any) => ({
      ...r,
      regionId: r.regionId || findRegionId(r.sido, r.sigungu) || '',
    }));
  } catch (error) {
    console.error('Failed to load assigned regions from storage:', error);
    return DEFAULT_ASSIGNED_REGIONS;
  }
};

export const saveStoredAssignedRegions = (regions: UserAssignedRegionDetail[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(regions));
    window.dispatchEvent(new CustomEvent(REGIONS_UPDATE_EVENT, { detail: regions }));
  } catch (error) {
    console.error('Failed to save assigned regions to storage:', error);
  }
};

export const addAssignedRegion = (sido: string, sigungu: string, assignedDate?: string, userId?: string): UserAssignedRegionDetail[] => {
  if (!userId) {
    console.warn('addAssignedRegion: userId is required');
    return getStoredAssignedRegions();
  }
  const assignedRegionId = `${userId}_${sido}_${sigungu}`;
  const current = getStoredAssignedRegions();
  if (current.some(r => r.assignedRegionId === assignedRegionId || (r.userId === userId && r.sido === sido && r.sigungu === sigungu))) {
    return current;
  }
  const dateStr = assignedDate || dayjs().format('YYYY.MM.DD');
  const regionId = findRegionId(sido, sigungu) || '';
  const updated: UserAssignedRegionDetail[] = [
    ...current,
    { assignedRegionId, userId, regionId, sido, sigungu, assignedDate: dateStr }
  ];
  saveStoredAssignedRegions(updated);
  return updated;
};

export const removeAssignedRegion = (regionId: string): UserAssignedRegionDetail[] => {
  const current = getStoredAssignedRegions();
  const updated = current.filter(r => r.assignedRegionId !== regionId);
  saveStoredAssignedRegions(updated);
  return updated;
};

export const getUserAssignedRegions = (userId?: string): UserAssignedRegionDetail[] => {
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
    if (!Array.isArray(parsed)) return getStoredAssignedRegions();
    return parsed.map((r: any) => ({
      ...r,
      regionId: r.regionId || findRegionId(r.sido, r.sigungu) || '',
    }));
  } catch (error) {
    console.error(`Failed to load assigned regions for user ${userId}:`, error);
    return getStoredAssignedRegions();
  }
};

// 특정 시/도, 시/군/구 지역을 담당하는 작업자 목록 조회 (배정된 관할 기반 작업자 유저 조회)
export const getRegionWorkers = (sido: string, sigungu: string): RegionWorkerUser[] => {
  const allAssigned = getStoredAssignedRegions();
  const assigned = allAssigned.filter(r => r.sido === sido && r.sigungu === sigungu);
  if (assigned.length === 0) return [];
  const allUsers = getStoredUsers();
  return assigned.map(r => {
    const user = allUsers.find(u => u.userId === r.userId);
    const userAllRegions = allAssigned.filter(ar => ar.userId === r.userId);
    if (user) {
      return {
        ...user,
        assignedRegions: userAllRegions,
      };
    }
    return {
      userId: r.userId,
      userName: r.userId,
      phoneNum: '',
      lastUpdated: r.assignedDate ? dayjs(r.assignedDate).toISOString() : dayjs().toISOString(),
      createTime: r.assignedDate ? dayjs(r.assignedDate).toISOString() : dayjs().toISOString(),
      assignedRegions: userAllRegions,
    };
  });
};

// 특정 지역에 속한 현장 목록 조회
export const getSitesInRegion = (sido: string, sigungu: string): SiteDetail[] => {
  const allSites = getStoredSites();
  return allSites.filter(site => {
    const matchSido = site.sido === sido;
    const matchSigungu = site.sigungu === sigungu;
    return matchSido && matchSigungu;
  });
};

export const subscribeToAssignedRegionsUpdate = (callback: (regions: UserAssignedRegionDetail[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<UserAssignedRegionDetail[]>;
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
