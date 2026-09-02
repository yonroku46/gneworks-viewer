import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * 로그인
   * POST /auth/login
   */
  async login(userId: string, password: string): Promise<LoginUserRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.AUTH_LOGIN, { userId, password });
      if (response && !response.hasErrors) {
        return response.responseData as LoginUserRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Login failed');
    } catch (error) {
      console.error('[AuthService] login', error);
      throw error;
    }
  }

  /**
   * 토큰 갱신
   * POST /auth/refresh
   */
  async refresh(refreshToken: string): Promise<{ token: string } | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.AUTH_REFRESH, { refreshToken });
      if (response && !response.hasErrors) {
        return response.responseData as { token: string };
      }
      throw new Error(response?.informations?.[0]?.message || 'Token refresh failed');
    } catch (error) {
      console.error('[AuthService] refresh', error);
      throw error;
    }
  }
}

export default AuthService.getInstance();
