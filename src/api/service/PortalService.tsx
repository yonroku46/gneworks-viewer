import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

class PortalService {
  private static instance: PortalService;

  private constructor() {}

  public static getInstance(): PortalService {
    if (!PortalService.instance) {
      PortalService.instance = new PortalService();
    }
    return PortalService.instance;
  }

  /**
   * 본인 프로필 조회
   * GET /portal/profile
   */
  async getProfile(): Promise<User> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_PROFILE);
      if (response && !response.hasErrors) {
        return response.responseData as User;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch profile');
    } catch (error) {
      console.error('[PortalService] getProfile', error);
      throw error;
    }
  }

  /**
   * 본인 프로필 수정 (연락처 및 프로필 사진만 수정 가능)
   * PATCH /portal/profile
   */
  async updateProfile(data: { phoneNum?: string; profileImg?: string }): Promise<User> {
    try {
      const response: ApiResponse = await ApiInstance.patch(ApiRoutes.PORTAL_PROFILE, data);
      if (response && !response.hasErrors) {
        return response.responseData as User;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to update profile');
    } catch (error) {
      console.error('[PortalService] updateProfile', error);
      throw error;
    }
  }

  /**
   * 본인 배정 관할 목록 조회
   * GET /portal/regions
   */
  async getAssignedRegions(): Promise<UserAssignedRegionDetail[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_REGIONS);
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<UserAssignedRegionDetail>;
        return data?.list || [];
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch assigned regions');
    } catch (error) {
      console.error('[PortalService] getAssignedRegions', error);
      throw error;
    }
  }

  /**
   * 본인에게 소방관할 배정 등록
   * POST /portal/regions
   */
  async assignRegion(sido: string, sigungu: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.PORTAL_REGIONS, {
        sidoName: sido,
        regionName: sigungu,
      });
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to assign region');
    } catch (error) {
      console.error('[PortalService] assignRegion', error);
      throw error;
    }
  }

  /**
   * 본인의 소방관할 배정 해제
   * DELETE /portal/regions/{regionId}
   */
  async unassignRegion(regionId: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.delete(ApiRoutes.PORTAL_REGION_DELETE(regionId));
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to unassign region');
    } catch (error) {
      console.error('[PortalService] unassignRegion', error);
      throw error;
    }
  }

  /**
   * 전체 소방관할 목록 조회
   * GET /portal/fire-regions
   */
  async getFireRegions(): Promise<FireRegion[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_FIRE_REGIONS);
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<FireRegion>;
        return data?.list || [];
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch fire regions');
    } catch (error) {
      console.error('[PortalService] getFireRegions', error);
      throw error;
    }
  }

  /**
   * 현장 목록 조회
   * GET /portal/sites
   */
  async getSites(params?: {
    sido?: string;
    sigungu?: string;
    eupmyeondong?: string;
    query?: string;
    includeHouseholds?: boolean;
  }): Promise<SiteDetail[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_SITES, { params });
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<SiteDetail>;
        return data?.list || [];
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch sites');
    } catch (error) {
      console.error('[PortalService] getSites', error);
      throw error;
    }
  }

  /**
   * 현장 상세 조회 (세대 목록 포함)
   * GET /portal/sites/{siteId}
   */
  async getSiteDetail(siteId: string): Promise<SiteDetail> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_SITE_DETAIL(siteId));
      if (response && !response.hasErrors) {
        return response.responseData as SiteDetail;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch site detail');
    } catch (error) {
      console.error('[PortalService] getSiteDetail', error);
      throw error;
    }
  }
}

export default PortalService.getInstance();
