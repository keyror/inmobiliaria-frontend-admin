export interface IAccountBank {
    id?: string;
    bank_id: string;
    account_type_id: string;
    account_number: string;
    is_principal?: boolean;
    bank?: {
        id: string;
        name: string;
    };
    account_type?: {
        id: string;
        name: string;
    };
}
