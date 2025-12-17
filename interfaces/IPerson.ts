import type {IFiscalProfile} from "~/interfaces/IFiscalProfile";

export interface IPerson {
    first_name: string;
    last_name: string;
    company_name?: string;
    document_type_id: string;
    document_number: string;
    document_from_id: string;
    organization_type_id: string;
    birth_date: string;
    gender_type_id: string;
    dv?: string;
    fiscal_profile_id?: string;
    fiscal_profile?: IFiscalProfile | null;
    addresses?: any[];
    contacts?: any[];
    organization_type?: any[];

}
