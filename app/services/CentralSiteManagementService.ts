import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

export interface CentralSiteTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface CentralSiteThemeResponse {
  status: boolean;
  data: { theme: CentralSiteTheme };
}

export interface CentralSiteThemeUpdateResponse {
  status: boolean;
  message: string[];
  data: { theme: CentralSiteTheme };
}

class CentralSiteManagementService {
  async getTheme(): Promise<CentralSiteThemeResponse> {
    return useApi<CentralSiteThemeResponse>(ApiUrls.CENTRAL_SITE_THEME_GET, {
      method: "GET",
    });
  }

  async updateTheme(
    theme: CentralSiteTheme,
  ): Promise<CentralSiteThemeUpdateResponse> {
    return useApi<CentralSiteThemeUpdateResponse>(
      ApiUrls.CENTRAL_SITE_THEME_PUT,
      { method: "PUT", body: { theme } },
    );
  }
}

export default new CentralSiteManagementService();
