import { INITIAL_SITES_DATA } from '@/data/siteData';

const SITES_STORAGE_KEY = 'gneworks_sites_data_v4';
const SITES_UPDATE_EVENT = 'gneworks_sites_updated';

export const getStoredSites = (): SiteDetail[] => {
  if (typeof window === 'undefined') {
    return INITIAL_SITES_DATA;
  }
  try {
    const raw = localStorage.getItem(SITES_STORAGE_KEY);
    const sites: SiteDetail[] = raw ? JSON.parse(raw) : INITIAL_SITES_DATA;
    if (!raw) {
      localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
    }
    return sites;
  } catch (error) {
    console.error('Failed to load sites from storage:', error);
    return INITIAL_SITES_DATA;
  }
};

export const saveStoredSites = (sites: SiteDetail[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
    window.dispatchEvent(new CustomEvent(SITES_UPDATE_EVENT, { detail: sites }));
  } catch (error) {
    console.error('Failed to save sites to storage:', error);
  }
};

export const subscribeToSitesUpdate = (callback: (sites: SiteDetail[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<SiteDetail[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredSites());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === SITES_STORAGE_KEY) {
      callback(getStoredSites());
    }
  };

  window.addEventListener(SITES_UPDATE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(SITES_UPDATE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};
