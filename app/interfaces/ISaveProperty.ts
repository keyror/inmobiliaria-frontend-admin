import type { IAddress } from "~/interfaces/IAddress";
import type { IArea } from "~/interfaces/IArea";
import type { IContact } from "~/interfaces/IContact";
import type { IOwnership } from "~/interfaces/IOwnership";
import type { IProperty } from "~/interfaces/IProperty";
import type { IPropertyObligation } from "~/interfaces/IPropertyObligation";
import type { IPublishChannel } from "~/interfaces/IPublishChannel";

export interface ISaveProperty {
  property?: IProperty;
  addresses?: IAddress[];
  contacts?: IContact[];
  areas?: IArea[];
  publish_channels?: IPublishChannel[];
  obligations?: IPropertyObligation[];
  ownerships?: IOwnership[];
}
