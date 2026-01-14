export interface IAddress {
    id?: string;
    address: string;
    city_id: string;
    department_id: string;
    country_id: string;
    zip_code?: string;
    sector?: string;
    stratum_id?: string;
    complement?: string;
    person_id?: string;
    company_id?: string;
    is_principal: boolean;
    via_type: string;
    via_number: string;
    letra1: string;
    orientation1: string;
    number2: string;
    letra2: string;
    orientation2: string;
    number3: string;
}
