export class Constants {
    static readonly PDF: string = "pdf";
    static readonly EXCEL: string = "xlsx";

    //Categorias de deplegables de persona
    static readonly TAXE_TYPE: string = "taxe_type";
    static readonly ORGANIZATION_TYPE: string = "organization_type";
    static readonly DOCUMENT_TYPE: string = "document_type";
    static readonly STATUS: string = "status";
    static readonly GENDER: string = "gender";
    static readonly OP_SI_NO: string = "op_si_no";
    static readonly ECONOMIC_ACTIVITY: string = "economic_activity";
    static readonly CITY: string = "city";
    static readonly COUNTRY: string = "country";
    static readonly DEPARTMENT: string = "department";
    static readonly ACCOUNT_BANKS: string = "account_banks";
    static readonly BANKS: string = "banks";
    static readonly ROAD_TYPE: string = "road_type";
    static readonly LETTER: string = "letter";
    static readonly ORIENTATION: string = "orientation";
    static readonly STRATUM: string = "stratum";
    static readonly ACTIVO: string = "ACTIVO";
    static readonly INACTIVO: string = "INACTIVO";

    // Categorías de desplegables de propiedad
    static readonly GARAGE_TYPE: string = "garage_type";
    static readonly PROPERTY_TYPE: string = "property_type";
    static readonly PROPERTY_STATUS: string = "property_status";
    static readonly OFFER_TYPE: string = "offer_type";
    static readonly AREA_TYPE: string = "area_type";
    static readonly AREA_UNIT: string = "area_unit";
    static readonly PRICE_TYPE: string = "price_type";
    static readonly PUBLISH_CHANNEL: string = "publish_channel";
    static readonly FEATURE: string = "feature";
    static readonly OBLIGATION_TYPE: string = "obligation_type";
    static readonly FREQUENCY: string = "frequency";
}

export function getUrl(urlDB: string): string {
    const config = useRuntimeConfig();
    return `${config.public.apiBase}storage/${urlDB}`;
}
