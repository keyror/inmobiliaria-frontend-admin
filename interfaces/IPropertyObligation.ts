export interface IPropertyObligation {
    obligation_type_id: string;
    amount: string | number;
    total: string | number;
    frequency_type_id: string;
    expiration_date?: string | null;
    status_id: string;
    description?: string;
}

