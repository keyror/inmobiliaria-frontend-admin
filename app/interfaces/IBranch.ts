import type { IAddress } from "~/interfaces/IAddress";
import type { IContact } from "~/interfaces/IContact";
import type { IImage } from "~/interfaces/IImageItem";

export interface IBranch {
  id: string;
  parent_company_id: string | null;
  branch_code: string | null;
  is_active: boolean;
  is_headquarters: boolean;
  uses_branches: boolean;
  company_name: string;
  tradename: string | null;
  nit: string | null;
  logo: IImage | null;
  contacts: IContact[];
  addresses: IAddress[];
  created_at: string;
}

export interface IStoreBranch {
  branch: {
    company_name: string;
    tradename?: string | null;
    nit?: string | null;
    branch_code?: string | null;
    is_active?: boolean;
  };
  contacts?: IContact[];
  addresses?: IAddress[];
}
