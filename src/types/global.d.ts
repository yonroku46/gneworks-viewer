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
  // ─── Region & Address (지역 & 행정구역) ───
  interface SigunguData {
    name: string;
    eupmyeondongs: string[];
  }
  interface SidoData {
    code: string;
    name: string;
    shortName: string;
    sigungus: SigunguData[];
  }
  interface RegionValue {
    sido: string;
    sigungu: string;
    eupmyeondong: string;
  }
  interface AssignedRegion {
    id: string;          // e.g. '경기도_안산시'
    sido: string;        // e.g. '경기도'
    sigungu: string;     // e.g. '안산시'
    assignedDate?: string; // e.g. '2026.09.02'
  }

  // ─── Site & Household & Assignment (현장, 세대, 작업자 배정) ───
  type HouseholdTargetType = '노인(65세 이상)' | '아동(13세 미만)' | '장애인' | '일반';
  type HouseholdInstallStatus = InstallStatus | '설치완료' | '방문예정' | '부재/보류' | '미설치';

  interface Household {
    id: string;
    seq?: number | string;      // 세대/명부 연번 (순번)
    dong: string;
    ho: string;
    headName: string;
    targetType: HouseholdTargetType;
    installStatus: HouseholdInstallStatus;
    remarks?: string;
  }

  interface AssignedWorker {
    userId: string;
    userName: string;
    userPhone?: string;
  }

  type SiteStatus = '진행중' | '대기' | '완료';

  interface SiteInfo {
    id: string;
    name: string;
    address: string;
    region: string;
    sido: string;               // 광역시/도 (예: '경기도')
    sigungu: string;            // 시/군/구 (예: '연천군', '수원시')
    eupmyeondong: string;       // 읍/면/동 (예: '연천읍', '전곡읍', '팔달구 (우만동)')
    routeGroup: string;         // 이동동선 그룹 (예: '연천 1동선 (연천읍 권역)', '수원 2동선 (우만/팔달 B권역)')
    dongCount: number;
    dongList: string[];
    totalHouseholds: number;
    completedHouseholds: number;
    contactPhone: string;
    status: SiteStatus;
    assignedWorkers?: AssignedWorker[];
    assignedUserId?: string;      // (하위 호환) 대표 작업자 아이디
    assignedUserName?: string;    // (하위 호환) 대표 담당자 성명
    assignedUserPhone?: string;   // (하위 호환) 대표 연락처
    workStartDate?: string;       // 작업 시작일자
    workCompletedCount?: number;  // 실제 작업/설치 대수
    households: Household[];
  }

  interface TargetHousehold {
    siteId: string;
    siteName: string;
    sido: string;
    sigungu: string;
    eupmyeondong: string;
    address: string;
    dong: string;
    ho: string;
    headName: string;
    existingReport?: WorkReport;
  }

  // ─── Common UI Models ───
  interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }
  type StatusVariant = 'installed' | 'needs-fix' | 'hold' | 'scheduled' | 'uninstalled';
  type WorkStatusFilter =
    | 'all'
    | 'uncompleted'
    | 'unsubmitted'
    | 'pending'
    | 'revise'
    | 'completed';
  type NotificationIconType = 'LOGO' | 'AVATAR';
  type ReportStatus = 'COMPLETED' | 'PENDING' | 'REJECTED' | 'UNSUBMITTED';
  type InstallStatus = 'INSTALLED' | 'SCHEDULED' | 'HOLD' | 'UNINSTALLED';
  type InquiryStatus = 'RESOLVED' | 'WAITING';
  type ReportPhotoType = 'DOOR' | 'BEFORE1' | 'AFTER1' | 'BEFORE2' | 'AFTER2';
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
  interface LoginUserRes {
    userId: string;
    userName: string;
    profileImg: string;
    phoneNum?: string;
    gender: string;
    token: string;
    refreshToken: string;
    signatureImg?: string;
    mngFlg?: boolean;
  }
  // DB
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
    mngFlg?: boolean;
    role?: string;
  }
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
}

export {};