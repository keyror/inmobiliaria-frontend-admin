import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

import type { PublicCompanyResponse } from "~/interfaces/IPublicCompany";

class PublicCompanyService {
  async getCompany(): Promise<PublicCompanyResponse> {
    return useApi<PublicCompanyResponse>(ApiUrls.PUBLIC_COMPANY_GET, {
      method: "GET",
      silent: true,
    });
  }
}

export default new PublicCompanyService();
