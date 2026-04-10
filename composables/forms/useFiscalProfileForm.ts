import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { fiscalProfileSchema } from '~/schemas/people/fiscalProfileSchema'

export const useFiscalProfileForm = (initialData?: any) => {
    return useForm({
        validationSchema: toTypedSchema(fiscalProfileSchema),
        initialValues: {
            economic_activities: initialData?.economic_activities ?? [],
            taxe_types: initialData?.taxe_types ?? [],
            responsible_for_vat_type_id: initialData?.responsible_for_vat_type_id ?? '',
            vat_withholding: initialData?.vat_withholding ?? '',
            income_tax_withholding: initialData?.income_tax_withholding ?? '',
            ica_withholding: initialData?.ica_withholding ?? '',
            rental_fee: initialData?.rental_fee ?? '',
        }
    })
}
