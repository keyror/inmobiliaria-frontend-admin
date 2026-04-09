// composables/useTenantForm.ts
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { tenantSchema } from '@/schemas/tenantSchema';

export const useTenantForm = () => {
    return useForm({
        validationSchema: toTypedSchema(tenantSchema),
        initialValues: {
            name: '',
            email: '',
            domain: '',
            plan_id: '',
            status_id: '',
            subscription_ends_at: null
        }
    });
};
