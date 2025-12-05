<template>
  <div class="card-header ps-0">
    <h5> {{ props.isEditing ? 'Editar Persona' : 'Crear Persona' }}</h5>
  </div>
  <form class="row gx-3" @submit.prevent="sendForm">

    <CommonInputfieldsTextfield classes="col-md-6" v-model="form.first_name" label="Nombres" star="*"/>
    <CommonInputfieldsTextfield classes="col-md-6" v-model="form.last_name" label="Apellidos" star="*"/>

    <CommonInputfieldsSelectfield
        v-model="form.document_type_id"
        :data="lookups.documentTypes"
        label="Tipo de Documento"
        classes="col-md-6"
        :labelField="'alias'"
        star="*"
        concat
    />

    <CommonInputfieldsTextfield classes="col-md-6" v-model="form.document_number" label="Número" star="*"/>

    <CommonInputfieldsTextfield
        v-model="form.dv"
        classes="col-md-6 col-sm-6"
        label="Dígito de Verificación (DV)"
        readonly
    />

    <CommonInputfieldsTextfield classes="col-md-6" v-model="form.document_from" label="Lugar de Expedición"
                                star="*"/>

    <CommonInputfieldsSelectfield
        v-model="form.organization_type_id"
        :data="lookups.organizationTypes"
        label="Tipo de Organización"
        classes="col-md-6"
        :labelField="'name'"
        star="*"
    />

    <CommonInputfieldsTextfield
        classes="col-md-6"
        v-model="form.company_name"
        :required="false"
        label="Razón Social"/>

    <CommonInputfieldsTextfield
        classes="col-md-6"
        v-model="form.birth_date"
        label="Fecha de Nacimiento"
        type="date"
        star="*"
    />

    <CommonInputfieldsSelectfield
        v-model="form.gender_type_id"
        :data="lookups.genders"
        label="Género"
        classes="col-md-6"
        :labelField="'name'"
        star="*"
    />
  </form>
</template>
<script lang="ts" setup>
import type {ILookup} from "@/interfaces/ILookup";
import {calculateDV} from "@/composables/useDV";
import type {IPerson} from "~/interfaces/IPerson";

const props = defineProps<{
  data?: IPerson,
  lookups: {
    organizationTypes: ILookup[]
    documentTypes: ILookup[]
    genders: ILookup[]
  },
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'sendForm', person: Partial<IPerson>): void
  (e: 'reload'): void
}>()

const initialForm: Partial<IPerson> = {
  first_name: "",
  last_name: "",
  company_name: "",
  document_type_id: "",
  document_number: "",
  document_from: "",
  organization_type_id: "",
  birth_date: "",
  gender_type_id: "",
  dv: "0"
};

const form = ref({ ...initialForm })
const formOriginal = ref({ ...initialForm })


watch(() => form.value.document_number, (nuevoValor) => {
  form.value.dv = nuevoValor ? calculateDV(nuevoValor) : "";
});

watch(() => props.data, (newData) => {
  if (newData) {
    const modAttributes = {
      ...initialForm,
      ...newData,
      dv: newData.document_number ?? calculateDV(newData.document_number)
    };

    form.value = { ...modAttributes };
    formOriginal.value = { ...modAttributes };
  }
}, { immediate: true });

const sendForm = () => {
  emit('sendForm', form.value)
}

const reset = () => {
  form.value = { ...formOriginal.value }
}

defineExpose({
  sendForm,
  reset
});
</script>
<style scoped>
</style>


