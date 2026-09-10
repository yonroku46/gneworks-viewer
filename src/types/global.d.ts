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
    regionId?: string;
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
  type PhotoSlotKey = 'photoDoor' | 'photoBefore1' | 'photoAfter1' | 'photoBefore2' | 'photoAfter2';
  interface WorkReport {
    reportId: string;
    householdId?: string;
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
    installDateFormatted?: string; // YYYY년 M월 D일
    reportTime?: string;           // YYYY-MM-DD HH:mm
    reporterName: string;
    installerName?: string;
    installerId: string;
    visitorName: string;
    confirmerName: string;
    confirmerSignature?: string;
    photoDoor?: string;           // 신주소 보이는 대문 등
    photoBefore1?: string;        // 단독경보형감지기 보급 전 ①
    photoAfter1?: string;         // 단독경보형감지기 보급 후 ①
    photoBefore2?: string;        // 단독경보형감지기 보급 전 ②
    photoAfter2?: string;         // 단독경보형감지기 보급 후 ②
    status: ReportStatus;
    fixReason?: string;
    submittedAt?: string;
    remarks?: string;
    createTime?: string;
  }
  interface WorkReportDeletionLog {
    logId: string;
    reportId: string;
    householdId?: string;
    siteId?: string;
    userId?: string;
    dong?: string;
    ho?: string;
    headName?: string;
    installDate?: string;
    reportTime?: string;
    reporterName?: string;
    confirmerName?: string;
    confirmerSignature?: string;
    photoDoor?: string;
    photoBefore1?: string;
    photoAfter1?: string;
    photoBefore2?: string;
    photoAfter2?: string;
    status?: ReportStatus;
    remarks?: string;
    fixReason?: string;
    createTime?: string;
    siteName: string;
    regionId?: string;
    sido?: string;
    sigungu?: string;
    eupmyeondong?: string;
    address?: string;
    deleteReason: string;
    deletedBy: string;
    deletedByName?: string;
    deletedTime: string;
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
    totalCount?: number;
  }
  interface PageRes<T> {
    list: Array<T>;
    totalCount: number;
    page: number;
    size: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
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
    website?: string;
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
  interface AdminReportSearchReq {
    regionId?: string;
    status?: string;
    installStartDate?: string;
    installEndDate?: string;
    reportStartDate?: string;
    reportEndDate?: string;
    query?: string;
    siteId?: string;
    userId?: string;
    limit?: number;
    orderBy?: string;
    hasRemarks?: boolean;
    page?: number;
    size?: number;
  }
  interface AdminInquirySearchReq {
    status?: string;
    inquiryType?: string;
    startDate?: string;
    endDate?: string;
    query?: string;
    page?: number;
    size?: number;
  }
  interface AdminUserSearchReq {
    query?: string;
    roleId?: number;
    page?: number;
    size?: number;
  }
  interface WorkReportReq {
    householdId?: string;
    siteId?: string;
    dong?: string;
    ho?: string;
    headName?: string;
    installDate?: string;
    reporterName?: string;
    confirmerName?: string;
    confirmerSignature?: string;
    photoDoor?: string;
    photoBefore1?: string;
    photoAfter1?: string;
    photoBefore2?: string;
    photoAfter2?: string;
    status?: ReportStatus;
    remarks?: string;
  }
  interface AdminDeletionLogSearchReq {
    regionId?: string;
    sido?: string;
    sigungu?: string;
    query?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
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
    regionCount?: number;
    reportCount?: number;
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
  interface HouseholdRes extends Household {
    reportId?: string;
    reportStatus?: ReportStatus;
    reportUserId?: string;
    reporterName?: string;
    reportTime?: string;
  }
  interface SiteDetail extends Site {
    dongCount: number;
    totalHouseholds: number;
    completedHouseholds: number;
    status: SiteStatus;
    households: HouseholdRes[];
    assignedWorkers?: RegionWorkerUser[];
  }
  interface SystemSettings {
    settingId?: number;
    contactPhone: string;
    contactEmail: string;
    noticeVisible: boolean;
    noticeTitle: string;
    noticeContent: string;
    noticeDate: string;
  }
  interface UserNotificationSetting {
    userId?: string;
    notifyWebPush: boolean;
    notifyNewReport: boolean;
    notifyNewInquiry: boolean;
    notifyReportStatus: boolean;
    notifyInquiryAnswer: boolean;
  }
  interface PortalNotice {
    noticeVisible: boolean;
    noticeTitle: string;
    noticeContent: string;
    noticeDate: string;
    contactPhone?: string;
    contactEmail?: string;
  }
  interface AdminWorkerStatRes {
    userId: string;
    name: string;
    phone?: string;
    profileImg?: string;
    total: number;
    completed: number;
    pending: number;
    rejected: number;
  }
  interface AdminDashboardSummaryRes {
    totalSites: number;
    totalTarget: number;
    completedTarget: number;
    progressRate: number;
    totalReports: number;
    todayReports: number;
    pendingReports: number;
    rejectedReports: number;
    completedReports: number;
    issueReportsCount: number;
    totalWorkers: number;
  }
  interface AdminImportResultRes {
    siteInserted: number;
    siteSkipped: number;
    householdInserted: number;
    householdSkipped: number;
    regionName?: string;
  }
}

export {};