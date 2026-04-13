import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { obligationFormSchema } from '~/schemas/property/obligationSchema'

export const useObligationForm = () => {
    return useForm({
        validationSchema: toTypedSchema(obligationFormSchema),
        initialValues: {
            obligations: [
                {
                    obligation_type_id: '',
                    amount: '',
                    total: '',
                    frequency_type_id: '',
                    expiration_date: '',
                    status_id: '',
                    description: ''
                }
            ]
        }
    })
}
