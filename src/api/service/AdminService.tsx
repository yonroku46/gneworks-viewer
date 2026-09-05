import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

class AdminService {
  private static instance: AdminService;

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  /**
   * 계정 목록 조회
   * GET /admin/user/list
   */
  async getUserList(): Promise<User[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.ADMIN_USER_LIST);
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<User>;
        return data?.list || [];
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch user list');
    } catch (error) {
      console.error('[AdminService] getUserList', error);
      throw error;
    }
  }

  /**
   * 신규 계정 발급 (등록)
   * POST /admin/user/create
   */
  async createUser(req: AdminUserCreateReq): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.ADMIN_USER_CREATE, req);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to create user');
    } catch (error) {
      console.error('[AdminService] createUser', error);
      throw error;
    }
  }

  /**
   * 계정 정보 수정
   * PUT /admin/user/update
   */
  async updateUser(req: AdminUserUpdateReq): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.put(ApiRoutes.ADMIN_USER_UPDATE, req);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to update user');
    } catch (error) {
      console.error('[AdminService] updateUser', error);
      throw error;
    }
  }

  /**
   * 비밀번호 초기화 (전화번호로 변경)
   * POST /admin/user/reset-password
   */
  async resetPassword(userId: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.ADMIN_USER_RESET_PW, { userId });
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to reset password');
    } catch (error) {
      console.error('[AdminService] resetPassword', error);
      throw error;
    }
  }

  /**
   * 계정 삭제 (소프트 삭제)
   * DELETE /admin/user/{userId}
   */
  async deleteUser(userId: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.delete(ApiRoutes.ADMIN_USER_DELETE(userId));
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to delete user');
    } catch (error) {
      console.error('[AdminService] deleteUser', error);
      throw error;
    }
  }

  // ── [현장 및 세대 관리 API] ────────────────────────────────────

  /**
   * 현장 목록 조회
   * GET /admin/site/list
   */
  async getSiteList(params?: { sido?: string; sigungu?: string; eupmyeondong?: string; query?: string }): Promise<SiteDetail[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.ADMIN_SITE_LIST, { params });
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<SiteDetail>;
        return data?.list || [];
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch site list');
    } catch (error) {
      console.error('[AdminService] getSiteList', error);
      throw error;
    }
  }

  /**
   * 현장 상세 조회 (세대 목록 및 배정 작업자 포함)
   * GET /admin/site/{siteId}
   */
  async getSiteDetail(siteId: string): Promise<SiteDetail> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.ADMIN_SITE_DETAIL(siteId));
      if (response && !response.hasErrors) {
        const detail = response.responseData as SiteDetail;
        if (detail) {
          const cleanHouseholds = (detail.households || []).filter(h => !!h && !!h.householdId);
          detail.households = cleanHouseholds;
          detail.totalHouseholds = cleanHouseholds.length;
          detail.dongCount = new Set(cleanHouseholds.map(h => h.dong)).size;
        }
        return detail;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch site detail');
    } catch (error) {
      console.error('[AdminService] getSiteDetail', error);
      throw error;
    }
  }

  /**
   * 신규 현장 등록
   * POST /admin/site
   */
  async createSite(req: {
    name: string;
    address: string;
    sido?: string;
    sigungu?: string;
    eupmyeondong?: string;
    region?: string;
    regionId?: string;
    contactPhone?: string;
  }): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.ADMIN_SITE_CREATE, req);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to create site');
    } catch (error) {
      console.error('[AdminService] createSite', error);
      throw error;
    }
  }

  /**
   * 현장 정보 수정
   * PUT /admin/site/{siteId}
   */
  async updateSite(siteId: string, req: {
    name?: string;
    address?: string;
    sido?: string;
    sigungu?: string;
    eupmyeondong?: string;
    region?: string;
    regionId?: string;
    contactPhone?: string;
  }): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.put(ApiRoutes.ADMIN_SITE_UPDATE(siteId), req);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to update site');
    } catch (error) {
      console.error('[AdminService] updateSite', error);
      throw error;
    }
  }

  /**
   * 현장 삭제 (소속 세대 일괄 삭제)
   * DELETE /admin/site/{siteId}
   */
  async deleteSite(siteId: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.delete(ApiRoutes.ADMIN_SITE_DELETE(siteId));
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to delete site');
    } catch (error) {
      console.error('[AdminService] deleteSite', error);
      throw error;
    }
  }

  /**
   * 세대 개별 등록
   * POST /admin/site/{siteId}/household
   */
  async addHousehold(siteId: string, req: {
    dong: string;
    ho: string;
    headName?: string;
    targetType?: HouseholdTargetType;
    installStatus?: InstallStatus;
    remarks?: string;
  }): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.ADMIN_HOUSEHOLD_ADD(siteId), req);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to add household');
    } catch (error) {
      console.error('[AdminService] addHousehold', error);
      throw error;
    }
  }

  /**
   * 세대 삭제
   * DELETE /admin/site/{siteId}/household/{householdId}
   */
  async deleteHousehold(siteId: string, householdId: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.delete(ApiRoutes.ADMIN_HOUSEHOLD_DELETE(siteId, householdId));
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to delete household');
    } catch (error) {
      console.error('[AdminService] deleteHousehold', error);
      throw error;
    }
  }

  // ── [소방관할 및 관할배정 API] ────────────────────────────────

  /**
   * 전체 소방관할 목록 조회
   * GET /admin/region/fire-regions
   */
  async getFireRegions(): Promise<FireRegion[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.ADMIN_FIRE_REGION_LIST);
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<FireRegion>;
        return data?.list || [];
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch fire regions');
    } catch (error) {
      console.error('[AdminService] getFireRegions', error);
      throw error;
    }
  }

  /**
   * 특정 지역 담당 작업자 목록 조회
   * GET /admin/region/workers
   */
  async getRegionWorkers(params?: { sido?: string; sigungu?: string; regionId?: string }): Promise<RegionWorkerUser[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.ADMIN_REGION_WORKERS, { params });
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<RegionWorkerUser>;
        const list = data?.list || [];
        return list;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch region workers');
    } catch (error) {
      console.error('[AdminService] getRegionWorkers', error);
      throw error;
    }
  }

  /**
   * 특정 작업자의 배정 관할 목록 조회
   * GET /admin/user/{userId}/regions
   */
  async getUserAssignedRegions(userId: string): Promise<UserAssignedRegionDetail[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.ADMIN_USER_REGIONS(userId));
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<UserAssignedRegionDetail>;
        return data?.list || [];
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch user assigned regions');
    } catch (error) {
      console.error('[AdminService] getUserAssignedRegions', error);
      throw error;
    }
  }

  /**
   * 작업자에게 소방관할 배정
   * POST /admin/user/{userId}/regions
   */
  async assignRegion(userId: string, sido: string, sigungu: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.ADMIN_USER_REGIONS(userId), {
        sidoName: sido,
        regionName: sigungu,
      });
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to assign region');
    } catch (error) {
      console.error('[AdminService] assignRegion', error);
      throw error;
    }
  }

  /**
   * 작업자 소방관할 배정 해제
   * DELETE /admin/user/{userId}/regions/{regionId}
   */
  async unassignRegion(userId: string, regionId: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.delete(ApiRoutes.ADMIN_USER_REGION_DELETE(userId, regionId));
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to unassign region');
    } catch (error) {
      console.error('[AdminService] unassignRegion', error);
      throw error;
    }
  }

  /**
   * 전체 문의 목록 조회
   * GET /admin/inquiry/list
   */
  async getInquiryList(): Promise<Inquiry[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.ADMIN_INQUIRY_LIST);
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<Inquiry>;
        return data?.list || [];
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch inquiry list');
    } catch (error) {
      console.error('[AdminService] getInquiryList', error);
      throw error;
    }
  }

  /**
   * 문의 상세 조회
   * GET /admin/inquiry/{inquiryId}
   */
  async getInquiryDetail(inquiryId: string): Promise<Inquiry> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.ADMIN_INQUIRY_DETAIL(inquiryId));
      if (response && !response.hasErrors) {
        return response.responseData as Inquiry;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch inquiry detail');
    } catch (error) {
      console.error('[AdminService] getInquiryDetail', error);
      throw error;
    }
  }

  /**
   * 문의 답변 등록 및 상태 변경
   * PUT /admin/inquiry/{inquiryId}/answer
   */
  async answerInquiry(inquiryId: string, req: AdminInquiryAnswerReq): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.put(ApiRoutes.ADMIN_INQUIRY_ANSWER(inquiryId), req);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to answer inquiry');
    } catch (error) {
      console.error('[AdminService] answerInquiry', error);
      throw error;
    }
  }

  /**
   * 문의 삭제 (소프트 삭제)
   * DELETE /admin/inquiry/{inquiryId}
   */
  async deleteInquiry(inquiryId: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.delete(ApiRoutes.ADMIN_INQUIRY_DELETE(inquiryId));
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to delete inquiry');
    } catch (error) {
      console.error('[AdminService] deleteInquiry', error);
      throw error;
    }
  }

  /**
   * 답변 대기 문의 요약 조회 (대시보드 전용 경량 조회: 건수 및 최신 1건)
   * GET /admin/inquiry/pending-summary
   */
  async getPendingInquirySummary(): Promise<AdminInquiryPendingSummary> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.ADMIN_INQUIRY_PENDING_SUMMARY);
      if (response && !response.hasErrors) {
        return (response.responseData as AdminInquiryPendingSummary) || { pendingCount: 0 };
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch pending inquiry summary');
    } catch (error) {
      console.error('[AdminService] getPendingInquirySummary', error);
      throw error;
    }
  }
}

export default AdminService.getInstance();
