import { ApiError } from '@/utils/ApiError';
import { useAuthStore } from '@/store/authStore';
import type { FetchContext } from 'ofetch';
import LoadingService from '~/services/LoadingService';

let requestCount = 0;
let isLoggingOut = false;

function startLoading() {
    requestCount++;
    LoadingService.show();
}

function stopLoading() {
    requestCount = Math.max(0, requestCount - 1);

    if (requestCount === 0) {
        LoadingService.hide();
    }
}

// LIMPIAR PAYLOAD
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
            (typeof value === 'object' &&
                !Array.isArray(value) &&
                !Object.keys(value).length)
        ) {
            continue;
        }

        cleaned[key] = value;
    }

    return cleaned;
}

type ApiOpts<T> = Parameters<typeof $fetch<T>>[1] & { silent?: boolean };

export function useApi<T>(
    request: Parameters<typeof $fetch<T>>[0],
    opts?: ApiOpts<T>,
): Promise<T> {

    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const silent = opts?.silent ?? false;

    // Extraer silent para que no llegue a $fetch
    const { silent: _silent, ...restOpts } = opts ?? {};

    const fetchOpts: Record<string, any> = {
        ...restOpts,
        baseURL: config.public.apiBase,

        headers: {
            ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
            ...restOpts?.headers,
        },

        // REQUEST START
        async onRequest() {
            if (!silent) startLoading();
        },

        // ERROR ANTES DE SALIR
        async onRequestError() {
            if (!silent) stopLoading();
        },

        // RESPUESTA OK
        async onResponse({ response }: FetchContext) {
            if (!silent) stopLoading();

            if (!response?._data) return;
            if (response._data instanceof Blob) return;

            // ERROR CONTROLADO BACKEND
            if (!response._data.status) {
                const mensaje = Array.isArray(response._data.message)
                    ? response._data.message.join('<br>')
                    : response._data.message;

                throw new ApiError(
                    mensaje,
                    response._data.errors ?? undefined,
                    response.status
                );
            }
        },

        async onResponseError({ response }: FetchContext) {
            if (!silent) stopLoading();

            const mensaje = response?._data?.message
                ? (Array.isArray(response._data.message)
                    ? response._data.message.join('<br>')
                    : response._data.message)
                : 'Error inesperado';

            // 401 → LOGOUT CONTROLADO
            if (response?.status === 401 && !isLoggingOut) {
                isLoggingOut = true;

                try {
                    await auth.logout();
                } finally {
                    navigateTo('/login');
                    isLoggingOut = false;
                }
            }

            throw new ApiError(
                mensaje,
                response?._data?.errors ?? undefined,
                response?.status
            );
        }
    };

    // LIMPIAR BODY
    if (restOpts?.body instanceof FormData) {
        fetchOpts.body = restOpts.body;
    } else if (restOpts?.body) {
        fetchOpts.body = cleanPayload(restOpts.body);
    }

    return $fetch<T>(request, fetchOpts);
}
