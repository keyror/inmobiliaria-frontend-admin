import { ApiError } from '@/utils/ApiError';
import { useAuthStore } from '@/store/authStore';
import type { FetchContext } from 'ofetch';

function cleanPayload(payload: any): any {
    if (payload === null || payload === '' || typeof payload !== 'object') {
        return payload;
    }

    if (Array.isArray(payload)) {
        return payload
            .map(cleanPayload)
            .filter(v => v !== null && v !== '' && v !== undefined);
    }

    const cleaned: Record<string, any> = {};

    for (const key in payload) {
        const value = cleanPayload(payload[key]);

        if (
            value === null ||
            value === '' ||
            value === undefined ||
            (typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length)
        ) {
            continue;
        }

        cleaned[key] = value;
    }

    return cleaned;
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
