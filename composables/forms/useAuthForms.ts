// composables/useAuthForms.ts
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import {forgotPasswordSchema, loginSchema, resetPasswordSchema} from '@/schemas/authSchema';

export const useAuthForms = () => {

    const useLoginForm = () => {
        return useForm({
            validationSchema: toTypedSchema(loginSchema),
            initialValues: {
                email: '',
                password: '',
                remember_me: false
            }
        });
    };

    const useResetPasswordForm = (initialData?: { email?: string; token?: string }) => {
        return useForm({
            validationSchema: toTypedSchema(resetPasswordSchema),
            initialValues: {
                email: initialData?.email ?? '',
                token: initialData?.token ?? '',
                password: '',
                password_confirmation: ''
            }
        });
    };

    const useForgotPasswordForm = () => {
        return useForm({
            validationSchema: toTypedSchema(forgotPasswordSchema),
            initialValues: {
                email: ''
            }
        });
    };

    return {
        useLoginForm,
        useResetPasswordForm,
        useForgotPasswordForm
    };
};
