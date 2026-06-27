# Consumo de API — Frontend Admin

## Capas del sistema de API

```
useApiHandler().run(promise, opts)   ← manejo de errores/éxito
    XxxService.method()              ← clase singleton, llama a useApi
        useApi(url, options)         ← wrapper de $fetch: auth + loading + limpieza
            $fetch (ofetch)          ← HTTP nativo de Nuxt
```

## 1. Definir la URL (`constants/ApiUrls.ts`)

```ts
export const ApiUrls = {
  // Propiedades (ejemplo del patrón)
  PROPERTIES_GET: '/properties',
  PROPERTIES_SHOW_GET: '/properties',
  PROPERTIES_CREATE_POST: '/properties',
  PROPERTIES_UPDATE_PUT: '/properties',
  PROPERTIES_DELETE_DELETE: '/properties',
};
```

## 2. Crear el servicio (`services/XxxService.ts`)

```ts
import { useApi } from '~/composables/useApi';
import { ApiUrls } from '~/constants/ApiUrls';
import type { IXxx } from '~/interfaces/IXxx';
import type { IParamsTable } from '~/interfaces/IParamsTable';

class XxxService {
  async getAll(params: IParamsTable): Promise<any> {
    return useApi(ApiUrls.XXX_GET, { query: params });
  }

  async getOne(id: string | number): Promise<any> {
    return useApi(`${ApiUrls.XXX_SHOW_GET}/${id}`);
  }

  async create(payload: Partial<IXxx>): Promise<any> {
    return useApi(ApiUrls.XXX_CREATE_POST, { method: 'POST', body: payload });
  }

  async update(id: string | number, payload: Partial<IXxx>): Promise<any> {
    return useApi(`${ApiUrls.XXX_UPDATE_PUT}/${id}`, { method: 'PUT', body: payload });
  }

  async delete(id: string | number): Promise<any> {
    return useApi(`${ApiUrls.XXX_DELETE_DELETE}/${id}`, { method: 'DELETE' });
  }
}

export default new XxxService();
```

## 3. Usar en componente/página

```vue
<script setup lang="ts">
import XxxService from '~/services/XxxService';

const { run } = useApiHandler();
const errors = ref<Record<string, string>>({});

// GET (sin manejo de errores personalizado)
const { data: items } = await useAsyncData('xxx-list', () => XxxService.getAll({}));

// POST con manejo de errores de validación
const handleCreate = async () => {
  const result = await run(XxxService.create(form.value), {
    showSuccess: true,
    successMessage: 'Creado correctamente',
    setErrors: (errs) => { errors.value = errs; },
  });

  if (result) {
    // éxito — result contiene la respuesta del backend
    await refreshNuxtData('xxx-list');
  }
};

// DELETE
const handleDelete = async (id: string) => {
  await run(XxxService.delete(id), { showSuccess: true });
  await refreshNuxtData('xxx-list');
};
</script>
```

## Qué hace `useApi` automáticamente

- Incluye el token Bearer en cada request (desde `authStore`)
- Muestra/oculta el indicador de loading global
- Limpia el payload (elimina `null`, `""`, `undefined` vacíos)
- Lanza `ApiError` con `error.errors` para errores de validación 422

## Qué hace `useApiHandler().run()` automáticamente

- Si `showSuccess: true` → muestra alerta de éxito con `AlertService`
- Si hay error de validación (ApiError con `.errors`) → llama `setErrors()` para poblar el formulario
- Si hay otro error → muestra alerta de error automáticamente
- Retorna `null` si hubo error, o la respuesta si fue exitoso

## Limpieza de formularios

`useApi` limpia automáticamente el payload antes de enviarlo: elimina `null`, `""`, y objetos vacíos. No necesitas limpiar manualmente antes de enviar.
