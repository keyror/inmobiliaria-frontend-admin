import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

import type {
  LookupCategoriesResponse,
  LookupIndexParams,
  LookupIndexResponse,
  LookupMutationResponse,
  LookupPayload,
  LookupShowResponse,
} from "~/interfaces/ILookupAdmin";

class LookupAdminService {
  async index(params: LookupIndexParams): Promise<LookupIndexResponse> {
    return useApi(ApiUrls.LOOKUPS_ADMIN_GET, {
      method: "GET",
      query: params,
    });
  }

  async getCategories(): Promise<LookupCategoriesResponse> {
    return useApi(ApiUrls.LOOKUPS_ADMIN_CATEGORIES_GET, {
      method: "GET",
    });
  }

  async show(id: string): Promise<LookupShowResponse> {
    return useApi(`${ApiUrls.LOOKUPS_ADMIN_SHOW_GET}/${id}`, {
      method: "GET",
    });
  }

  async store(payload: LookupPayload): Promise<LookupMutationResponse> {
    return useApi(ApiUrls.LOOKUPS_ADMIN_CREATE_POST, {
      method: "POST",
      body: payload,
    });
  }

  async update(
    id: string,
    payload: Partial<LookupPayload>,
  ): Promise<LookupMutationResponse> {
    return useApi(`${ApiUrls.LOOKUPS_ADMIN_UPDATE_PUT}/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async destroy(id: string): Promise<LookupMutationResponse> {
    return useApi(`${ApiUrls.LOOKUPS_ADMIN_DELETE_DELETE}/${id}`, {
      method: "DELETE",
    });
  }
}

export default new LookupAdminService();
