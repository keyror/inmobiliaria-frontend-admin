import {useApi} from "~/composables/useApi";
import {ApiUrls} from "~/constants/ApiUrls";
import type {IParamsTable} from "~/interfaces/IParamsTable";


class PropertyService {
    async getProperties(params: IParamsTable): Promise<any> {
        return useApi(ApiUrls.PROPERTIES_GET, {query: params});
    }
}

export default new PropertyService();
