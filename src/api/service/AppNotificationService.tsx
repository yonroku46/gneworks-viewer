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
}

export default AppNotificationService.getInstance();