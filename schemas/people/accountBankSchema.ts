import { z } from 'zod'

export const accountBankFormSchema = z.object({
    accounts: z.array(
        z.object({
            bank_id: z.string().min(1, 'Seleccione el banco'),
            account_type_id: z.string().min(1, 'Seleccione el tipo de cuenta'),
            account_number: z.string().min(1, 'Ingrese el número de cuenta'),
            is_principal: z.boolean()
        })
    )
        .min(1, 'Debe agregar al menos una cuenta')
        .refine(
            (accounts) => accounts.some(acc => acc.is_principal === true),
            {
                message: 'Debe seleccionar una cuenta principal',
                path: [0, 'is_principal']
            }
        )
})
