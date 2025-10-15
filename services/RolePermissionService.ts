import {useApi} from "~/composable/useApi";
import {ApiUrls} from "~/constants/ApiUrls";
import type {IParamsTable} from "~/interfaces/IParamsTable";

class RolePermissionService {
    // Roles
    async getRoles(params: IParamsTable): Promise<any> {
        return useApi(ApiUrls.ROLES_GET, {query: params});
    }

    async createRole(payload: any): Promise<any> {
        return useApi(ApiUrls.ROLES_CREATE_POST, {method: "POST", body: payload});
    }

    async updateRole(id: number | null, payload: any): Promise<any> {
        return useApi(`${ApiUrls.ROLES_UPDATE_PUT}/${id}`, {method: "PUT", body: payload});
    }

    async deleteRole(id: number | string): Promise<any> {
        return useApi(`${ApiUrls.ROLES_DELETE_DELETE}/${id}`, {method: "DELETE"});
    }

    // Permisos
    async getPermissions(params: IParamsTable): Promise<any> {
        return useApi(ApiUrls.PERMISSIONS_GET, {query: params});
    }


    async createPermission(payload: any): Promise<any> {
        return useApi(ApiUrls.PERMISSIONS_CREATE_POST, {method: "POST", body: payload});
    }

    async updatePermission(id: number | null, payload: any): Promise<any> {
        return useApi(`${ApiUrls.PERMISSIONS_UPDATE_PUT}/${id}`, {method: "PUT", body: payload});
    }

    async deletePermission(id: number | string): Promise<any> {
        return useApi(`${ApiUrls.PERMISSIONS_DELETE_DELETE}/${id}`, {method: "DELETE"});
    }

    // Asignar permisos a roles
    async assignPermissionsToRole(roleId: number | string, permissions: any[]): Promise<any> {
        return useApi(`${ApiUrls.ROLES_PERMISSIONS_ASSIGN_POST}/${roleId}`, {
            method: "POST",
            body: {permissions}
        });
    }
}

export default new RolePermissionService();
