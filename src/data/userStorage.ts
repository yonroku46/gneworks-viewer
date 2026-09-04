import { INITIAL_USERS_DATA } from './userData';

const USERS_STORAGE_KEY = 'gneworks_users_data_v1';
const USERS_UPDATE_EVENT = 'gneworks_users_updated';

export const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') {
    return INITIAL_USERS_DATA;
  }
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS_DATA));
      return INITIAL_USERS_DATA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_USERS_DATA;
  } catch (error) {
    console.error('Failed to load users from storage:', error);
    return INITIAL_USERS_DATA;
  }
};

export const saveStoredUsers = (users: User[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent(USERS_UPDATE_EVENT, { detail: users }));
  } catch (error) {
    console.error('Failed to save users to storage:', error);
  }
};

export const updateStoredUser = (updatedUser: User): User[] => {
  const current = getStoredUsers();
  const next = current.map(u => (u.userId === updatedUser.userId ? updatedUser : u));
  saveStoredUsers(next);
  return next;
};

export const deleteStoredUser = (userId: string): User[] => {
  const current = getStoredUsers();
  const next = current.filter(u => u.userId !== userId);
  saveStoredUsers(next);
  return next;
};

export const subscribeToUsersUpdate = (callback: (users: User[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<User[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredUsers());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === USERS_STORAGE_KEY) {
      callback(getStoredUsers());
    }
  };

  window.addEventListener(USERS_UPDATE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(USERS_UPDATE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};
