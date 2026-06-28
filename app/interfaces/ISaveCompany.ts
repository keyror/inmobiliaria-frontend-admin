import type { IAddress } from "~/interfaces/IAddress";
import type { ICompany } from "~/interfaces/ICompany";
import type { IContact } from "~/interfaces/IContact";
import type { IPublishChannel } from "~/interfaces/IPublishChannel";

export interface ISaveCompany {
  company?: Partial<ICompany>;
  contacts?: IContact[];
  addresses?: IAddress[];
  publish_channels?: IPublishChannel[];
}
