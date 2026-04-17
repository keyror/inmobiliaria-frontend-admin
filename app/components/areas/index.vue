<template>
  <div>
    <div
      class="card-header ps-0 d-flex justify-content-between align-items-center"
    >
      <h5>Áreas</h5>
      <button
        type="button"
        class="btn btn-pill btn-gradient color-4"
        @click="addArea"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Área
      </button>
    </div>

    <div v-if="fields.length === 0" class="alert alert-info">
      No hay áreas registradas.
    </div>

    <div
      v-if="hasTriedSubmit && errors.areas"
      class="alert alert-danger p-2 small"
    >
      {{ errors.areas }}
    </div>

    <div
      v-for="(field, index) in fields"
      :key="field.key"
      class="card mb-3 border"
    >
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Área #{{ index + 1 }}</h6>

          <button
            type="button"
            class="btn btn-dashed color-4"
            :disabled="fields.length === 1"
            @click="removeArea(index)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">
          <CommonInputfieldsSelectfield
            v-model="field.value.area_type_id"
            classes="col-md-4"
            label="Tipo de Área"
            labelField="name"
            :data="lookups.areaTypes"
            star="*"
            :error="getFieldError(index, 'area_type_id')"
          />

          <CommonInputfieldsTextfield
            v-model="field.value.area_value"
            type="number"
            classes="col-md-4"
            label="Valor del Área"
            star="*"
            :error="getFieldError(index, 'area_value')"
          />

          <CommonInputfieldsSelectfield
            v-model="field.value.area_unit_id"
            classes="col-md-4"
            label="Unidad"
            labelField="name"
            :data="lookups.areaUnits"
            star="*"
            :error="getFieldError(index, 'area_unit_id')"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFieldArray } from "vee-validate";

import { useAreasForm } from "~/composables/forms/useAreasForm";

import type { IArea } from "~/interfaces/IArea";
import type { ILookup } from "~/interfaces/ILookup";

const props = defineProps<{
  data?: IArea[];
  lookups: {
    areaTypes: ILookup[];
    areaUnits: ILookup[];
  };
}>();

const { validate, values, resetForm, errors, setErrors } = useAreasForm();

const { remove, push, fields } = useFieldArray<IArea>("areas");

const hasTriedSubmit = ref(false);

const getFieldError = (index: number, field: string): string => {
  if (!hasTriedSubmit.value) return "";

  const errorsMap = errors.value as Record<string, string>;

  return (
    errorsMap[`areas[${index}].${field}`] ||
    errorsMap[`areas.${index}.${field}`] ||
    ""
  );
};

const addArea = () => {
  push({
    area_type_id: "",
    area_value: 0,
    area_unit_id: "",
  });
};

const removeArea = (index: number) => {
  if (fields.value.length > 1) {
    remove(index);
  }
};

watch(
  () => props.data,
  (newData?: IArea[]) => {
    hasTriedSubmit.value = false;

    if (newData && newData.length > 0) {
      resetForm({
        values: {
          areas: newData.map((a: IArea) => ({ ...a })),
        },
      });
    } else {
      resetForm({
        values: {
          areas: [
            {
              area_type_id: "",
              area_value: null,
              area_unit_id: "",
            },
          ],
        },
      });
    }
  },
  { immediate: true },
);

defineExpose({
  async validateForm(): Promise<boolean> {
    hasTriedSubmit.value = true;
    const result = await validate();
    return result.valid;
  },

  getValues(): IArea[] | undefined {
    return values.areas as IArea[];
  },

  reset(): void {
    hasTriedSubmit.value = false;
    resetForm();
  },

  setBackendErrors(backendErrors: Record<string, string>) {
    hasTriedSubmit.value = true;
    setErrors(backendErrors);
  },
});
</script>

<style scoped></style>
