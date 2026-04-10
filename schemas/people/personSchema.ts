import { z } from 'zod'

export const personSchema = z.object({
    first_name: z.string().min(1, 'Nombres es obligatorio'),
    last_name: z.string().min(1, 'Apellidos es obligatorio'),
    document_type_id: z.string().min(1, 'Tipo documento obligatorio'),
    document_number: z.string().min(1, 'Número obligatorio'),
    document_from_id: z.string().min(1, 'Lugar de expedición obligatorio'),
    organization_type_id: z.string().min(1, 'Tipo organización obligatorio'),
    birth_date: z.string().min(1, 'Fecha nacimiento obligatoria'),
    gender_type_id: z.string().min(1, 'Género obligatorio'),
    dv: z.string().optional(),
    company_name: z.string().optional().nullable(),
})
