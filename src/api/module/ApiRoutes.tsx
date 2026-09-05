const ROOT = process.env.NEXT_PUBLIC_API_ROOT || '';

// notification
const NOTIFICATION_ROOT = `${ROOT}/notification`;
const NOTIFICATION_LIST = `${NOTIFICATION_ROOT}/list`;
const NOTIFICATION_READ = `${NOTIFICATION_ROOT}/read`;
const NOTIFICATION_READ_ALL = `${NOTIFICATION_ROOT}/read-all`;
const NOTIFICATION_SUBSCRIBE = `${NOTIFICATION_ROOT}/subscribe`;

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
const ADMIN_USER_CREATE = `${ADMIN_ROOT}/user/create`;
const ADMIN_USER_UPDATE = `${ADMIN_ROOT}/user/update`;
const ADMIN_USER_RESET_PW = `${ADMIN_ROOT}/user/reset-password`;
const ADMIN_USER_DELETE = (userId: string) => `${ADMIN_ROOT}/user/${userId}`;

// admin (site & household)
const ADMIN_SITE_LIST = `${ADMIN_ROOT}/site/list`;
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
const ADMIN_INQUIRY_PENDING_SUMMARY = `${ADMIN_ROOT}/inquiry/pending-summary`;
const ADMIN_INQUIRY_DETAIL = (inquiryId: string) => `${ADMIN_ROOT}/inquiry/${inquiryId}`;
const ADMIN_INQUIRY_ANSWER = (inquiryId: string) => `${ADMIN_ROOT}/inquiry/${inquiryId}/answer`;
const ADMIN_INQUIRY_DELETE = (inquiryId: string) => `${ADMIN_ROOT}/inquiry/${inquiryId}`;

const ApiRoutes = {
  AUTH_LOGIN,
  AUTH_REFRESH,
  NOTIFICATION_LIST,
  NOTIFICATION_READ,
  NOTIFICATION_READ_ALL,
  NOTIFICATION_SUBSCRIBE,
  CONTACT_SUBMIT,
  ADMIN_USER_LIST,
  ADMIN_USER_CREATE,
  ADMIN_USER_UPDATE,
  ADMIN_USER_RESET_PW,
  ADMIN_USER_DELETE,
  ADMIN_SITE_LIST,
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
  ADMIN_INQUIRY_PENDING_SUMMARY,
  ADMIN_INQUIRY_DETAIL,
  ADMIN_INQUIRY_ANSWER,
  ADMIN_INQUIRY_DELETE,
};

export default ApiRoutes;