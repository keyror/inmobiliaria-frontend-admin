# Ejemplo: Crear un composable

## Cuándo crear un composable

- Lógica que se reutiliza en múltiples páginas/componentes
- Gestión de estado local compleja (formularios con muchos campos)
- Operaciones que combinan múltiples servicios
- Lógica de filtros/paginación de tablas

## Ejemplo: `composables/useContractForm.ts`

```ts
import ContractService from '~/services/ContractService';
import type { IContract } from '~/interfaces/IContract';

export const useContractForm = (initialData?: Partial<IContract>) => {
  const form = ref<Partial<IContract>>(initialData ?? {});
  const errors = ref<Record<string, string>>({});
  const loading = ref(false);

  const { run } = useApiHandler();

  const create = async (): Promise<IContract | null> => {
    loading.value = true;
    errors.value = {};

    const result = await run(ContractService.create(form.value), {
      showSuccess: true,
      successMessage: 'Contrato creado',
      setErrors: (errs) => { errors.value = errs; },
    });

    loading.value = false;
    return result;
  };

  const update = async (id: string): Promise<IContract | null> => {
    loading.value = true;
    errors.value = {};

    const result = await run(ContractService.update(id, form.value), {
      showSuccess: true,
      setErrors: (errs) => { errors.value = errs; },
    });

    loading.value = false;
    return result;
  };

  const reset = () => {
    form.value = initialData ?? {};
    errors.value = {};
  };

  return { form, errors, loading, create, update, reset };
};
```

## Usar el composable en una página

```vue
<script setup lang="ts">
const { form, errors, loading, create } = useContractForm();

const handleSubmit = async () => {
  const result = await create();
  if (result) await navigateTo('/contracts');
};
</script>

<template>
  <ContractForm
    v-model="form"
    :errors="errors"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
```

## Ejemplo: composable de tabla con filtros (`composables/properties/usePropertyTable.ts`)

```ts
import type { IParamsTable } from '~/interfaces/IParamsTable';

export const usePropertyTable = () => {
  const params = ref<IParamsTable>({ page: 1, perPage: 15 });

  const { data: properties, refresh, pending } = useAsyncData(
    'properties-table',
    () => PropertyService.getAll(params.value),
    { watch: [params] }
  );

  const setFilter = (key: keyof IParamsTable, value: any) => {
    params.value = { ...params.value, [key]: value, page: 1 };
  };

  const setPage = (page: number) => {
    params.value = { ...params.value, page };
  };

  return { properties, params, pending, refresh, setFilter, setPage };
};
```

## Convenciones

- Nombre siempre: `useXxx` (prefijo `use` obligatorio para Nuxt auto-import)
- Ubicación: `composables/` o `composables/[feature]/` para dominio específico
- Retornar objeto `{ ... }`, no array (excepto si imita API como `useState`)
- Los composables son auto-importados por Nuxt — no necesitan import explícito en componentes
