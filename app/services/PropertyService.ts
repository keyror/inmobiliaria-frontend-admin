import { useApi } from "~/composables/useApi";
import { ApiUrls } from "~/constants/ApiUrls";

import type { IParamsTable } from "~/interfaces/IParamsTable";
import type { IProperty } from "~/interfaces/IProperty";

class PropertyService {
  async getProperties(params: IParamsTable): Promise<any> {
    return useApi(ApiUrls.PROPERTIES_GET, { query: params });
  }

  async getProperty(id: string | number): Promise<any> {
    return useApi(`${ApiUrls.PROPERTIES_SHOW_GET}/${id}`);
  }

  async createProperty(payload: any): Promise<any> {
    return useApi(ApiUrls.PROPERTIES_CREATE_POST, {
      method: "POST",
      body: payload,
    });
  }

  async updateProperty(
    id: string | number,
    payload: Partial<IProperty>,
  ): Promise<any> {
    return useApi(`${ApiUrls.PROPERTIES_UPDATE_PUT}/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async deleteProperty(id: string | number): Promise<any> {
    return useApi(`${ApiUrls.PROPERTIES_DELETE_DELETE}/${id}`, {
      method: "DELETE",
    });
  }
}

export default new PropertyService();
