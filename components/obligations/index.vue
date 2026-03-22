<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Obligaciones</h5>
      <button
          type="button"
          class="btn btn-pill btn-gradient color-4"
          @click="addItem"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Obligación
      </button>
    </div>

    <div v-if="list.length === 0" class="alert alert-info">
      No hay obligaciones registradas.
    </div>

    <div v-for="(item, index) in list" :key="index" class="card mb-3 border">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Obligación #{{ index + 1 }}</h6>
          <button
              type="button"
              class="btn btn-dashed color-4"
              @click="removeItem(index)"
              :disabled="list.length === 1"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">
          <CommonInputfieldsSelectfield
              v-model="item.obligation_type_id"
              classes="col-md-4"
              label="Tipo de Obligación"
              :data="lookups.obligationTypes"
              labelField="name"
              star="*"
              :rules="obligationSchema.obligation_type_id"
              :name="`obligation_type_id_${index}`"
          />

          <CommonInputfieldsTextfield
              v-model="item.amount"
              classes="col-md-4"
              label="Monto"
              star="*"
              :rules="obligationSchema.amount"
              :name="`amount_${index}`"
          />

          <CommonInputfieldsTextfield
              v-model="item.total"
              classes="col-md-4"
              label="Total"
              star="*"
              :rules="obligationSchema.total"
              :name="`total_${index}`"
          />

          <CommonInputfieldsSelectfield
              v-model="item.frequency_type_id"
              classes="col-md-4"
              label="Frecuencia"
              :data="lookups.frequency"
              labelField="name"
              star="*"
              :rules="obligationSchema.frequency_type_id"
              :name="`frequency_type_id_${index}`"
          />

          <CommonInputfieldsTextfield
              v-model="item.expiration_date"
              classes="col-md-4"
              label="Fecha de Vencimiento"
              type="date"
              :name="`expiration_${index}`"
          />

          <CommonInputfieldsSelectfield
              v-model="item.status_id"
              classes="col-md-4"
              label="Activa"
              :data="lookups.status"
              labelField="name"
              star="*"
              :rules="obligationSchema.status_id"
              :name="`status_id_${index}`"
          />

          <CommonInputfieldsTextarea
              v-model="item.description"
              classes="col-md-12"
              label="Descripción"
              :name="`description_${index}`"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPropertyObligation } from "~/interfaces/IPropertyObligation";
import { useValidator } from "~/composables/useValidator";
import { obligationSchema } from "~/utils/validations/obligation.schema";

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IPropertyObligation[];
  lookups: {
    obligationTypes: any[];
    frequency: any[];
    status: any[];
  };
}>();

const emit = defineEmits<{
  (e: "sendForm", payload: IPropertyObligation[]): void;
  (e: "formInvalid", payload: boolean): void;
}>();

const emptyItem: IPropertyObligation = {
  obligation_type_id: "",
  amount: "",
  total: "",
  frequency_type_id: "",
  expiration_date: "",
  status_id: "",
  description: "",
};

const list = ref<IPropertyObligation[]>([{ ...emptyItem }]);
const original = ref<IPropertyObligation[]>([{ ...emptyItem }]);

watch(() => props.data, (val) => {
  if (val && val.length > 0) {
    list.value = val.map(i => ({ ...i }));
    original.value = val.map(i => ({ ...i }));
  }
}, { immediate: true });

const addItem = () => list.value.push({ ...emptyItem });

const removeItem = (index: number) => {
  if (list.value.length > 1) {
    list.value.splice(index, 1);
    resetErrors();
  }
};

const sendForm = () => {
  const valid = validateForm(list.value, obligationSchema, true);
  valid ? emit("sendForm", list.value) : emit("formInvalid", true);
};

const reset = () => {
  list.value = original.value.map(i => ({ ...i }));
  resetErrors();
};

defineExpose({ sendForm, reset });
</script>
