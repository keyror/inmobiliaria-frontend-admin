export interface ILookup {
  id: string;
  category: string;
  name: string;
  alias: string | null;
  value: string | number | null;
  code: string | null;
  icon: string | null;
  is_active: boolean;
  lang: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type ILookupsResponse = Record<string, ILookup[]>;
