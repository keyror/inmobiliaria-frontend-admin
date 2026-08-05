import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

import type { ISaveCompany } from "~/interfaces/ISaveCompany";

class CompanyService {
  async getCurrentCompany(): Promise<any> {
    return useApi(ApiUrls.COMPANIES_CURRENT_GET);
  }

  async createCompany(payload: ISaveCompany): Promise<any> {
    return useApi(ApiUrls.COMPANIES_CREATE_POST, {
      method: "POST",
      body: payload,
    });
  }

  async updateCompany(payload: ISaveCompany): Promise<any> {
    return useApi(ApiUrls.COMPANIES_UPDATE_PUT, {
      method: "PUT",
      body: payload,
    });
  }
}

export default new CompanyService();
