import type { IAccountBank } from "~/interfaces/IAccountBank";
import type { IAddress } from "~/interfaces/IAddress";
import type { IContact } from "~/interfaces/IContact";
import type { IFiscalProfile } from "~/interfaces/IFiscalProfile";
import type { IPerson } from "~/interfaces/IPerson";

export interface ISavePerson {
  person?: Partial<IPerson>;
  fiscal_profile?: Partial<IFiscalProfile>;
  addresses?: IAddress[];
  contacts?: IContact[];
  account_banks?: IAccountBank[];
}
