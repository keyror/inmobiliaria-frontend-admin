import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { areasFormSchema } from '~/schemas/property/areasSchema'

export const useAreasForm = () => {
    return useForm({
        validationSchema: toTypedSchema(areasFormSchema),
        initialValues: {
            areas: [
                {
                    area_type_id: '',
                    area_value: null,
                    area_unit_id: ''
                }
            ]
        }
    })
}
