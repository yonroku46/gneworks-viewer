declare global {
  // View
  interface Window {
    fbq: any;
    gtag: any;
    dataLayer: any[];
  }
  interface MenuItem {
    label: string;
    href: string;
    icon: React.ElementType;
  }
  interface MenuGroup {
    groupTitle?: string;
    items: MenuItem[];
  }
  interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }
  interface SelectedRegion {
    sido: string;
    sigungu: string;
    eupmyeondong: string;
  }
  interface SidoData {
    code: string;
    name: string;
    shortName: string;
    sigungus: SigunguData[];
  }
  interface SigunguData {
    regionId?: string;
    name: string;
    eupmyeondongs: string[];
  }
  type DatePreset = 'all' | 'today' | 'week' | 'month' | 'custom';
  type StatusFilterType = 'ALL' | 'COMPLETED' | 'PENDING' | 'REJECTED';
  // Region & Address (지역 & 행정구역)
  interface FireRegion {
    regionId: string;
    sidoCode: string;
    sidoName: string;
    name: string;
    eupmyeondongs: string[];
  }
  type StatusVariant = 'installed' | 'needs-fix' | 'hold' | 'scheduled' | 'uninstalled';
  type WorkStatusFilter =
    | 'all'
    | 'uncompleted'
    | 'unsubmitted'
    | 'pending'
    | 'revise'
    | 'completed';
  type ReportStatus = 'COMPLETED' | 'PENDING' | 'REJECTED' | 'UNSUBMITTED';
  interface ReportPhoto {
    title: string;
    url: string;
    type: ReportPhotoType;
  }
  interface WorkReport {
    reportId: string;
    siteId: string;
    siteName: string;
    sido: string;
    sigungu: string;
    eupmyeondong: string;
    address: string;
    dong: string;
    ho: string;
    headName: string;
    installDate: string;          // YYYY-MM-DD
    installDateFormatted: string; // YYYY년 M월 D일
    reportTime: string;           // YYYY-MM-DD HH:mm
    reporterName: string;
    installerName?: string;
    installerId: string;
    visitorName: string;
    confirmerName: string;
    confirmerSignature?: string;
    photos: ReportPhoto[];
    status: ReportStatus;
    fixReason?: string;
    submittedAt?: string;
    remarks?: string;
  }
  // API
  interface ApiResponse {
    resultCode: number;
    hasErrors: boolean;
    informations: Array<any>;
    errors: Array<any>;
    responseData: any;
  }
  interface ActionRes {
    success: boolean;
    id?: string;
  }
  interface ListRes<T> {
    list: Array<T>;
  }
  interface CountRes {
    count: number;
  }
  interface InquiryReq {
    userName: string;
    userId?: string;
    phoneNum: string;
    inquiryType: string;
    inquiryContents: string;
  }
  interface AdminUserCreateReq {
    userId: string;
    userName: string;
    phoneNum: string;
    birthday?: string;
    gender?: string;
    postalCode?: string;
    detailAddress?: string;
  }
  interface AdminUserUpdateReq {
    userId: string;
    userName?: string;
    phoneNum?: string;
    birthday?: string;
    gender?: string;
    postalCode?: string;
    detailAddress?: string;
  }
  interface AdminInquiryAnswerReq {
    answerContents: string;
    processedFlg: boolean;
  }
  interface AdminInquiryPendingSummary {
    pendingCount: number;
    latestPendingInquiry?: Inquiry;
  }
  interface LoginUserRes {
    userId: string;
    userName: string;
    profileImg: string;
    phoneNum?: string;
    gender: string;
    token: string;
    refreshToken: string;
    mngFlg?: boolean;
  }
  // DB
  // AppNotification
  type NotificationIconType = 'LOGO' | 'AVATAR';
  interface AppNotification {
    appNotificationId: string;
    userId: string;
    centerId?: string;
    title: string;
    message: string;
    centerName?: string;
    isRead: boolean;
    iconType: NotificationIconType;
    createTime: string;
  }
  // Inquiry
  type InquiryStatus = 'RESOLVED' | 'WAITING';
  interface Inquiry {
    inquiryId: string;
    userId?: string;
    inquiryType: string;
    phoneNum: string;
    inquiryContents: string;
    userName?: string;
    answerUserName?: string;
    answerContents?: string;
    createTime: string;
    answerTime?: string;
    processedFlg: boolean;
    deleteFlg: boolean;
  }
  // User & AssignedRegion
  interface User {
    userId: string;
    userName: string;
    phoneNum: string;
    profileImg?: string;
    birthday?: string;
    gender?: string;
    postalCode?: string;
    detailAddress?: string;
    lastUpdated: string;
    createTime: string;
  }
  interface UserAssignedRegion {
    assignedRegionId: string;
    userId: string;
    regionId: string;
    assignedDate?: string;
  }
  interface UserAssignedRegionDetail extends UserAssignedRegion {
    sido: string;
    sigungu: string;
  }
  interface RegionWorkerUser extends User {
    assignedRegions?: UserAssignedRegionDetail[];
  }
  // Site & Household & Assignment (현장, 세대, 작업자 배정)
  type HouseholdTargetType = 'ELDERLY' | 'CHILD' | 'DISABLED' | 'GENERAL';
  type InstallStatus = 'INSTALLED' | 'SCHEDULED' | 'HOLD' | 'UNINSTALLED';
  type SiteStatus = 'IN_PROGRESS' | 'READY' | 'COMPLETED';
  type ReportPhotoType = 'DOOR' | 'BEFORE1' | 'AFTER1' | 'BEFORE2' | 'AFTER2';
  interface Site {
    siteId: string;
    regionId?: string;
    name: string;
    region: string;
    address: string;
    sido: string;
    sigungu: string;
    eupmyeondong: string;
    contactPhone?: string;
    createTime: string;
  }
  interface Household {
    householdId: string;
    siteId: string;
    dong: string;
    ho: string;
    headName: string;
    targetType: HouseholdTargetType;
    installStatus: InstallStatus;
    remarks?: string;
    createTime: string;
  }
  interface SiteDetail extends Site {
    dongCount: number;
    totalHouseholds: number;
    completedHouseholds: number;
    status: SiteStatus;
    households: Household[];
    assignedWorkers?: RegionWorkerUser[];
  }
}

export {};