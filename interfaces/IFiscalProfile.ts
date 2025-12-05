export interface IFiscalProfile {
    tax_regime?: string;
    responsible_for_vat_type_id: string;
    vat_withholding?: string;
    income_tax_withholding?: string;
    ica_withholding?: string;
    taxe_type_id: string;
    taxe_types?: any[];
    rental_fee?: string;
    economic_activities?:any[];
}
