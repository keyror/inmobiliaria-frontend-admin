export interface IPropertyPrice {
    id?: string | null;
    property_id?: string | null;
    price_type_id: string | null;
    price_min?: number | string | null;
    price_max?: number | string | null;
    price?: number | string | null;
    currency: string | null;
}
