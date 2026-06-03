import type { IAddress } from "~/interfaces/IAddress";
import type { IContact } from "~/interfaces/IContact";
import type { IImage } from "~/interfaces/IImageItem";

export interface ICompanyTheme {
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface ICompanyPersonRelation {
  id?: string | null;
  [key: string]: unknown;
}

export interface ICompany {
  id?: string;
  company_name: string;
  tradename: string;
  nit: string;
  theme?: ICompanyTheme | null;
  logo_image_id?: string | null;
  legal_representative_id?: string | null;
  person_attendant_id?: string | null;
  logo?: IImage | null;
  legal_representative?: ICompanyPersonRelation | null;
  person_attendant?: ICompanyPersonRelation | null;
  contacts?: IContact[];
  addresses?: IAddress[];
}
