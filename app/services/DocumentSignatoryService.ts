import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";
import type { IDocumentSignatory } from "~/interfaces/IDocumentSignatory";

class DocumentSignatoryService {
  private base(rentId: string, documentId: string): string {
    return `${ApiUrls.DOCUMENT_SIGNATORIES_BASE}/${rentId}/documents/${documentId}/signatories`;
  }

  async getSignatories(rentId: string, documentId: string): Promise<any> {
    return useApi(this.base(rentId, documentId));
  }

  async storeSignatories(
    rentId: string,
    documentId: string,
    signatories: Pick<IDocumentSignatory, 'person_id' | 'name' | 'email' | 'role' | 'order'>[],
  ): Promise<any> {
    return useApi(this.base(rentId, documentId), {
      method: "POST",
      body: { signatories },
    });
  }

  async deleteSignatory(rentId: string, documentId: string, signatoryId: string): Promise<any> {
    return useApi(`${this.base(rentId, documentId)}/${signatoryId}`, {
      method: "DELETE",
    });
  }

  async sendForSigning(rentId: string, documentId: string): Promise<any> {
    return useApi(`${this.base(rentId, documentId)}/send`, {
      method: "POST",
    });
  }

  async resendSignatory(rentId: string, documentId: string, signatoryId: string): Promise<any> {
    return useApi(`${this.base(rentId, documentId)}/${signatoryId}/resend`, {
      method: "POST",
    });
  }

  // Public endpoints — no token needed but useApi won't add auth if store is empty
  async getSigningPage(token: string): Promise<any> {
    return useApi(`${ApiUrls.SIGN_BASE}/${token}`);
  }

  async getDocumentBlob(token: string): Promise<Blob> {
    return useApi<Blob>(`${ApiUrls.SIGN_BASE}/${token}/document`, {
      responseType: "blob",
    });
  }

  async submitSignature(token: string, formData: FormData): Promise<any> {
    return useApi(`${ApiUrls.SIGN_BASE}/${token}`, {
      method: "POST",
      body: formData,
      cleanPayload: false,
    });
  }
}

export default new DocumentSignatoryService();
