import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { personSchema } from '~/schemas/people/personSchema'

export const usePersonForm = (initialData?: any) => {
    return useForm({
        validationSchema: toTypedSchema(personSchema),
        initialValues: {
            first_name: initialData?.first_name ?? '',
            last_name: initialData?.last_name ?? '',
            company_name: initialData?.company_name ?? '',
            document_type_id: initialData?.document_type_id ?? '',
            document_number: initialData?.document_number ?? '',
            document_from_id: initialData?.document_from_id ?? '',
            organization_type_id: initialData?.organization_type_id ?? '',
            birth_date: initialData?.birth_date ?? '',
            gender_type_id: initialData?.gender_type_id ?? '',
            dv: initialData?.dv ?? '',
        }
    })
}
