export class Estatus {
    static readonly ACTIVE: string = "ACTIVE";
    static readonly INACTIVE: string = "INACTIVE";
    static readonly SUSPENDED: string = "SUSPENDED";
    static readonly EXPIRED: string = "EXPIRED";
    static readonly CANCELLED: string = "CANCELLED";
}

export function getEstatus(): string[] {
    return [
        Estatus.ACTIVE,
        Estatus.INACTIVE,
        Estatus.SUSPENDED,
        Estatus.EXPIRED,
        Estatus.CANCELLED
    ];
}

export class Plans {
    static readonly BASIC: string = "BASIC";
    static readonly PREMIUM: string = "PREMIUM";
    static readonly ENTERPRISE: string = "ENTERPRISE";
}

export function getPlans(): string[] {
    return [
        Plans.BASIC,
        Plans.PREMIUM,
        Plans.ENTERPRISE
    ];
}
