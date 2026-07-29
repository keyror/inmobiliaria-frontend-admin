import type { IAccountBank } from "~/interfaces/IAccountBank";
import type { IAddress } from "~/interfaces/IAddress";
import type { ICompany } from "~/interfaces/ICompany";
import type { ICompanySetting } from "~/interfaces/ICompanySetting";
import type { IContact } from "~/interfaces/IContact";
import type { IPublishChannel } from "~/interfaces/IPublishChannel";

export interface ISaveCompany {
  company?: Partial<ICompany>;
  contacts?: IContact[];
  addresses?: IAddress[];
  account_banks?: IAccountBank[];
  publish_channels?: IPublishChannel[];
  company_setting?: Partial<ICompanySetting> | null;
}
