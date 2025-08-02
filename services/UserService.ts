import {useApi} from "~/composable/useApi";
import type {IParamsTable} from "~/interfaces/IParamsTable";


class UserService {
    async getUsers(params: IParamsTable): Promise<any> {
        return useApi('/users', { query: params })
    }
}

export default new UserService();
