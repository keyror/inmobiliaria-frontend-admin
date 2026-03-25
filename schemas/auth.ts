import { z } from 'zod'

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'El email es obligatorio')
        .pipe(z.email({ message: 'Email inválido' })),

    password: z.string().min(8, 'Mínimo 8 caracteres'),
    remember_me: z.boolean()
})
