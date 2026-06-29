import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

class SearchService {
  async globalSearch(q: string): Promise<any> {
    return useApi(ApiUrls.SEARCH_GLOBAL_GET, { query: { q } });
  }
}

export default new SearchService();
