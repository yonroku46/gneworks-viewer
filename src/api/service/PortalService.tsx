import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

class PortalService {
  private static instance: PortalService;
  private fireRegionsPromise: Promise<FireRegion[]> | null = null;

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
   * 본인 비밀번호 변경
   * PUT /portal/profile/password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response: ApiResponse = await ApiInstance.put(ApiRoutes.PORTAL_PROFILE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      if (response && !response.hasErrors) {
        return;
      }
      throw new Error(response?.informations?.[0]?.message || '비밀번호 변경에 실패했습니다.');
    } catch (error) {
      console.error('[PortalService] changePassword', error);
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
  async assignRegion(sido: string, sigungu: string, regionId?: string): Promise<ActionRes> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.PORTAL_REGIONS, {
        regionId,
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
   * 전체 소방관할 목록 조회 (인메모리 캐시 적용)
   * GET /portal/fire-regions
   */
  async getFireRegions(forceRefresh: boolean = false): Promise<FireRegion[]> {
    if (this.fireRegionsPromise && !forceRefresh) {
      return this.fireRegionsPromise;
    }
    this.fireRegionsPromise = (async () => {
      try {
        const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_FIRE_REGIONS);
        if (response && !response.hasErrors) {
          const data = response.responseData as ListRes<FireRegion>;
          return data?.list || [];
        }
        throw new Error(response?.informations?.[0]?.message || 'Failed to fetch fire regions');
      } catch (error) {
        this.fireRegionsPromise = null;
        console.error('[PortalService] getFireRegions', error);
        throw error;
      }
    })();
    return this.fireRegionsPromise;
  }

  /**
   * 현장 목록 조회
   * GET /portal/sites
   */
  async getSites(params?: {
    regionId?: string;
    query?: string;
    limit?: number;
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
   * 권역별 세대수 및 현장수 요약 집계
   * GET /portal/regions/{regionId}/summary
   */
  async getRegionSummary(regionId: string): Promise<{ totalSites: number; totalTarget: number; completedTarget: number; progressRate: number }> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_REGION_SUMMARY(regionId));
      if (response && !response.hasErrors) {
        return (response.responseData as any) || { totalSites: 0, totalTarget: 0, completedTarget: 0, progressRate: 0 };
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch region summary');
    } catch (error) {
      console.error('[PortalService] getRegionSummary', error);
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

  // ── [3. 시공 보고서 관리] ──────────────────────────────────────────

  /**
   * 시공 보고서 등록 및 수정 (UPSERT)
   * POST /portal/report
   */
  async submitReport(data: WorkReportReq): Promise<WorkReport> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.PORTAL_REPORT_SUBMIT, data);
      if (response && !response.hasErrors) {
        return response.responseData as WorkReport;
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to submit report');
    } catch (error) {
      console.error('[PortalService] submitReport', error);
      throw error;
    }
  }

  /**
   * 세대별 시공 보고서 조회
   * GET /portal/report/{householdId}
   */
  async getReportByHouseholdId(householdId: string): Promise<WorkReport | null> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_REPORT_BY_HOUSEHOLD(householdId));
      if (response && !response.hasErrors) {
        return response.responseData as WorkReport;
      }
      return null;
    } catch (error) {
      console.error('[PortalService] getReportByHouseholdId', error);
      return null;
    }
  }

  /**
   * 시공 보고서 목록 조회 (담당 현장 또는 본인 작성, 페이징 지원)
   * GET /portal/reports
   */
  async getReports(params?: {
    siteId?: string;
    regionId?: string;
    sido?: string;
    sigungu?: string;
    page?: number;
    size?: number;
    query?: string;
    status?: string;
    installStartDate?: string;
    installEndDate?: string;
  }): Promise<PageRes<WorkReport>> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_REPORTS, { params });
      if (response && !response.hasErrors) {
        const data = response.responseData as any;
        return {
          list: data?.list || [],
          totalCount: data?.totalCount ?? data?.list?.length ?? 0,
          page: data?.page || 1,
          size: data?.size || data?.list?.length || 20,
          totalPages: data?.totalPages || Math.ceil((data?.totalCount || 0) / (data?.size || 20)) || 1,
          hasNext: data?.hasNext ?? (data?.page < data?.totalPages),
          hasPrev: data?.hasPrev ?? (data?.page > 1),
        };
      }
      throw new Error(response?.informations?.[0]?.message || 'Failed to fetch reports');
    } catch (error) {
      console.error('[PortalService] getReports', error);
      throw error;
    }
  }

  /**
   * 본인의 문의 및 답변 내역 목록 조회
   * GET /portal/inquiries
   */
  async getMyInquiries(): Promise<Inquiry[]> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_INQUIRIES);
      if (response && !response.hasErrors) {
        const data = response.responseData as ListRes<Inquiry>;
        return data?.list || [];
      }
      return [];
    } catch (error) {
      console.error('[PortalService] getMyInquiries', error);
      return [];
    }
  }

  /**
   * 현장 안내사항(공지) 조회
   * GET /portal/notice
   */
  async getNotice(): Promise<PortalNotice | null> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PORTAL_NOTICE);
      if (response && !response.hasErrors) {
        return response.responseData as PortalNotice;
      }
      return null;
    } catch (error) {
      console.error('[PortalService] getNotice', error);
      return null;
    }
  }
}

export default PortalService.getInstance();