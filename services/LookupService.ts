import {useApi} from "~/composables/useApi";
import {ApiUrls} from "~/constants/ApiUrls";
import type {IIndexLookupsRequest} from "~/interfaces/IIndexLookupsRequest";


class LookupService {

    async getLookups(payload: IIndexLookupsRequest): Promise<any> {
        return useApi(ApiUrls.LOOKUPS_POST, {method: "POST", body: payload});
    }
}

export default new LookupService();
