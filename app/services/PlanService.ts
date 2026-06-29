import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";
import type { IParamsTable } from "~/interfaces/IParamsTable";

class PlanService {
  async getPlans(params: IParamsTable): Promise<any> {
    return useApi(ApiUrls.PLANS_GET, { query: params });
  }

  async getPlan(id: string): Promise<any> {
    return useApi(`${ApiUrls.PLANS_SHOW_GET}/${id}`);
  }

  async getPlansForSelect(): Promise<any> {
    return useApi(ApiUrls.PLANS_SELECT_GET);
  }

  async createPlan(payload: any): Promise<any> {
    return useApi(ApiUrls.PLANS_CREATE_POST, { method: "POST", body: payload });
  }

  async updatePlan(id: string, payload: any): Promise<any> {
    return useApi(`${ApiUrls.PLANS_UPDATE_PUT}/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async deletePlan(id: string): Promise<any> {
    return useApi(`${ApiUrls.PLANS_DELETE_DELETE}/${id}`, {
      method: "DELETE",
    });
  }
}

export default new PlanService();
