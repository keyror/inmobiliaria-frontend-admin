import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

import type { IParamsTable } from "~/interfaces/IParamsTable";

class TenantUserService {
  private base(tenantId: string): string {
    return `${ApiUrls.TENANT_USERS_BASE}/${tenantId}`;
  }

  async getUsers(tenantId: string, params: IParamsTable): Promise<any> {
    return useApi(`${this.base(tenantId)}/users`, { query: params });
  }

  async getUser(tenantId: string, userId: string): Promise<any> {
    return useApi(`${this.base(tenantId)}/users/${userId}`);
  }

  async createUser(tenantId: string, payload: any): Promise<any> {
    return useApi(`${this.base(tenantId)}/users`, { method: "POST", body: payload });
  }

  async updateUser(tenantId: string, userId: string, payload: any): Promise<any> {
    return useApi(`${this.base(tenantId)}/users/${userId}`, { method: "PUT", body: payload });
  }

  async deleteUser(tenantId: string, userId: string): Promise<any> {
    return useApi(`${this.base(tenantId)}/users/${userId}`, { method: "DELETE" });
  }

  async getRoles(tenantId: string): Promise<any> {
    return useApi(`${this.base(tenantId)}/roles`);
  }

  async getStatuses(tenantId: string): Promise<any> {
    return useApi(`${this.base(tenantId)}/statuses`);
  }
}

export default new TenantUserService();
