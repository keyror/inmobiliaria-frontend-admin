import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

class AuditService {
  async getAuditLogs(params: Record<string, unknown>): Promise<any> {
    return useApi(ApiUrls.AUDIT_GET, { query: params });
  }

  async getBatch(batchUuid: string): Promise<any> {
    return useApi(`${ApiUrls.AUDIT_BATCH_GET}/${batchUuid}`);
  }
}

export default new AuditService();
