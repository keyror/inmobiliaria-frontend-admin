import { getActivePinia } from "pinia";

import { useAuthStore } from "@/store/authStore";
import LoadingService from "~/services/LoadingService";

import type { FetchContext } from "ofetch";

let requestCount = 0;
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

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
  if (payload === null || payload === "" || typeof payload !== "object") {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload
      .map(cleanPayload)
      .filter((v) => v !== null && v !== "" && v !== undefined);
  }

  const cleaned: Record<string, any> = {};

  for (const key in payload) {
    const value = cleanPayload(payload[key]);

    if (
      value === null ||
      value === "" ||
      value === undefined ||
      (typeof value === "object" &&
        !Array.isArray(value) &&
        !Object.keys(value).length)
    ) {
      continue;
    }

    cleaned[key] = value;
  }

  return cleaned;
}

type ApiOpts<T> = Parameters<typeof $fetch<T>>[1] & {
  cleanPayload?: boolean;
  silent?: boolean;
  skipRefresh?: boolean;
};

export function useApi<T>(
  request: Parameters<typeof $fetch<T>>[0],
  opts?: ApiOpts<T>,
): Promise<T> {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const silent = opts?.silent ?? false;
  const shouldCleanPayload = opts?.cleanPayload ?? true;

  const {
    cleanPayload: _cleanPayload,
    silent: _silent,
    skipRefresh: _skipRefresh,
    ...restOpts
  } = opts ?? {};

  const execute = (): Promise<T> => {
    const activeCompanyId =
      (getActivePinia()?.state.value["branch"] as any)?.activeCompanyId ??
      null;

    const fetchOpts: Record<string, any> = {
      ...restOpts,
      baseURL: config.public.apiBase,

      headers: {
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        ...(activeCompanyId ? { "X-Company-Id": activeCompanyId } : {}),
        ...restOpts?.headers,
      },

      async onRequest() {
        if (!silent) startLoading();
      },

      async onRequestError() {
        if (!silent) stopLoading();
      },

      // Solo valida status:false en respuestas 2xx del backend
      async onResponse({ response }: FetchContext) {
        if (!silent) stopLoading();

        if (!response?.ok || !response._data) return;
        if (response._data instanceof Blob) return;

        if (!response._data.status) {
          const mensaje = Array.isArray(response._data.message)
            ? response._data.message.join("<br>")
            : response._data.message;

          throw new ApiError(
            mensaje,
            response._data.errors ?? undefined,
            response.status,
            response._data.required_permissions ?? undefined,
          );
        }
      },

      async onResponseError({ response }: FetchContext) {
        if (!silent) stopLoading();

        // 401 sin skipRefresh → lo maneja el interceptor externo (refresh → retry)
        // 401 con skipRefresh (ej: login) → cae al bloque normal para extraer el mensaje
        if (response?.status === 401 && !opts?.skipRefresh) return;

        const mensaje = response?._data?.message
          ? Array.isArray(response._data.message)
            ? response._data.message.join("<br>")
            : response._data.message
          : "Error inesperado";

        throw new ApiError(
          mensaje,
          response?._data?.errors ?? undefined,
          response?.status,
          response?._data?.required_permissions ?? undefined,
        );
      },
    };

    if (restOpts?.body instanceof FormData) {
      fetchOpts.body = restOpts.body;
    } else if (restOpts?.body) {
      fetchOpts.body = shouldCleanPayload
        ? cleanPayload(restOpts.body)
        : restOpts.body;
    }

    return $fetch<T>(request, fetchOpts);
  };

  return execute().catch(async (err: any) => {
    const status = err?.response?.status ?? err?.statusCode ?? err?.status;

    if (status !== 401 || opts?.skipRefresh) throw err;

    // Solo un refresh simultáneo; los demás esperan la misma promesa
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = auth.refreshToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    try {
      await refreshPromise;
    } catch {
      auth.clearAuth();
      await navigateTo("/authentication/login");
      throw err;
    }

    // Reintenta con el nuevo token (auth.token ya fue actualizado por refreshToken)
    return execute();
  });
}
