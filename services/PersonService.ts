import {useApi} from "~/composables/useApi";
import {ApiUrls} from "~/constants/ApiUrls";
import type {IParamsTable} from "~/interfaces/IParamsTable";

class PersonService {
    // Personas
    async getPeople(params: IParamsTable): Promise<any> {
        return useApi(ApiUrls.PEOPLE_GET, {query: params});
    }

    async getPerson(id: string | number): Promise<any> {
        return useApi(`${ApiUrls.PEOPLE_SHOW_GET}/${id}`);
    }

    async createPerson(payload: any): Promise<any> {
        return useApi(ApiUrls.PEOPLE_CREATE_POST, {method: "POST", body: payload});
    }

    async updatePerson(id: string | number, payload: any): Promise<any> {
        return useApi(`${ApiUrls.PEOPLE_UPDATE_PUT}/${id}`, {method: "PUT", body: payload});
    }

    async deletePerson(id: string | number): Promise<any> {
        return useApi(`${ApiUrls.PEOPLE_DELETE_DELETE}/${id}`, {method: "DELETE"});
    }

    // Perfiles Fiscales
    async createFiscalProfile(payload: any): Promise<any> {
        return useApi(ApiUrls.FISCAL_PROFILES_CREATE_POST, {method: "POST", body: payload});
    }

    async updateFiscalProfile(id: string | number, payload: any): Promise<any> {
        return useApi(`${ApiUrls.FISCAL_PROFILES_UPDATE_PUT}/${id}`, {method: "PUT", body: payload});
    }

    async deleteFiscalProfile(id: string | number): Promise<any> {
        return useApi(`${ApiUrls.FISCAL_PROFILES_DELETE_DELETE}/${id}`, {method: "DELETE"});
    }
}

export default new PersonService();
