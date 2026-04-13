import { z } from 'zod'

export const ownershipFormSchema = z.object({
    ownerships: z.array(
        z.object({
            person_id: z.string().min(1, 'La persona es obligatoria'),

            ownership_percentage: z.coerce
                .number()
                .min(1, 'Debe ser mayor a 0')
                .max(100, 'No puede ser mayor a 100'),

            status_id: z.string().min(1, 'El estado es obligatorio'),

            ownership_start_date: z.string().optional().nullable(),

            ownership_end_date: z.string().optional().nullable(),

            is_principal_owner: z.boolean()
        })
    )
        .min(1, 'Debe agregar al menos un propietario')

        .refine(
            (items) => items.some(i => i.is_principal_owner),
            {
                message: 'Debe seleccionar un propietario principal',
                path: [0, 'is_principal_owner']
            }
        )

        .refine(
            (items) => {
                const total = items.reduce(
                    (sum, i) => sum + (Number(i.ownership_percentage) || 0),
                    0
                )
                return total === 100
            },
            {
                message: 'El total de porcentaje debe ser 100%',
                path: ['ownerships']
            }
        )
})
