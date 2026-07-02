import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

class AuditService {
  async getAuditLogs(params: Record<string, unknown>): Promise<any> {
    return useApi(ApiUrls.AUDIT_GET, { query: params });
  }
}

export default new AuditService();
