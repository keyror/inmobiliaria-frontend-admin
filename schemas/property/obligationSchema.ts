import { z } from 'zod'

export const obligationFormSchema = z.object({
    obligations: z.array(
        z.object({
            obligation_type_id: z.string().min(1, 'Tipo de obligación obligatorio'),

            amount: z.coerce
                .number()
                .min(1, 'El monto debe ser mayor a 0'),

            total: z.coerce
                .number()
                .min(1, 'El total debe ser mayor a 0'),

            frequency_type_id: z.string().min(1, 'Frecuencia obligatoria'),

            expiration_date: z.string().optional().nullable(),

            status_id: z.string().min(1, 'Estado obligatorio'),

            description: z.string().optional().nullable()
        })
    )
        .min(1, 'Debe agregar al menos una obligación')
})
