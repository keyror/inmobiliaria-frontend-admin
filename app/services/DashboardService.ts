import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

class DashboardService {
  async getStats(): Promise<any> {
    return useApi(ApiUrls.DASHBOARD_GET);
  }
}

export default new DashboardService();
