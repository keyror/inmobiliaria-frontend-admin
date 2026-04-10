import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { contactFormSchema } from '~/schemas/people/contactSchema'

export const useContactForm = () => {
    return useForm({
        validationSchema: toTypedSchema(contactFormSchema),
        initialValues: {
            contacts: [
                {
                    phone: '',
                    mobile: '',
                    email: '',
                    is_principal: true
                }
            ]
        }
    })
}
