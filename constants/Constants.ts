export class Constants {
    static readonly PDF: string = "pdf";
    static readonly EXCEL: string = "xlsx";

    //Categorias de deplegables de persona
    static readonly TAXE_TYPE: string = "taxe_type";
    static readonly ORGANIZATION_TYPE: string = "organization_type";
    static readonly DOCUMENT_TYPE: string = "document_type";
    static readonly USER_STATUS: string = "user_status";
    static readonly GENDER: string = "gender";
    static readonly VAT_TYPE: string = "vat_type";
    static readonly ECONOMIC_ACTIVITY : string = "economic_activity";
    static readonly CITY : string = "city";
    static readonly ACTIVO: string = "ACTIVO";
    static readonly INACTIVO: string = "INACTIVO";
}

export function getUrl(urlDB: string): string {
    const config = useRuntimeConfig();
    return `${config.public.apiBase}storage/${urlDB}`;
}
