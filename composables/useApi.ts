import { ApiError } from '@/utils/ApiError';
import { useAuthStore } from '@/store/authStore'

export function useApi<T>(
    request: Parameters<typeof $fetch<T>>[0],
    opts?: Parameters<typeof $fetch<T>>[1],
): Promise<T> {
    const config = useRuntimeConfig();
    const auth = useAuthStore();

    // Eliminar campos que van vacios
    if (opts?.body) {
        opts.body = cleanPayload(opts.body);
    }

    return $fetch<T>(request, {
        ...opts,
        baseURL: config.public.apiBase,
        headers: {
            ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
            ...opts?.headers,
        },
        async onResponse({ response }) {
            if (response._data instanceof Blob) {
                return; // es archivo, no validar estructura
            }

            if (!response._data.status) {
                const mensaje = Array.isArray(response._data.message)
                    ? response._data.message.join('<br>')
                    : response._data.message;

                throw new ApiError(mensaje);
            }
        },
    });

    function cleanPayload(payload: any) {
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
            const cleaned = { ...payload };

            for (const key in cleaned) {
                if (cleaned[key] === '' || cleaned[key] === null) {
                    delete cleaned[key]; // elimina el campo
                }
            }

            return cleaned;
        }
        return payload;
    }

}
