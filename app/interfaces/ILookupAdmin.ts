import type { ILookup } from "~/interfaces/ILookup";
import type { IParamsTable } from "~/interfaces/IParamsTable";

export interface LookupIndexParams extends IParamsTable {
  category?: string;
  is_active?: boolean | 0 | 1;
  lang?: string;
}

export interface LookupPayload {
  category: string;
  name: string;
  alias?: string | null;
  value?: string | number | null;
  code?: string | null;
  is_active?: boolean;
  lang?: string;
  icon?: string | null;
}

export interface LookupIndexResponse {
  status: boolean;
  data: ILookup[] | LookupPaginatedData;
  links?: Record<string, unknown>;
  meta?: {
    total?: number;
    [key: string]: unknown;
  };
}

export interface LookupPaginatedData {
  data?: ILookup[];
  total?: number;
}

export interface LookupShowResponse {
  status: boolean;
  data: ILookup;
}

export interface LookupMutationResponse {
  status: boolean;
  message?: string | string[];
  data?: ILookup;
}

export interface LookupCategoriesResponse {
  status: boolean;
  data: string[];
}
