<template>
  <div class="sf-wrap" :class="[classes, { 'was-validated': error }]">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <div
      class="dropdown w-100"
      :class="{ 'is-invalid': error, 'is-disabled': disabled }"
      ref="componentRef"
    >
      <span
        class="dropdown-toggle font-rubik d-flex justify-content-between align-items-center w-100"
        :class="{ 'is-invalid': error, disabled }"
        :aria-disabled="disabled"
        :data-bs-toggle="disabled ? null : 'dropdown'"
        style="cursor: pointer"
      >
        <span class="text-truncate">{{ displayLabel }}</span>
        <i class="fas fa-angle-down"></i>
      </span>

      <div
        class="dropdown-menu text-start w-100 p-2 overflow-auto"
        style="max-height: 300px"
        @click="multiple ? $event.stopPropagation() : null"
        ref="dropdownMenu"
      >
        <input
          v-if="searchable"
          v-model="search"
          type="text"
          class="form-control mb-2 search-input"
          placeholder="Buscar..."
          :disabled="disabled"
          @input="onSearch?.(search)"
          @keydown.enter.prevent="selectCustomSearch"
          @click.stop
          autocomplete="off"
        />

        <a
          href="javascript:void(0)"
          class="dropdown-item d-flex justify-content-between align-items-center"
          v-for="item in filteredData"
          :key="item.id"
          @click="select(item)"
        >
          <span
            class="text-truncate d-inline-block"
            style="max-width: calc(100% - 25px)"
          >
            {{ getLabel(item) }}
          </span>
          <i
            v-if="isSelected(item)"
            class="fas fa-check text-success ms-2 flex-shrink-0"
          ></i>
        </a>

        <a
          v-if="canUseCustomValue"
          href="javascript:void(0)"
          class="dropdown-item custom-option d-flex flex-column align-items-start"
          @click="selectCustomSearch"
        >
          <span class="text-truncate w-100">
            Usar "{{ customSearchValue }}"
          </span>
          <small class="text-muted">Nueva opción</small>
        </a>

        <div v-if="multiple && selectedIds.length" class="mt-2 text-end">
          <button
            class="btn btn-pill btn-dashed color-4"
            type="button"
            :disabled="disabled"
            @click.stop="clearAll"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Tags para selección múltiple -->
    <div
      v-if="multiple && selectedIds.length"
      class="mt-1 d-flex flex-wrap gap-1"
    >
      <span
        v-for="val in selectedIds"
        :key="val"
        class="label label-light label-flat color-3 d-flex align-items-center gap-2"
      >
        {{ getLabel(data.find((it) => itemValue(it) === val)) }}
      </span>
    </div>

    <!-- Mensaje de error -->
    <small v-if="error" class="text-danger">
      {{ error }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { PropType } from "vue";

import type { ILookup } from "~/interfaces/ILookup";

type SelectModelValue = string | string[] | ILookup | ILookup[];

const props = defineProps({
  classes: String,
  label: String,
  star: String,
  data: { type: Array as PropType<ILookup[]>, default: () => [] },
  modelValue: {
    type: [String, Array, Object] as PropType<SelectModelValue>,
    default: "",
  },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  show: { type: String, default: "Selecciona una opción..." },
  labelField: {
    type: String as PropType<"name" | "alias" | "code" | "value">,
    default: "name",
  },
  valueField: {
    type: String as PropType<"id" | "name" | "alias" | "code" | "value">,
    default: "id",
  },
  concat: { type: Boolean, default: false },
  concatField: { type: String, default: "alias" },
  searchable: { type: Boolean, default: false },
  allowCustom: { type: Boolean, default: false },
  onSearch: {
    type: Function as PropType<(term: string) => void>,
    default: null,
  },
  name: String,
  error: String,
});

const emit = defineEmits(["update:modelValue"]);

const search = ref("");

const itemValue = (item: ILookup): string =>
  (item[props.valueField as keyof ILookup] ?? item.id) as string;

// normaliza el modelo a valores (id por defecto, o valueField si se indica)
const normalizedValue = computed({
  get() {
    const mv = props.modelValue;
    if (Array.isArray(mv)) {
      return mv.length && typeof mv[0] === "object" && "id" in mv[0]
        ? (mv as ILookup[]).map((it) => itemValue(it))
        : mv;
    }
    return mv && typeof mv === "object" && "id" in mv ? itemValue(mv as ILookup) : mv;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const selectedIds = computed(() =>
  Array.isArray(normalizedValue.value) ? normalizedValue.value : [],
);

const displayLabel = computed(() => {
  if (props.multiple) {
    if (!selectedIds.value.length) return props.show;
    const labels = props.data
      .filter((item) => selectedIds.value.includes(itemValue(item)))
      .map(getLabel);
    return labels.join(", ");
  }

  const found = props.data.find((item) => itemValue(item) === normalizedValue.value);
  if (found) return getLabel(found);

  if (props.allowCustom && typeof normalizedValue.value === "string") {
    return normalizedValue.value || props.show;
  }

  return props.show;
});

const filteredData = computed(() => {
  if (!props.searchable || !search.value) return props.data;
  const term = search.value.toLowerCase();
  return props.data.filter((item) =>
    getLabel(item).toLowerCase().includes(term),
  );
});

const customSearchValue = computed(() => search.value.trim());

const customValueAlreadyExists = computed(() => {
  const term = customSearchValue.value.toLowerCase();
  if (!term) return false;

  return props.data.some((item) => {
    const v = String(itemValue(item)).toLowerCase();
    const itemLabel = getLabel(item).toLowerCase();
    return v === term || itemLabel === term;
  });
});

const canUseCustomValue = computed(
  () =>
    props.allowCustom &&
    !props.multiple &&
    !!customSearchValue.value &&
    !customValueAlreadyExists.value,
);

function getLabel(item: ILookup | undefined) {
  if (!item) return "";
  const base = item[props.labelField] ?? "";
  return props.concat && item.name
    ? `${item[props.concatField]} - ${item.name}`
    : base;
}

const isSelected = (item: ILookup) => {
  const v = itemValue(item);
  return props.multiple
    ? selectedIds.value.includes(v)
    : normalizedValue.value === v;
};

function select(item: ILookup) {
  if (props.disabled) return;

  const v = itemValue(item);
  if (props.multiple) {
    const values = [...selectedIds.value];
    const index = values.indexOf(v);
    index === -1 ? values.push(v) : values.splice(index, 1);
    normalizedValue.value = values;
  } else {
    normalizedValue.value = v;
  }
}

function selectCustomSearch() {
  if (props.disabled || !canUseCustomValue.value) return;

  normalizedValue.value = customSearchValue.value;
  search.value = "";
}

function clearAll() {
  if (props.disabled) return;

  normalizedValue.value = props.multiple ? [] : "";
}
</script>

<style scoped>
/* Sin margin-bottom por defecto: el espaciado lo controla el padre (row gy-3, gap, etc.) */
.sf-wrap {
  margin-bottom: 0;
}

.dropdown.is-invalid {
  border: 1px solid #dc3545 !important;
}

.dropdown.is-disabled {
  opacity: 0.65;
  pointer-events: none;
}

.search-input {
  background-image: none !important;
  padding-right: 0.75rem !important;
  border-color: #ced4da !important;
  box-shadow: none !important;
}

.search-input:focus,
.search-input.is-valid,
.search-input:valid,
.search-input.is-valid:focus,
.search-input:valid:focus {
  background-image: none !important;
  border-color: #ced4da !important;
  padding-right: 0.75rem !important;
  box-shadow: none !important;
}

.custom-option {
  border-top: 1px solid rgba(88, 97, 103, 0.14);
  margin-top: 0.25rem;
  padding-top: 0.55rem;
}

:global(body.dark-layout) .custom-option {
  border-top-color: rgba(255, 255, 255, 0.12);
}
</style>
