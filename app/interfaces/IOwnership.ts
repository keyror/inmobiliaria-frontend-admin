import type { IOwner } from "~/interfaces/IOwner";

export interface IOwnership {
  id?: string | null;
  property_id: string | null;
  person_id: string;
  ownership_percentage: number;
  is_principal_owner: boolean;
  ownership_start_date: string | null;
  ownership_end_date: string | null;
  status_id: string;
  person: IOwner;
}
