import { z } from 'zod'

export const contactFormSchema = z.object({
    contacts: z.array(
        z.object({
            phone: z.string().optional().nullable(),
            mobile: z.string().min(1, 'El teléfono móvil es obligatorio'),
            email: z.string().min(1, 'El correo es obligatorio').email('Correo no válido'),
            is_principal: z.boolean()
        })
    )
        .min(1, 'Debe agregar al menos un contacto')
        .refine(
            (contacts) => contacts.some(c => c.is_principal === true),
            {
                message: 'Debe seleccionar un contacto principal',
                path: [0, 'is_principal']
            }
        )
})
