'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const DEFAULT_MANAGE_REGION: SelectedRegion = {
  sido: 'ALL',
  sigungu: 'ALL',
  eupmyeondong: 'ALL',
};

const MANAGE_REGION_STORAGE_KEY = 'gneworks_manage_selected_region';
const MANAGE_REGION_CHANGE_EVENT = 'gneworks_manage_region_changed';

interface ManageRegionContextType {
  region: SelectedRegion;
  setRegion: (value: SelectedRegion | ((prev: SelectedRegion) => SelectedRegion)) => void;
  resetRegion: () => void;
}

const ManageRegionContext = createContext<ManageRegionContextType>({
  region: DEFAULT_MANAGE_REGION,
  setRegion: () => {},
  resetRegion: () => {},
});

export function ManageRegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<SelectedRegion>(DEFAULT_MANAGE_REGION);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MANAGE_REGION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.sido === 'string') {
          setRegionState({
            sido: parsed.sido || 'ALL',
            sigungu: parsed.sigungu || 'ALL',
            eupmyeondong: parsed.eupmyeondong || 'ALL',
          });
        }
      }
    } catch (e) {
      console.error('Failed to load manage region from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Sync across components or tabs
  useEffect(() => {
    const handleRegionUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<SelectedRegion>;
      if (customEvent.detail) {
        setRegionState(customEvent.detail);
      }
    };

    window.addEventListener(MANAGE_REGION_CHANGE_EVENT, handleRegionUpdate);
    return () => {
      window.removeEventListener(MANAGE_REGION_CHANGE_EVENT, handleRegionUpdate);
    };
  }, []);

  // 3. Setter with LocalStorage persistence & broadcast
  const setRegion = useCallback((value: SelectedRegion | ((prev: SelectedRegion) => SelectedRegion)) => {
    setRegionState(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem(MANAGE_REGION_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent(MANAGE_REGION_CHANGE_EVENT, { detail: next }));
      } catch (e) {
        console.error('Failed to save manage region to localStorage:', e);
      }
      return next;
    });
  }, []);

  const resetRegion = useCallback(() => {
    setRegion(DEFAULT_MANAGE_REGION);
  }, [setRegion]);

  return (
    <ManageRegionContext.Provider value={{ region, setRegion, resetRegion }}>
      {children}
    </ManageRegionContext.Provider>
  );
}

export function useManageRegion() {
  return useContext(ManageRegionContext);
}
