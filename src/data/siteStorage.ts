import { INITIAL_SITES_DATA, SiteInfo, AssignedWorker, getSiteWorkers } from '@/data/siteData';

const SITES_STORAGE_KEY = 'gneworks_sites_data_v4';
const SITES_UPDATE_EVENT = 'gneworks_sites_updated';

export const getStoredSites = (): SiteInfo[] => {
  if (typeof window === 'undefined') {
    return INITIAL_SITES_DATA;
  }
  try {
    const raw = localStorage.getItem(SITES_STORAGE_KEY);
    let sites: SiteInfo[] = raw ? JSON.parse(raw) : INITIAL_SITES_DATA;

    let modified = false;
    sites = sites.map(site => {
      const householdsWithSeq = site.households.map((h, idx) => {
        if (h.seq !== undefined && h.seq !== null && h.seq !== '') {
          return h;
        }
        modified = true;
        const match = h.id.match(/_(\d+)$/);
        const seqVal = match ? parseInt(match[1], 10) : idx + 1;
        return { ...h, seq: seqVal };
      });
      return { ...site, households: householdsWithSeq };
    });

    if (!raw || modified) {
      localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
    }
    return sites;
  } catch (error) {
    console.error('Failed to load sites from storage:', error);
    return INITIAL_SITES_DATA;
  }
};

export const saveStoredSites = (sites: SiteInfo[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
    window.dispatchEvent(new CustomEvent(SITES_UPDATE_EVENT, { detail: sites }));
  } catch (error) {
    console.error('Failed to save sites to storage:', error);
  }
};

export const assignSiteToWorker = (
  siteId: string,
  worker: { userId: string; userName: string; phoneNum?: string }
): SiteInfo[] => {
  const currentSites = getStoredSites();
  const updated = currentSites.map(s => {
    if (s.id === siteId) {
      const currentWorkers = getSiteWorkers(s);
      const exists = currentWorkers.some(w => w.userId === worker.userId);
      if (exists) {
        return s;
      }
      const updatedWorkers: AssignedWorker[] = [
        ...currentWorkers,
        {
          userId: worker.userId,
          userName: worker.userName,
          userPhone: worker.phoneNum || '연락처 미등록',
        },
      ];
      return {
        ...s,
        assignedWorkers: updatedWorkers,
        assignedUserId: updatedWorkers[0]?.userId,
        assignedUserName: updatedWorkers[0]?.userName,
        assignedUserPhone: updatedWorkers[0]?.userPhone,
      };
    }
    return s;
  });
  saveStoredSites(updated);
  return updated;
};

export const unassignSite = (siteId: string, targetUserId?: string): SiteInfo[] => {
  const currentSites = getStoredSites();
  const updated = currentSites.map(s => {
    if (s.id === siteId) {
      const currentWorkers = getSiteWorkers(s);
      const updatedWorkers = targetUserId
        ? currentWorkers.filter(w => w.userId !== targetUserId)
        : [];
      return {
        ...s,
        assignedWorkers: updatedWorkers,
        assignedUserId: updatedWorkers[0]?.userId,
        assignedUserName: updatedWorkers[0]?.userName,
        assignedUserPhone: updatedWorkers[0]?.userPhone,
      };
    }
    return s;
  });
  saveStoredSites(updated);
  return updated;
};

export const subscribeToSitesUpdate = (callback: (sites: SiteInfo[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<SiteInfo[]>;
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
