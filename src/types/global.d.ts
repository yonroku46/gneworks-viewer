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
  type NotificationIconType = 'LOGO' | 'AVATAR';
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