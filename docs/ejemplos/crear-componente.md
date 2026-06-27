# Ejemplo: Crear un componente

Caso: Componente `ContractForm.vue` para crear/editar contratos.

## Archivo: `components/contract/ContractForm.vue`

```vue
<script setup lang="ts">
import type { IContract } from '~/interfaces/IContract';

interface Props {
  modelValue: Partial<IContract>;
  errors?: Record<string, string>;
  loading?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Partial<IContract>): void;
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

// Formulario local reactivo
const form = ref<Partial<IContract>>({ ...props.modelValue });

// Sincronizar si el padre cambia el modelValue
watch(() => props.modelValue, (val) => {
  form.value = { ...val };
}, { deep: true });

// Emitir cambios al padre (v-model support)
const update = (key: keyof IContract, value: any) => {
  form.value = { ...form.value, [key]: value };
  emit('update:modelValue', form.value);
};

// Lookups para selects
const { lookups } = useLookups(['contract_types', 'property_status']);
</script>

<template>
  <form @submit.prevent="emit('submit')">
    <div class="form-group">
      <label>Tipo de contrato</label>
      <select
        :value="form.type_id"
        @change="update('type_id', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in lookups.contract_types" :key="opt.id" :value="opt.id">
          {{ opt.name }}
        </option>
      </select>
      <span v-if="errors?.['contract.type_id']" class="error">
        {{ errors['contract.type_id'] }}
      </span>
    </div>

    <div class="form-group">
      <label>Fecha inicio</label>
      <input
        type="date"
        :value="form.start_date"
        @input="update('start_date', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="errors?.['contract.start_date']" class="error">
        {{ errors['contract.start_date'] }}
      </span>
    </div>

    <div class="form-actions">
      <button type="button" @click="emit('cancel')">Cancelar</button>
      <button type="submit" :disabled="props.loading">
        {{ props.loading ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
  </form>
</template>
```

## Usar el componente en una página

```vue
<!-- pages/contracts/create.vue -->
<script setup lang="ts">
import ContractForm from '~/components/contract/ContractForm.vue';
import ContractService from '~/services/ContractService';

definePageMeta({ middleware: 'auth' });

const form = ref<Partial<IContract>>({});
const errors = ref<Record<string, string>>({});
const loading = ref(false);

const { run } = useApiHandler();

const handleSubmit = async () => {
  loading.value = true;
  const result = await run(ContractService.create(form.value), {
    showSuccess: true,
    setErrors: (errs) => { errors.value = errs; },
  });
  loading.value = false;

  if (result) {
    await navigateTo('/contracts');
  }
};
</script>

<template>
  <ContractForm
    v-model="form"
    :errors="errors"
    :loading="loading"
    @submit="handleSubmit"
    @cancel="navigateTo('/contracts')"
  />
</template>
```
