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
    via_type_id: string;
    via_number: string;
    letra1_id: string;
    orientation1_id: string;
    number2: string;
    letra2_id: string;
    orientation2_id: string;
    number3: string;
}
