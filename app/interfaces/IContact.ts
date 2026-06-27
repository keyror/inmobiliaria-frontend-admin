export interface IContact {
  id?: string;
  name?: string | null;
  phone?: string;
  mobile: string;
  email: string;
  is_principal: boolean;
  person_id?: string;
  company_id?: string;
}
