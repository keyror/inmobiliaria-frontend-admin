<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
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

    <div v-if="areasList.length === 0" class="alert alert-info">
      No hay áreas registradas.
    </div>

    <div
        v-for="(area, index) in areasList"
        :key="index"
        class="card mb-3 border"
    >
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Área #{{ index + 1 }}</h6>
          <button
              type="button"
              class="btn btn-dashed color-4"
              @click="removeArea(index)"
              :disabled="areasList.length === 1"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">

          <CommonInputfieldsSelectfield
              v-model="area.area_type_id"
              classes="col-md-4"
              label="Tipo de Área"
              labelField="name"
              :data="lookups.areaTypes"
              star="*"
              :rules="areaSchema.area_type_id"
              :name="`area_type_id_${index}`"
          />

          <CommonInputfieldsTextfield
              v-model="area.area_value"
              :type="'number'"
              classes="col-md-4"
              label="Valor del Área"
              star="*"
              :rules="areaSchema.area_value"
              :name="`area_value_${index}`"
          />

          <CommonInputfieldsSelectfield
              v-model="area.area_unit_id"
              classes="col-md-4"
              label="Unidad"
              labelField="name"
              :data="lookups.areaUnits"
              star="*"
              :rules="areaSchema.area_unit_id"
              :name="`area_unit_id_${index}`"
          />

        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IArea } from "~/interfaces/IArea";
import type { ILookup } from "~/interfaces/ILookup";
import { useValidator } from "~/composables/useValidator";
import { areaSchema } from "~/utils/validations/area.schema";

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IArea[],
  lookups: {
    areaTypes: ILookup[],
    areaUnits: ILookup[]
  }
}>();

const emit = defineEmits<{
  (e: "sendForm", payload: IArea[]): void;
  (e: "formInvalid", payload: boolean): void;
}>();

const emptyArea: IArea = {
  area_type_id: null,
  area_value: null,
  area_unit_id: null
};

const areasList = ref<IArea[]>([{ ...emptyArea }]);
const areasListOriginal = ref<IArea[]>([{ ...emptyArea }]);

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    areasList.value = newData.map(a => ({ ...a }));
    areasListOriginal.value = newData.map(a => ({ ...a }));
  }
}, { immediate: true });

const addArea = () => {
  areasList.value.push({ ...emptyArea });
};

const removeArea = (index: number) => {
  if (areasList.value.length > 1) {
    areasList.value.splice(index, 1);
    resetErrors();
  }
};

const sendForm = () => {
  const isValid = validateForm(areasList.value, areaSchema, true);

  if (isValid) {
    emit("sendForm", areasList.value);
  } else {
    emit("formInvalid", true);
  }
};

const reset = () => {
  areasList.value = areasListOriginal.value.map(a => ({ ...a }));
  resetErrors();
};

defineExpose({
  sendForm,
  reset
});
</script>

<style scoped>

</style>
