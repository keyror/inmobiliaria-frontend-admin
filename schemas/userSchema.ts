import { z } from 'zod'
import { emailSchema, passwordSchema } from '~/schemas/commonSchema'

const baseUserSchema = z.object({
    email: emailSchema,
    status_type_id: z.string().min(1, 'El estado es obligatorio'),
    roles: z.array(z.any()).min(1, 'Seleccione al menos un rol'),
})

export const userCreateSchema = baseUserSchema.extend({
    password: passwordSchema,
    password_confirmation: z.string().min(1, 'Confirme la contraseña'),
}).refine(data => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
})

export const userUpdateSchema = baseUserSchema.extend({
    password: z.union([z.literal(''), passwordSchema]),
    password_confirmation: z.string().optional(),
}).refine(data => !data.password || data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
})
