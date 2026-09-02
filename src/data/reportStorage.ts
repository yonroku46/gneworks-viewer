import { INITIAL_REPORTS_DATA, WorkReport } from './reportData';

const REPORTS_STORAGE_KEY = 'gneworks_reports_data_v1';
const REPORTS_UPDATE_EVENT = 'gneworks_reports_updated';

export const getStoredReports = (): WorkReport[] => {
  if (typeof window === 'undefined') {
    return INITIAL_REPORTS_DATA;
  }
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(INITIAL_REPORTS_DATA));
      return INITIAL_REPORTS_DATA;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load reports from storage:', error);
    return INITIAL_REPORTS_DATA;
  }
};

export const saveStoredReports = (reports: WorkReport[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    window.dispatchEvent(new CustomEvent(REPORTS_UPDATE_EVENT, { detail: reports }));
  } catch (error) {
    console.error('Failed to save reports to storage:', error);
  }
};

export const upsertReport = (report: Partial<WorkReport> & { siteName: string; dong: string; ho: string }): WorkReport => {
  const current = getStoredReports();
  const existingIdx = current.findIndex(
    r => r.siteName === report.siteName && r.dong === report.dong && r.ho === report.ho
  );

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const timeStr = `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const formattedDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

  let updatedReport: WorkReport;

  if (existingIdx >= 0) {
    updatedReport = {
      ...current[existingIdx],
      ...report,
      installDate: report.installDate || current[existingIdx].installDate || dateStr,
      installDateFormatted: report.installDateFormatted || current[existingIdx].installDateFormatted || formattedDate,
      reportTime: timeStr,
      submittedAt: timeStr,
      status: '검토대기',
    };
    current[existingIdx] = updatedReport;
  } else {
    updatedReport = {
      id: `rep_${Date.now()}`,
      siteId: report.siteId || 'site_custom',
      siteName: report.siteName,
      sido: report.sido || '경기도',
      sigungu: report.sigungu || '',
      eupmyeondong: report.eupmyeondong || '',
      address: report.address || '',
      dong: report.dong,
      ho: report.ho,
      headName: report.headName || '세대주',
      installDate: report.installDate || dateStr,
      installDateFormatted: report.installDateFormatted || formattedDate,
      reportTime: timeStr,
      reporterName: report.reporterName || '작업자',
      installerId: report.installerId || 'current_worker',
      visitorName: report.visitorName || report.reporterName || '작업자',
      confirmerName: report.confirmerName || report.headName || '세대주',
      photos: report.photos || [
        { title: '신주소 보이는 대문 등', url: '/assets/img/report_sheet_sample.png', type: 'door' },
        { title: '설치 전 ①', url: '/assets/img/report_sheet_sample.png', type: 'before1' },
        { title: '설치 후 ①', url: '/assets/img/report_sheet_sample.png', type: 'after1' },
      ],
      status: '검토대기',
      submittedAt: timeStr,
      remarks: report.remarks || '현장 작업 완료 및 확인서 작성 완료',
    };
    current.unshift(updatedReport);
  }

  saveStoredReports(current);
  return updatedReport;
};

export const subscribeToReportsUpdate = (callback: (reports: WorkReport[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<WorkReport[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredReports());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === REPORTS_STORAGE_KEY) {
      callback(getStoredReports());
    }
  };

  window.addEventListener(REPORTS_UPDATE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(REPORTS_UPDATE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};
