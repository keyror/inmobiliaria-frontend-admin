import type {IAddress} from "~/interfaces/IAddress";
import type {IContact} from "~/interfaces/IContact";
import type {IArea} from "~/interfaces/IArea";
import type {IProperty} from "~/interfaces/IProperty";
import type {IPublishChannel} from "~/interfaces/IPublishChannel";
import type {IPropertyObligation} from "~/interfaces/IPropertyObligation";
import type {IOwnership} from "~/interfaces/IOwnership";

export interface ISaveProperty {
    property?: IProperty,
    addresses?: IAddress[],
    contacts?: IContact[],
    areas?: IArea[],
    publish_channels?: IPublishChannel[],
    obligations?: IPropertyObligation[],
    ownerships?:IOwnership[],
}
