import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";
import type { IContractClause, IContractClauseMeta } from "~/interfaces/IContractClause";

class ContractClauseService {
  async getMeta(): Promise<{ data: IContractClauseMeta }> {
    return useApi(ApiUrls.CONTRACT_CLAUSES_META_GET);
  }

  async getByTemplate(templateKey: string): Promise<{ data: IContractClause[] }> {
    return useApi(`${ApiUrls.CONTRACT_CLAUSES_GET}?template_key=${templateKey}`);
  }

  async create(payload: Partial<IContractClause>): Promise<{ data: IContractClause }> {
    return useApi(ApiUrls.CONTRACT_CLAUSES_POST, { method: "POST", body: payload });
  }

  async update(id: number, payload: Partial<IContractClause>): Promise<{ data: IContractClause }> {
    return useApi(`${ApiUrls.CONTRACT_CLAUSES_PUT}/${id}`, { method: "PUT", body: payload });
  }

  async remove(id: number): Promise<void> {
    return useApi(`${ApiUrls.CONTRACT_CLAUSES_DELETE}/${id}`, { method: "DELETE" });
  }

  async reorder(templateKey: string, ids: number[]): Promise<void> {
    return useApi(ApiUrls.CONTRACT_CLAUSES_REORDER_POST, {
      method: "POST",
      body: { template_key: templateKey, ids },
    });
  }

  async resetToDefaults(templateKey: string): Promise<{ data: IContractClause[] }> {
    return useApi(`${ApiUrls.CONTRACT_CLAUSES_RESET_POST}/${templateKey}`, { method: "POST" });
  }

  async preview(templateKey: string): Promise<{ data: { html: string; template_label: string } }> {
    return useApi(`${ApiUrls.CONTRACT_CLAUSES_PREVIEW_GET}/${templateKey}`);
  }
}

export default new ContractClauseService();
