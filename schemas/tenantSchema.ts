// schemas/tenantSchema.ts
import { z } from 'zod';
import {emailSchema} from "~/schemas/commonSchema";

export const tenantSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    email: emailSchema,
    domain: z.string().min(1, 'El dominio es obligatorio'),
    plan_id: z.string().min(1, 'El plan es obligatorio'),
    status_id: z.string().min(1, 'El estado es obligatorio'),
    subscription_ends_at: z
        .string()
        .min(1, 'La fecha es obligatoria')
        .nullable()
        .refine((val) => val !== null, 'La fecha es obligatoria'),
});
