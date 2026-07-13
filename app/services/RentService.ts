import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

import type { IParamsTable } from "~/interfaces/IParamsTable";

class RentService {
  async getRents(params: IParamsTable): Promise<any> {
    return useApi(ApiUrls.RENTS_GET, { query: params });
  }

  async getRent(id: string): Promise<any> {
    return useApi(`${ApiUrls.RENTS_SHOW_GET}/${id}`);
  }

  async createRent(payload: any): Promise<any> {
    return useApi(ApiUrls.RENTS_CREATE_POST, { method: "POST", body: payload });
  }

  async updateRent(id: string, payload: any): Promise<any> {
    return useApi(`${ApiUrls.RENTS_UPDATE_PUT}/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async deleteRent(id: string): Promise<any> {
    return useApi(`${ApiUrls.RENTS_DELETE_DELETE}/${id}`, {
      method: "DELETE",
    });
  }

  async getDocuments(rentId: string): Promise<any> {
    return useApi(`${ApiUrls.RENTS_DOCUMENTS_GET}/${rentId}/documents`);
  }

  async createDocument(rentId: string, payload: any): Promise<any> {
    return useApi(
      `${ApiUrls.RENTS_DOCUMENTS_CREATE_POST}/${rentId}/documents`,
      { method: "POST", body: payload },
    );
  }

  async updateDocument(
    rentId: string,
    documentId: string,
    payload: any,
  ): Promise<any> {
    return useApi(
      `${ApiUrls.RENTS_DOCUMENTS_UPDATE_PUT}/${rentId}/documents/${documentId}`,
      { method: "PUT", body: payload },
    );
  }

  async deleteDocument(rentId: string, documentId: string): Promise<any> {
    return useApi(
      `${ApiUrls.RENTS_DOCUMENTS_DELETE_DELETE}/${rentId}/documents/${documentId}`,
      { method: "DELETE" },
    );
  }

  async generateDocument(rentId: string, documentId: string): Promise<any> {
    return useApi(
      `${ApiUrls.RENTS_DOCUMENTS_GENERATE_POST}/${rentId}/documents/${documentId}/generate`,
      { method: "POST" },
    );
  }

  async downloadDocument(rentId: string, documentId: string): Promise<Blob> {
    return useApi<Blob>(
      `${ApiUrls.RENTS_DOCUMENTS_DOWNLOAD_GET}/${rentId}/documents/${documentId}/download`,
      { responseType: "blob" },
    );
  }
}

export default new RentService();
