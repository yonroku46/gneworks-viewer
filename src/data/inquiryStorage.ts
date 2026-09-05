import dayjs from 'dayjs';
import { INITIAL_INQUIRIES } from './inquiryData';

const INQUIRIES_STORAGE_KEY = 'gneworks_inquiries_data_v1';
const INQUIRIES_UPDATE_EVENT = 'gneworks_inquiries_updated';

export const getStoredInquiries = (): Inquiry[] => {
  if (typeof window === 'undefined') return INITIAL_INQUIRIES;
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INQUIRIES;
  } catch (e) {
    console.error('[inquiryStorage] Failed to read from localStorage', e);
    return INITIAL_INQUIRIES;
  }
};

export const saveStoredInquiries = (inquiries: Inquiry[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
    window.dispatchEvent(new CustomEvent(INQUIRIES_UPDATE_EVENT, { detail: inquiries }));
  } catch (e) {
    console.error('[inquiryStorage] Failed to save to localStorage', e);
  }
};

export const addStoredInquiry = (inquiry: Partial<Inquiry> & { inquiryContents: string; phoneNum: string }): Inquiry => {
  const current = getStoredInquiries();
  const dateStr = dayjs().format('YYYY-MM-DD HH:mm');

  const newInquiry: Inquiry = {
    inquiryId: `inq_${dayjs().valueOf()}`,
    userId: inquiry.userId,
    userName: inquiry.userName,
    phoneNum: inquiry.phoneNum,
    inquiryType: inquiry.inquiryType || 'general',
    inquiryContents: inquiry.inquiryContents,
    createTime: dateStr,
    processedFlg: false,
    deleteFlg: false,
  };

  const updated = [newInquiry, ...current];
  saveStoredInquiries(updated);
  return newInquiry;
};

export const updateStoredInquiry = (inquiryId: string, updates: Partial<Inquiry>): Inquiry | undefined => {
  const current = getStoredInquiries();
  const index = current.findIndex(i => i.inquiryId === inquiryId);
  if (index === -1) return undefined;

  const updatedItem: Inquiry = {
    ...current[index],
    ...updates,
  };
  current[index] = updatedItem;
  saveStoredInquiries(current);
  return updatedItem;
};

export const subscribeToInquiriesUpdate = (callback: (inquiries: Inquiry[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<Inquiry[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredInquiries());
    }
  };

  window.addEventListener(INQUIRIES_UPDATE_EVENT, handleUpdate);
  return () => window.removeEventListener(INQUIRIES_UPDATE_EVENT, handleUpdate);
};
