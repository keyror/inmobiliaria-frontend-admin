export interface IReportColumn {
  key: string;
  label: string;
}

export interface IReportTemplate {
  id: string;
  name: string;
  columns: IReportColumn[];
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IReportVariable {
  key: string;
  label: string;
}

export interface IReportVariableGroup {
  key: string;
  label: string;
  variables: IReportVariable[];
}

export interface IReportPreviewData {
  rows: Record<string, string | number | null>[];
  columns: IReportColumn[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface IReportFilters {
  status?: string;
  contract_type_id?: string;
  start_from?: string;
  start_to?: string;
}
