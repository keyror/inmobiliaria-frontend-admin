<template>
  <div class="sr-picker" :class="classes">
    <CommonInputfieldsSelectfield
      v-model="selectedKey"
      :data="routeOptions"
      :label="label"
      :disabled="disabled"
      label-field="name"
      name="site-route-picker"
      show="— Sin enlace —"
      @update:model-value="onSelect"
    />

    <small v-if="currentDescription && selectedKey !== CUSTOM_SENTINEL" class="text-muted d-block mt-1">
      {{ currentDescription }}
    </small>

    <div v-if="selectedKey === CUSTOM_SENTINEL" class="sr-custom mt-2">
      <CommonInputfieldsTextfield
        v-model="customValue"
        classes=""
        label=""
        :required="false"
        name="site-route-custom"
        placeholder="/ruta o https://ejemplo.com"
        @update:model-value="emit('update:modelValue', customValue)"
      />
      <small class="text-muted">
        Ruta relativa (ej: <code>/realstate/property?search=Nuevo</code>) o URL completa.
      </small>
    </div>

    <small v-if="hint" class="text-muted d-block mt-1">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
import {
  CUSTOM_ROUTE_SENTINEL,
  PUBLIC_SITE_ROUTES,
} from "~/constants/PublicSiteRoutes";
import type { ILookup } from "~/interfaces/ILookup";

interface Props {
  modelValue?: string;
  label?: string;
  hint?: string;
  classes?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: "",
  hint: "",
  classes: "col-md-4",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const CUSTOM_SENTINEL = CUSTOM_ROUTE_SENTINEL;

const routeOptions = computed<ILookup[]>(() => [
  ...PUBLIC_SITE_ROUTES.map((route) => ({
    id: route.path,
    category: "public_route",
    name: route.label,
    alias: route.description,
    value: route.path,
    code: route.path,
    icon: null,
    is_active: true,
    lang: "es",
  })),
  {
    id: CUSTOM_SENTINEL,
    category: "public_route",
    name: "URL personalizada…",
    alias: "Escribe una ruta relativa o URL completa",
    value: CUSTOM_SENTINEL,
    code: CUSTOM_SENTINEL,
    icon: null,
    is_active: true,
    lang: "es",
  },
]);

const isKnownRoute = (path: string) =>
  PUBLIC_SITE_ROUTES.some((r) => r.path === path);

const selectedKey = ref<string>(
  props.modelValue && !isKnownRoute(props.modelValue)
    ? CUSTOM_SENTINEL
    : (props.modelValue ?? ""),
);

const customValue = ref<string>(
  props.modelValue && !isKnownRoute(props.modelValue) ? props.modelValue : "",
);

const currentDescription = computed(
  () =>
    PUBLIC_SITE_ROUTES.find((r) => r.path === selectedKey.value)?.description ?? "",
);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      selectedKey.value = "";
      customValue.value = "";
    } else if (isKnownRoute(val)) {
      selectedKey.value = val;
      customValue.value = "";
    } else {
      selectedKey.value = CUSTOM_SENTINEL;
      customValue.value = val;
    }
  },
);

function onSelect(val: string) {
  if (val === CUSTOM_SENTINEL) {
    customValue.value = "";
    emit("update:modelValue", "");
    return;
  }
  emit("update:modelValue", val ?? "");
}
</script>
