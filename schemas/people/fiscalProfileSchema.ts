import { z } from 'zod'

export const fiscalProfileSchema = z.object({
    economic_activities: z.array(z.any()).min(1, 'Seleccione al menos una actividad económica'),
    taxe_types: z.array(z.any()).min(1, 'Seleccione al menos una responsabilidad fiscal'),
    responsible_for_vat_type_id: z.string().min(1, 'Campo obligatorio'),
    vat_withholding: z.string().optional().nullable(),
    income_tax_withholding: z.string().optional().nullable(),
    ica_withholding: z.string().optional().nullable(),
    rental_fee: z.string().optional().nullable(),
})
