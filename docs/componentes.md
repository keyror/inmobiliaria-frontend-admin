# Componentes — Frontend Admin

## Estructura de un componente

```vue
<!-- components/property/PropertyCard.vue -->
<script setup lang="ts">
import type { IProperty } from '~/interfaces/IProperty';

interface Props {
  property: IProperty;
  showActions?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
}>();
</script>

<template>
  <div class="property-card">
    <h3>{{ property.title }}</h3>
    <button v-if="props.showActions" @click="emit('edit', property.id)">
      Editar
    </button>
  </div>
</template>
```

## Reglas de componentes

1. Siempre `<script setup lang="ts">` — nunca Options API
2. Props obligatoriamente tipadas con `interface` + `defineProps<Props>()`
3. Emits definidos con tipos explícitos en `defineEmits<{...}>()`
4. Usar `props.` explícitamente (no destructuring reactivo sin `toRefs`)
5. Lógica compleja va en composable, no en el componente

## Clase `admin-form` (obligatoria en formularios)

Todo componente que contenga campos de formulario **debe** usar `admin-form` en su elemento raíz. Sin esta clase los inputs y selects muestran estilos Bootstrap crudos en lugar del tema del admin.

```vue
<template>
  <!-- ✅ Correcto — form con admin-form -->
  <form class="admin-form row gx-3">
    <CommonInputfieldsTextfield ... />
  </form>

  <!-- ❌ Incorrecto — div sin admin-form -->
  <div class="row g-3">
    <CommonInputfieldsTextfield ... />
  </div>
</template>
```

> `admin-form` en el componente padre (`card-body`) **no siempre cascadea** correctamente a componentes hijos — cada componente de formulario debe declararlo en su propio elemento raíz.

## Componentes de formulario

```vue
<script setup lang="ts">
interface Props {
  modelValue: Partial<IProperty>;
  errors?: Record<string, string>;
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: Partial<IProperty>): void;
  (e: 'submit'): void;
}>();

// Formulario editable local
const form = ref({ ...props.modelValue });
watch(() => props.modelValue, (v) => { form.value = { ...v }; });
</script>
```

## Verificar permisos en componentes

```vue
<script setup>
const { hasPermission } = usePermissions();
</script>

<template>
  <button v-if="hasPermission('create properties')">Crear</button>
</template>
```

## Lookups (select options)

```vue
<script setup>
const { lookups } = useLookups(['property_status', 'offer_types']);
</script>

<template>
  <select>
    <option v-for="opt in lookups.property_status" :key="opt.id" :value="opt.id">
      {{ opt.name }}
    </option>
  </select>
</template>
```

## Organización de carpetas de componentes

```
components/
├── [feature]/          # Componentes específicos del dominio
│   ├── FeatureForm.vue
│   ├── FeatureCard.vue
│   └── FeatureTable.vue
└── shared/             # Componentes reutilizables genéricos
    ├── DataTable.vue
    ├── Modal.vue
    └── LoadingSpinner.vue
```
