import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

import type { RealstateSitePageKey } from "~/constants/RealstateTemplates";
import type {
  RealstateSitePagePayload,
  RealstateSitePageResponse,
  RealstateSitePagesResponse,
  RealstateSiteTemplatePayload,
  RealstateSiteTemplateResponse,
} from "~/interfaces/IRealstateSiteManagement";

class RealstateSiteManagementService {
  async getTemplate(): Promise<RealstateSiteTemplateResponse> {
    return useApi<RealstateSiteTemplateResponse>(
      ApiUrls.REALSTATE_SITE_TEMPLATE_GET,
      { method: "GET" },
    );
  }

  async updateTemplate(
    payload: RealstateSiteTemplatePayload,
  ): Promise<RealstateSiteTemplateResponse> {
    return useApi<RealstateSiteTemplateResponse>(
      ApiUrls.REALSTATE_SITE_TEMPLATE_PUT,
      {
        method: "PUT",
        body: payload,
      },
    );
  }

  async getPages(): Promise<RealstateSitePagesResponse> {
    return useApi<RealstateSitePagesResponse>(
      ApiUrls.REALSTATE_SITE_PAGES_GET,
      {
        method: "GET",
      },
    );
  }

  async updatePage(
    page: RealstateSitePageKey,
    payload: RealstateSitePagePayload,
  ): Promise<RealstateSitePageResponse> {
    return useApi<RealstateSitePageResponse>(
      `${ApiUrls.REALSTATE_SITE_PAGES_PUT}/${page}`,
      {
        method: "PUT",
        body: payload,
        cleanPayload: false,
      },
    );
  }

  async restoreTemplate(): Promise<RealstateSiteTemplateResponse> {
    return useApi<RealstateSiteTemplateResponse>(
      ApiUrls.REALSTATE_SITE_TEMPLATE_RESTORE_POST,
      { method: "POST" },
    );
  }

  async restorePage(page: RealstateSitePageKey): Promise<RealstateSitePageResponse> {
    return useApi<RealstateSitePageResponse>(
      `${ApiUrls.REALSTATE_SITE_PAGE_RESTORE_POST}/${page}/restore`,
      { method: "POST" },
    );
  }

  async restoreAll(): Promise<{ status: boolean; message: string[] }> {
    return useApi<{ status: boolean; message: string[] }>(
      ApiUrls.REALSTATE_SITE_RESTORE_ALL_POST,
      { method: "POST" },
    );
  }
}

export default new RealstateSiteManagementService();
