export interface IFiscalProfile {
    responsible_for_vat_type_id: string;
    vat_withholding?: string;
    income_tax_withholding?: string;
    ica_withholding?: string;
    taxe_types?: any[];
    rental_fee?: string;
    economic_activities?:any[];
}
