import {useApi} from "~/composable/useApi";
import {ApiUrls} from "~/constants/ApiUrls";
import type {IParamsTable} from "~/interfaces/IParamsTable";


class UserService {
    async getUsers(params: IParamsTable): Promise<any> {
        return useApi(ApiUrls.USERS_GET, { query: params })
    }
}

export default new UserService();
