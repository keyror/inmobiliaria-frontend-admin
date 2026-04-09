import { z } from 'zod'
import {emailSchema, passwordSchema} from "~/schemas/commonSchema";

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    remember_me: z.boolean()
})

export const resetPasswordSchema = z.object({
    email: emailSchema,
    token: z.string().min(1, 'Token requerido'),
    password: passwordSchema,
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});


export const forgotPasswordSchema = z.object({
    email: emailSchema,
});
