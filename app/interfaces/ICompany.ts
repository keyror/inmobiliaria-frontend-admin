import type { IAddress } from "~/interfaces/IAddress";
import type { IContact } from "~/interfaces/IContact";
import type { IImage } from "~/interfaces/IImageItem";

export interface ICompany {
  id?: string;
  company_name: string;
  tradename: string;
  nit: string;
  logo_image_id?: string | null;
  legal_representative_id?: string | null;
  person_attendant_id?: string | null;
  logo?: IImage | null;
  legal_representative?: any;
  person_attendant?: any;
  contacts?: IContact[];
  addresses?: IAddress[];
}
