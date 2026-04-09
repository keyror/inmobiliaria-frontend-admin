import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { roleSchema } from '~/schemas/authorizationSchema'

export const useRoleForm = () => {
    return useForm({
        validationSchema: toTypedSchema(roleSchema),
        initialValues: {
            name: ''
        }
    })
}
