import type { ILookup } from "~/interfaces/ILookup";

export class Estatus {
  static readonly ACTIVE: string = "ACTIVE";
  static readonly INACTIVE: string = "INACTIVE";
  static readonly SUSPENDED: string = "SUSPENDED";
  static readonly EXPIRED: string = "EXPIRED";
  static readonly CANCELLED: string = "CANCELLED";
}

export function getEstatus(): ILookup[] {
  return Object.values(Estatus).map((value, index) => ({
    id: `${index + 1}`, // id único
    category: "status",
    name: value,
    alias: null,
    value: value,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }));
}

export class Plans {
  static readonly BASIC: string = "BASIC";
  static readonly PREMIUM: string = "PREMIUM";
  static readonly ENTERPRISE: string = "ENTERPRISE";
}

export function getPlans(): ILookup[] {
  return Object.values(Plans).map((value, index) => ({
    id: `${index + 1}`, // id único
    category: "plan",
    name: value,
    alias: null,
    value: value,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }));
}
