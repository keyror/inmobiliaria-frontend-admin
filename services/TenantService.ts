import { useApi } from "~/composable/useApi";
import { ApiUrls } from "~/constants/ApiUrls";
import type { IParamsTable } from "~/interfaces/IParamsTable";

class TenantService {
    async getTenants(params: IParamsTable): Promise<any> {
        return useApi(ApiUrls.TENANTS_GET, { query: params });
    }

    async showTenant(id: number | string): Promise<any> {
        return useApi(`${ApiUrls.TENANTS_SHOW_GET}/${id}`);
    }

    async createTenant(payload: any): Promise<any> {
        return useApi(ApiUrls.TENANTS_CREATE_POST, { method: "POST", body: payload });
    }

    async updateTenant(id: number | string, payload: any): Promise<any> {
        return useApi(`${ApiUrls.TENANTS_UPDATE_PUT}/${id}`, { method: "PUT", body: payload });
    }

    async deleteTenant(id: number | string): Promise<any> {
        return useApi(`${ApiUrls.TENANTS_DELETE_DELETE}/${id}`, { method: "DELETE" });
    }

    async activateTenant(id: number | string): Promise<any> {
        return useApi(`${ApiUrls.TENANTS_ACTIVATE_PATCH}/${id}/activate`, { method: "PATCH" });
    }

    async deactivateTenant(id: number | string): Promise<any> {
        return useApi(`${ApiUrls.TENANTS_DEACTIVATE_PATCH}/${id}/deactivate`, { method: "PATCH" });
    }
}

export default new TenantService();
