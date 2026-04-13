import { z } from 'zod'

export const areasFormSchema = z.object({
    areas: z.array(
        z.object({
            area_type_id: z.string().min(1, 'Seleccione el tipo de área'),

            area_value: z.coerce.number()
                .min(1, 'El valor debe ser mayor a 0'),

            area_unit_id: z.string().min(1, 'Seleccione la unidad')
        })
    )
        .min(1, 'Debe agregar al menos un área')
})
