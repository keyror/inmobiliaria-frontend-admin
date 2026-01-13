import type {IPerson} from "~/interfaces/IPerson";
import type {IFiscalProfile} from "~/interfaces/IFiscalProfile";
import type {IAddress} from "~/interfaces/IAddress";
import type {IContact} from "~/interfaces/IContact";
import type {IAccountBank} from "~/interfaces/IAccountBank";

export interface ISavePerson {
    person?: Partial<IPerson>,
    perfilFiscal?: Partial<IFiscalProfile>,
    addresses?: IAddress[],
    contacts?: IContact[],
    accountBanks?: IAccountBank[]
}
