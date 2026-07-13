import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";
import type { ITemplateSection, ITemplateSectionMeta } from "~/interfaces/ITemplateSection";

class TemplateSectionService {
  async getMeta(): Promise<{ data: ITemplateSectionMeta }> {
    return useApi(ApiUrls.TEMPLATE_SECTIONS_META_GET);
  }

  async getByTemplate(templateKey: string): Promise<{ data: ITemplateSection[] }> {
    return useApi(`${ApiUrls.TEMPLATE_SECTIONS_GET}?template_key=${templateKey}`);
  }

  async create(payload: Partial<ITemplateSection>): Promise<{ data: ITemplateSection }> {
    return useApi(ApiUrls.TEMPLATE_SECTIONS_POST, { method: "POST", body: payload });
  }

  async update(id: number, payload: Partial<ITemplateSection>): Promise<{ data: ITemplateSection }> {
    return useApi(`${ApiUrls.TEMPLATE_SECTIONS_PUT}/${id}`, { method: "PUT", body: payload });
  }

  async remove(id: number): Promise<void> {
    return useApi(`${ApiUrls.TEMPLATE_SECTIONS_DELETE}/${id}`, { method: "DELETE" });
  }

  async reorder(templateKey: string, ids: number[]): Promise<void> {
    return useApi(ApiUrls.TEMPLATE_SECTIONS_REORDER_POST, {
      method: "POST",
      body: { template_key: templateKey, ids },
    });
  }

  async resetToDefaults(templateKey: string): Promise<{ data: ITemplateSection[] }> {
    return useApi(`${ApiUrls.TEMPLATE_SECTIONS_RESET_POST}/${templateKey}`, { method: "POST" });
  }

  /** Fetches the PDF preview and returns a blob URL (application/pdf, inline) */
  async preview(templateKey: string): Promise<string> {
    const blob = await useApi<Blob>(
      `${ApiUrls.TEMPLATE_SECTIONS_PREVIEW_GET}/${templateKey}`,
      { responseType: "blob" },
    );
    return URL.createObjectURL(blob);
  }
}

export default new TemplateSectionService();
