const ROOT = process.env.NEXT_PUBLIC_API_ROOT || '';

// notification
const NOTIFICATION_ROOT = `${ROOT}/notification`;
const NOTIFICATION_LIST = `${NOTIFICATION_ROOT}/list`;
const NOTIFICATION_READ = `${NOTIFICATION_ROOT}/read`;
const NOTIFICATION_READ_ALL = `${NOTIFICATION_ROOT}/read-all`;
const NOTIFICATION_SUBSCRIBE = `${NOTIFICATION_ROOT}/subscribe`;
const NOTIFICATION_PUSH_VAPID_KEY = `${NOTIFICATION_ROOT}/push/vapid-key`;
const NOTIFICATION_PUSH_SUBSCRIBE = `${NOTIFICATION_ROOT}/push/subscribe`;
const NOTIFICATION_PUSH_UNSUBSCRIBE = `${NOTIFICATION_ROOT}/push/unsubscribe`;
const NOTIFICATION_PUSH_TEST = `${NOTIFICATION_ROOT}/push/test`;
const NOTIFICATION_SETTINGS = `${NOTIFICATION_ROOT}/settings`;

// auth
const AUTH_ROOT = `${ROOT}/auth`;
const AUTH_LOGIN = `${AUTH_ROOT}/login`;
const AUTH_REFRESH = `${AUTH_ROOT}/refresh`;

// contact
const CONTACT_ROOT = `${ROOT}/contact`;
const CONTACT_SUBMIT = `${CONTACT_ROOT}/submit`;

// admin (user)
const ADMIN_ROOT = `${ROOT}/admin`;
const ADMIN_USER_LIST = `${ADMIN_ROOT}/user/list`;
const ADMIN_USER_LIST_PAGED = `${ADMIN_ROOT}/user/paged`;
const ADMIN_USER_EXPORT_EXCEL = `${ADMIN_ROOT}/user/export/excel`;
const ADMIN_USER_CREATE = `${ADMIN_ROOT}/user/create`;
const ADMIN_USER_UPDATE = `${ADMIN_ROOT}/user/update`;
const ADMIN_USER_RESET_PW = `${ADMIN_ROOT}/user/reset-password`;
const ADMIN_USER_DELETE = (userId: string) => `${ADMIN_ROOT}/user/${userId}`;

// admin (site & household)
const ADMIN_SITE_LIST = `${ADMIN_ROOT}/site/list`;
const ADMIN_SITE_LIST_PAGED = `${ADMIN_ROOT}/site/paged`;
const ADMIN_SITE_EXPORT_EXCEL = `${ADMIN_ROOT}/site/export/excel`;
const ADMIN_SITE_DETAIL = (siteId: string) => `${ADMIN_ROOT}/site/${siteId}`;
const ADMIN_SITE_CREATE = `${ADMIN_ROOT}/site`;
const ADMIN_SITE_UPDATE = (siteId: string) => `${ADMIN_ROOT}/site/${siteId}`;
const ADMIN_SITE_DELETE = (siteId: string) => `${ADMIN_ROOT}/site/${siteId}`;
const ADMIN_HOUSEHOLD_ADD = (siteId: string) => `${ADMIN_ROOT}/site/${siteId}/household`;
const ADMIN_HOUSEHOLD_DELETE = (siteId: string, householdId: string) => `${ADMIN_ROOT}/site/${siteId}/household/${householdId}`;

// admin (regions & assignments)
const ADMIN_FIRE_REGION_LIST = `${ADMIN_ROOT}/region/fire-regions`;
const ADMIN_REGION_WORKERS = `${ADMIN_ROOT}/region/workers`;
const ADMIN_USER_REGIONS = (userId: string) => `${ADMIN_ROOT}/user/${userId}/regions`;
const ADMIN_USER_REGION_DELETE = (userId: string, regionId: string) => `${ADMIN_ROOT}/user/${userId}/regions/${regionId}`;

// admin (inquiry)
const ADMIN_INQUIRY_LIST = `${ADMIN_ROOT}/inquiry/list`;
const ADMIN_INQUIRY_LIST_PAGED = `${ADMIN_ROOT}/inquiry/paged`;
const ADMIN_INQUIRY_EXPORT_EXCEL = `${ADMIN_ROOT}/inquiry/export/excel`;
const ADMIN_INQUIRY_PENDING_SUMMARY = `${ADMIN_ROOT}/inquiry/pending-summary`;
const ADMIN_INQUIRY_DETAIL = (inquiryId: string) => `${ADMIN_ROOT}/inquiry/${inquiryId}`;
const ADMIN_INQUIRY_ANSWER = (inquiryId: string) => `${ADMIN_ROOT}/inquiry/${inquiryId}/answer`;
const ADMIN_INQUIRY_DELETE = (inquiryId: string) => `${ADMIN_ROOT}/inquiry/${inquiryId}`;

// admin (report)
const ADMIN_REPORT_LIST = `${ADMIN_ROOT}/report/list`;
const ADMIN_REPORT_LIST_PAGED = `${ADMIN_ROOT}/report/paged`;
const ADMIN_REPORT_EXPORT_EXCEL = `${ADMIN_ROOT}/report/export/excel`;
const ADMIN_REPORT_DETAIL = (reportId: string) => `${ADMIN_ROOT}/report/${reportId}`;
const ADMIN_REPORT_STATUS = (reportId: string) => `${ADMIN_ROOT}/report/${reportId}/status`;
const ADMIN_REPORT_DELETE = (reportId: string) => `${ADMIN_ROOT}/report/${reportId}`;
const ADMIN_REPORT_DELETED_PAGED = `${ADMIN_ROOT}/report/deleted`;

// admin (dashboard)
const ADMIN_WORKER_RANKING = `${ADMIN_ROOT}/worker/ranking`;
const ADMIN_DASHBOARD_SUMMARY = `${ADMIN_ROOT}/dashboard/summary`;

// admin (data import)
const ADMIN_IMPORT_EXCEL = `${ADMIN_ROOT}/data/import-excel`;

// admin (settings)
const ADMIN_SETTINGS = `${ADMIN_ROOT}/settings`;

// portal
const PORTAL_ROOT = `${ROOT}/portal`;
const PORTAL_PROFILE = `${PORTAL_ROOT}/profile`;
const PORTAL_PROFILE_PASSWORD = `${PORTAL_PROFILE}/password`;
const PORTAL_REGIONS = `${PORTAL_ROOT}/regions`;
const PORTAL_REGION_DELETE = (regionId: string) => `${PORTAL_ROOT}/regions/${regionId}`;
const PORTAL_REGION_SUMMARY = (regionId: string) => `${PORTAL_ROOT}/regions/${regionId}/summary`;
const PORTAL_FIRE_REGIONS = `${PORTAL_ROOT}/fire-regions`;
const PORTAL_SITES = `${PORTAL_ROOT}/sites`;
const PORTAL_SITE_DETAIL = (siteId: string) => `${PORTAL_ROOT}/sites/${siteId}`;
const PORTAL_REPORT_SUBMIT = `${PORTAL_ROOT}/report`;
const PORTAL_REPORT_BY_HOUSEHOLD = (householdId: string) => `${PORTAL_ROOT}/report/${householdId}`;
const PORTAL_REPORTS = `${PORTAL_ROOT}/reports`;
const PORTAL_INQUIRIES = `${PORTAL_ROOT}/inquiries`;
const PORTAL_NOTICE = `${PORTAL_ROOT}/notice`;

const ApiRoutes = {
  AUTH_LOGIN,
  AUTH_REFRESH,
  NOTIFICATION_LIST,
  NOTIFICATION_READ,
  NOTIFICATION_READ_ALL,
  NOTIFICATION_SUBSCRIBE,
  NOTIFICATION_PUSH_VAPID_KEY,
  NOTIFICATION_PUSH_SUBSCRIBE,
  NOTIFICATION_PUSH_UNSUBSCRIBE,
  NOTIFICATION_PUSH_TEST,
  NOTIFICATION_SETTINGS,
  CONTACT_SUBMIT,
  ADMIN_USER_LIST,
  ADMIN_USER_LIST_PAGED,
  ADMIN_USER_EXPORT_EXCEL,
  ADMIN_USER_CREATE,
  ADMIN_USER_UPDATE,
  ADMIN_USER_RESET_PW,
  ADMIN_USER_DELETE,
  ADMIN_SITE_LIST,
  ADMIN_SITE_LIST_PAGED,
  ADMIN_SITE_EXPORT_EXCEL,
  ADMIN_SITE_DETAIL,
  ADMIN_SITE_CREATE,
  ADMIN_SITE_UPDATE,
  ADMIN_SITE_DELETE,
  ADMIN_HOUSEHOLD_ADD,
  ADMIN_HOUSEHOLD_DELETE,
  ADMIN_FIRE_REGION_LIST,
  ADMIN_REGION_WORKERS,
  ADMIN_USER_REGIONS,
  ADMIN_USER_REGION_DELETE,
  ADMIN_INQUIRY_LIST,
  ADMIN_INQUIRY_LIST_PAGED,
  ADMIN_INQUIRY_EXPORT_EXCEL,
  ADMIN_INQUIRY_PENDING_SUMMARY,
  ADMIN_INQUIRY_DETAIL,
  ADMIN_INQUIRY_ANSWER,
  ADMIN_INQUIRY_DELETE,
  ADMIN_REPORT_LIST,
  ADMIN_REPORT_LIST_PAGED,
  ADMIN_REPORT_EXPORT_EXCEL,
  ADMIN_REPORT_DETAIL,
  ADMIN_REPORT_STATUS,
  ADMIN_REPORT_DELETE,
  ADMIN_REPORT_DELETED_PAGED,
  ADMIN_WORKER_RANKING,
  ADMIN_DASHBOARD_SUMMARY,
  ADMIN_IMPORT_EXCEL,
  ADMIN_SETTINGS,
  PORTAL_PROFILE,
  PORTAL_PROFILE_PASSWORD,
  PORTAL_REGIONS,
  PORTAL_REGION_DELETE,
  PORTAL_REGION_SUMMARY,
  PORTAL_FIRE_REGIONS,
  PORTAL_SITES,
  PORTAL_SITE_DETAIL,
  PORTAL_REPORT_SUBMIT,
  PORTAL_REPORT_BY_HOUSEHOLD,
  PORTAL_REPORTS,
  PORTAL_INQUIRIES,
  PORTAL_NOTICE,
};

export default ApiRoutes;