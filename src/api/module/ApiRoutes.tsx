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

const ApiRoutes = {
  AUTH_LOGIN,
  AUTH_REFRESH,
  NOTIFICATION_LIST,
  NOTIFICATION_READ,
  NOTIFICATION_READ_ALL,
  NOTIFICATION_SUBSCRIBE,
  CONTACT_SUBMIT,
};

export default ApiRoutes;