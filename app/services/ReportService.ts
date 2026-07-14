import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";
import type { IReportFilters } from "~/interfaces/IReportTemplate";

class ReportService {
  async getTemplates(): Promise<any> {
    return useApi(ApiUrls.REPORTS_GET);
  }

  async getTemplate(id: string): Promise<any> {
    return useApi(`${ApiUrls.REPORTS_GET}/${id}`);
  }

  async getVariables(): Promise<any> {
    return useApi(ApiUrls.REPORTS_VARIABLES_GET);
  }

  async createTemplate(payload: any): Promise<any> {
    return useApi(ApiUrls.REPORTS_POST, { method: "POST", body: payload });
  }

  async updateTemplate(id: string, payload: any): Promise<any> {
    return useApi(`${ApiUrls.REPORTS_PUT}/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async deleteTemplate(id: string): Promise<any> {
    return useApi(`${ApiUrls.REPORTS_DELETE}/${id}`, { method: "DELETE" });
  }

  async preview(
    templateId: string,
    filters: IReportFilters,
    page = 1,
    perPage = 50,
  ): Promise<any> {
    return useApi(`${ApiUrls.REPORTS_GET}/${templateId}/preview`, {
      query: { ...filters, page, per_page: perPage },
    });
  }

  async exportExcel(
    templateId: string,
    filters: IReportFilters,
  ): Promise<Blob> {
    return useApi<Blob>(
      `${ApiUrls.REPORTS_GET}/${templateId}/export`,
      { query: filters, responseType: "blob" },
    );
  }
}

export default new ReportService();
