
import { z } from 'zod';

export const passwordSchema = z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Za-z]/, 'Debe tener letras')
    .regex(/[0-9]/, 'Debe tener números');

export const emailSchema = z
    .string()
    .min(1, 'El email es obligatorio')
    .pipe(z.email({ message: 'Email inválido' }));
