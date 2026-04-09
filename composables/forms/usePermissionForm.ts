import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { permissionSchema } from '~/schemas/authorizationSchema'

export const usePermissionForm = () => {

    const usePermissionCreateForm = () => {
        return useForm({
            validationSchema: toTypedSchema(permissionSchema),
            initialValues: {
                name: ''
            }
        })
    }

    return {
        usePermissionCreateForm,
    }
}
