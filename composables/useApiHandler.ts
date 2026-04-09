import { ApiError } from '@/utils/ApiError';
import AlertaService from "~/services/AlertService";

export const useApiHandler = () => {

    const run = async <T>(
        promise: Promise<T>,
        options?: {
            setErrors?: (errors: Record<string, string>) => void;
            showSuccess?: boolean;
            successMessage?: string;
        }
    ): Promise<T | null> => {

        try {
            const response = await promise;

            if (options?.showSuccess) {
                await AlertaService.showSuccess(
                    'Operación exitosa',
                    options.successMessage ?? (response as any)?.message
                );
            }

            return response;

        } catch (error: any) {

            // VALIDACIÓN
            if (error instanceof ApiError && error.errors && options?.setErrors) {

                const formattedErrors = Object.fromEntries(
                    Object.entries(error.errors).map(([field, messages]) => [
                        field,
                        (messages as string[])[0]
                    ])
                );

                options.setErrors(formattedErrors);
                return null;
            }

            // ERROR NORMAL
            await AlertaService.showError(
                'Ha ocurrido un error',
                error.message ?? error
            );

            return null;
        }
    };

    return { run };
};
