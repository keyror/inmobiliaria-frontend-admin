export interface IAddress {
    id?: string | null;
    address: string;
    city_id: string;
    department_id: string;
    country_id: string;
    zip_code?: string | null;
    sector?: string | null;
    stratum_id?: string | null;
    complement?: string | null;
    person_id?: string | null;
    company_id?: string | null;
    is_principal: boolean;
    via_type_id: string;
    via_number: string;
    letra1_id?: string | null;
    orientation1_id?: string | null;
    letra2_id?: string | null;
    orientation2_id?: string | null;
    number3: string;

}
