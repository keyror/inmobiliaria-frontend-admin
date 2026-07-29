import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";
import type { IStoreBranch } from "~/interfaces/IBranch";
import type { IParamsTable } from "~/interfaces/IParamsTable";

class BranchService {
  async getAll(params?: IParamsTable): Promise<any> {
    return useApi(ApiUrls.BRANCHES_GET, { query: params });
  }

  async getOne(id: string): Promise<any> {
    return useApi(`${ApiUrls.BRANCHES_SHOW_GET}/${id}`);
  }

  async create(payload: IStoreBranch): Promise<any> {
    return useApi(ApiUrls.BRANCHES_CREATE_POST, {
      method: "POST",
      body: payload,
    });
  }

  async update(id: string, payload: IStoreBranch): Promise<any> {
    return useApi(`${ApiUrls.BRANCHES_UPDATE_PUT}/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async deactivate(id: string): Promise<any> {
    return useApi(`${ApiUrls.BRANCHES_DELETE_DELETE}/${id}`, {
      method: "DELETE",
    });
  }

  async switch(companyId: string): Promise<any> {
    return useApi(ApiUrls.BRANCH_SWITCH_POST, {
      method: "POST",
      body: { company_id: companyId },
    });
  }
}

export default new BranchService();
