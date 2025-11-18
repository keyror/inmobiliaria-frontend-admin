import {useApi} from "~/composables/useApi";
import {ApiUrls} from "~/constants/ApiUrls";
import type {IParamsTable} from "~/interfaces/IParamsTable";


class UserService {
    async getUsers(params: IParamsTable): Promise<any> {
        return useApi(ApiUrls.USERS_GET, {query: params});
    }

    async getUser(id: string | number): Promise<any> {
        return useApi(`${ApiUrls.USERS_SHOW_GET}/${id}`);
    }

    async createUser(payload: any): Promise<any> {
        return useApi(ApiUrls.USERS_CREATE_POST, {method: "POST", body: payload});
    }

    async updateUser(id: string | number, payload: any): Promise<any> {
        return useApi(`${ApiUrls.USERS_UPDATE_PUT}/${id}`, {method: "PUT", body: payload});
    }

    async deleteUser(id: string | number): Promise<any> {
        return useApi(`${ApiUrls.USERS_DELETE_DELETE}/${id}`, {method: "DELETE"});
    }
}

export default new UserService();
