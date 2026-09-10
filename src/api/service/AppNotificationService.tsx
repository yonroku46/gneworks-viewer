import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

class AppNotificationService {
  private static instance: AppNotificationService;

  private constructor() {}

  public static getInstance(): AppNotificationService {
    if (!AppNotificationService.instance) {
      AppNotificationService.instance = new AppNotificationService();
    }
    return AppNotificationService.instance;
  }

  /**
   * 알림 목록 조회
   * GET /notification/list
   */
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.NOTIFICATION_LIST);
      if (response && !response.hasErrors) {
        return response.responseData.list as AppNotification[];
      }
      return [];
    } catch (error) {
      console.error('[NotificationService] getNotifications', error);
      throw error;
    }
  }

  /**
   * 알림 읽음 처리
   * PATCH /notification/:id/read
   */
  async markAsRead(notificationId: string): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.patch(ApiRoutes.NOTIFICATION_READ, null, { params: { notificationId } });
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
    } catch (error) {
      console.error('[NotificationService] markAsRead', error);
      throw error;
    }
  }

  /**
   * 모든 알림 읽음 처리
   * PATCH /notification/read-all
   */
  async markAllAsRead(): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.patch(ApiRoutes.NOTIFICATION_READ_ALL);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
    } catch (error) {
      console.error('[NotificationService] markAllAsRead', error);
      throw error;
    }
  }

  /**
   * VAPID 공개키 조회
   * GET /notification/push/vapid-key
   */
  async getVapidPublicKey(): Promise<string> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.NOTIFICATION_PUSH_VAPID_KEY);
      if (response && !response.hasErrors) {
        return response.responseData?.publicKey || '';
      }
      return '';
    } catch (error) {
      console.error('[NotificationService] getVapidPublicKey', error);
      throw error;
    }
  }

  /**
   * 브라우저 웹 푸시 구독 등록
   * POST /notification/push/subscribe
   */
  async subscribePush(data: {
    endpoint: string;
    p256dh: string;
    auth: string;
    userAgent?: string;
  }): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.NOTIFICATION_PUSH_SUBSCRIBE, data);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
    } catch (error) {
      console.error('[NotificationService] subscribePush', error);
      throw error;
    }
  }

  /**
   * 브라우저 웹 푸시 구독 해제
   * POST /notification/push/unsubscribe
   */
  async unsubscribePush(data: { endpoint: string }): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.NOTIFICATION_PUSH_UNSUBSCRIBE, data);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
    } catch (error) {
      console.error('[NotificationService] unsubscribePush', error);
      throw error;
    }
  }

  /**
   * 테스트 푸시 알림 발송
   * POST /notification/push/test
   */
  async sendTestPush(): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.NOTIFICATION_PUSH_TEST, {});
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
    } catch (error) {
      console.error('[NotificationService] sendTestPush', error);
      throw error;
    }
  }

  /**
   * 사용자 알림 설정 조회
   * GET /notification/settings
   */
  async getUserNotificationSettings(): Promise<UserNotificationSetting> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.NOTIFICATION_SETTINGS);
      if (response && !response.hasErrors) {
        return response.responseData as UserNotificationSetting;
      }
      return {
        notifyWebPush: false,
        notifyNewReport: true,
        notifyNewInquiry: true,
        notifyReportStatus: true,
        notifyInquiryAnswer: true,
      };
    } catch (error) {
      console.error('[NotificationService] getUserNotificationSettings', error);
      return {
        notifyWebPush: false,
        notifyNewReport: true,
        notifyNewInquiry: true,
        notifyReportStatus: true,
        notifyInquiryAnswer: true,
      };
    }
  }

  /**
   * 사용자 알림 설정 변경
   * PUT /notification/settings
   */
  async updateUserNotificationSettings(data: Partial<UserNotificationSetting>): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.put(ApiRoutes.NOTIFICATION_SETTINGS, data);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
    } catch (error) {
      console.error('[NotificationService] updateUserNotificationSettings', error);
      throw error;
    }
  }
}

export default AppNotificationService.getInstance();