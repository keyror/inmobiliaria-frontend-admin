export interface IRentTenant {
  tenant_id: string;
  codebtor_id?: string | null;
  percentage?: number | null;
}

export interface IRent {
  id?: string;
  property_id: string;
  status: string;
  contract_number?: string | null;
  contract_type_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  duration?: number | null;
  destination?: string | null;
  activity?: string | null;
  period?: string | null;
  canon?: number | null;
  iva?: number | null;
  administration_included?: boolean;
  is_ph?: boolean;
  interest_rate?: number | null;
  increment_type_id?: string | null;
  adjustment_date?: string | null;
  is_insured?: boolean;
  consignment_account?: string | null;
  payment_bank_id?: string | null;
  commissions?: any | null;
  signed_city?: string | null;
  signed_at?: string | null;
  additional_clauses?: string[] | null;
  internal_notes?: string | null;
  limit_dates_id?: string | null;

  // relations
  property?: any;
  contract_type?: any;
  increment_type?: any;
  payment_bank?: any;
  rent_tenant_codebtors?: any[];
  liabilities?: any[];
  documents?: any[];
}
