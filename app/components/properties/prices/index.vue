<template>
  <div class="col-12 mt-3">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="mb-0">Precios</h6>
      <button
        v-if="showAddButton"
        type="button"
        class="btn btn-pill btn-gradient color-4"
        :disabled="isLimitReached"
        @click="addPrice"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Precio
      </button>
    </div>

    <div v-if="fields.length === 0" class="alert alert-info">
      No hay precios registrados.
    </div>

    <div
      v-for="(field, index) in fields"
      :key="field.key"
      class="card mb-3 border"
    >
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Precio #{{ index + 1 }}</h6>
          <button
            v-if="!lockedType"
            type="button"
            class="btn btn-dashed color-4"
            @click="remove(index)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <div class="row gx-3">
          <CommonInputfieldsSelectfield
            v-model="field.value.price_type_id"
            :data="priceTypes"
            :disabled="lockedType"
            classes="col-md-3"
            label="Tipo de Precio"
            labelField="name"
          />

          <CommonInputfieldsNumberfield
            v-model="field.value.price_min"
            classes="col-md-3"
            label="Precio Mínimo"
            star="*"
            :format="true"
            :error="getFieldError(index, 'price_min')"
          />

          <CommonInputfieldsNumberfield
            v-model="field.value.price_max"
            classes="col-md-3"
            label="Precio Máximo"
            star="*"
            :format="true"
            :error="getFieldError(index, 'price_max')"
          />

          <CommonInputfieldsNumberfield
            v-model="field.value.price"
            classes="col-md-3"
            label="Precio"
            star="*"
            :format="true"
            :error="getFieldError(index, 'price')"
          />

          <CommonInputfieldsTextfield
            v-model="field.value.currency"
            classes="col-md-3"
            label="Moneda"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFieldArray } from "vee-validate";

import type { ILookup } from "~/interfaces/ILookup";
import type { IPropertyPrice } from "~/interfaces/IPropertyPrice";

const props = withDefaults(
  defineProps<{
    priceTypes?: ILookup[];
    showAddButton?: boolean;
    lockedType?: boolean;
  }>(),
  {
    priceTypes: () => [],
    showAddButton: true,
    lockedType: false,
  },
);

const { fields, push, remove } = useFieldArray<IPropertyPrice>("prices");

const hasTriedSubmit = ref(false);

const isLimitReached = computed(
  () => fields.value.length >= props.priceTypes.length,
);

const addPrice = () => {
  push({
    id: null,
    price_type_id: null,
    price_min: "",
    price_max: "",
    price: null,
    currency: "COP",
  });
};

type RequiredPriceField = "price_min" | "price_max" | "price";
const REQUIRED_FIELDS: RequiredPriceField[] = ["price_min", "price_max", "price"];

const isEmpty = (value: unknown): boolean =>
  value === null || value === undefined || value === "";

const getFieldError = (index: number, field: RequiredPriceField): string => {
  if (!hasTriedSubmit.value) return "";
  return isEmpty(fields.value[index]?.value[field]) ? "Campo requerido" : "";
};

const validatePrices = (): boolean => {
  hasTriedSubmit.value = true;
  return fields.value.every((f) =>
    REQUIRED_FIELDS.every((key) => !isEmpty(f.value[key])),
  );
};

const resetValidation = (): void => {
  hasTriedSubmit.value = false;
};

defineExpose({ validatePrices, resetValidation });
</script>
