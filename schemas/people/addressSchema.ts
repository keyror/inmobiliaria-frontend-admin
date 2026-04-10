import { z } from 'zod'

export const addressFormSchema = z.object({
        addresses: z.array(
            z.object({
                    address: z.string().min(1, 'La dirección es obligatoria'),
                    via_type_id: z.string().min(1, 'Seleccione el tipo de vía'),
                    via_number: z.string().min(1, 'Ingrese el número de vía'),
                    number2: z.string().min(1, 'Ingrese el número de cruce'),
                    number3: z.string().min(1, 'Ingrese el número de placa'),
                    country_id: z.string().min(1, 'Seleccione el país'),
                    department_id: z.string().min(1, 'Seleccione el departamento'),
                    city_id: z.string().min(1, 'Seleccione la ciudad'),
                    letra1_id: z.string().optional().nullable(),
                    orientation1_id: z.string().optional().nullable(),
                    letra2_id: z.string().optional().nullable(),
                    orientation2_id: z.string().optional().nullable(),
                    complement: z.string().optional().nullable(),
                    zip_code: z.string().optional().nullable(),
                    sector: z.string().optional().nullable(),
                    stratum_id: z.string().optional().nullable(),
                    is_principal: z.boolean().optional().nullable(),
            })
        )
            .min(1, 'Debe agregar al menos una dirección')
            .refine(
                (addresses) => addresses.some(a => a.is_principal === true),
                {
                        message: 'Debe seleccionar una dirección principal',
                        path: [0, 'is_principal']
                }
            )
})
