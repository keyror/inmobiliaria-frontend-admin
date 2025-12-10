import { ApiError } from '@/utils/ApiError';
import { useAuthStore } from '@/store/authStore';
import type { FetchContext } from 'ofetch';

function cleanPayload(payload: any): any {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return payload;
    }

    const cleaned: Record<string, any> = {};
    let hasChanges = false;

    for (const key in payload) {
        const value = payload[key];

        // Omitir valores vacíos o null
        if (value === '' || value === null) {
            hasChanges = true;
            continue;
        }

        cleaned[key] = value;
    }

    return hasChanges ? cleaned : payload;
}

export function useApi<T>(
    request: Parameters<typeof $fetch<T>>[0],
    opts?: Parameters<typeof $fetch<T>>[1],
): Promise<T> {
    const config = useRuntimeConfig();
    const auth = useAuthStore();

    const fetchOpts = {
        ...opts,
        baseURL: config.public.apiBase,
        headers: {
            ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
            ...opts?.headers,
        },
        async onResponse({ response }: FetchContext) {
            // Guard clause
            if (!response?._data) return;

            // Early return para archivos
            if (response._data instanceof Blob) return;

            if (!response._data.status) {
                const mensaje = Array.isArray(response._data.message)
                    ? response._data.message.join('<br>')
                    : response._data.message;

                throw new ApiError(mensaje);
            }
        },
    };

    if (opts?.body) {
        fetchOpts.body = cleanPayload(opts.body);
    }

    return $fetch<T>(request, fetchOpts);
}
