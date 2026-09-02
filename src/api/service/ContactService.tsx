import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

class ContactService {
  private static instance: ContactService;

  private constructor() {}

  public static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  /**
   * 문의 제출
   * POST /contact/submit
   */
  async submitInquiry(params: InquiryReq): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.CONTACT_SUBMIT, params);
      if (response && !response.hasErrors) {
        return response.responseData as ActionRes;
      }
    } catch (error) {
      console.error('[ContactService] submitInquiry', error);
      throw error;
    }
  }
}

export default ContactService.getInstance();