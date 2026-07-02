<template>
  <div class="row g-3">
    <CommonInputfieldsSelectfield
      v-model="textCaseMode"
      :data="TEXT_CASE_MODE_OPTIONS"
      label="Transformación de texto"
      name="text_case_mode"
      classes="col-md-6"
      show="Sin transformación"
    />

    <div class="col-12">
      <div class="alert alert-info d-flex align-items-center gap-2">
        <i class="fa fa-info-circle"></i>
        <span>
          Esta configuración transforma automáticamente el texto ingresado en
          los formularios (nombres, títulos, descripciones). No aplica a
          correos electrónicos, contraseñas.
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICompanySetting } from "~/interfaces/ICompanySetting";
import type { ILookup } from "~/interfaces/ILookup";

interface Props {
  data?: ICompanySetting | null;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  isEditing: false,
});

const NONE_SENTINEL = "none";

const TEXT_CASE_MODE_OPTIONS: ILookup[] = [
  { id: NONE_SENTINEL,  category: "", name: "Sin transformación",        alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "upper",        category: "", name: "MAYÚSCULAS",                alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "lower",        category: "", name: "minúsculas",                alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "capitalize",   category: "", name: "Primera Letra Mayúscula",   alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "sentence",     category: "", name: "Primera letra mayúscula",   alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
];

const textCaseMode = ref<string>(NONE_SENTINEL);

watch(
  () => props.data,
  (newData) => {
    textCaseMode.value = newData?.text_case_mode ?? NONE_SENTINEL;
  },
  { immediate: true },
);

function getValues(): ICompanySetting {
  return {
    text_case_mode: textCaseMode.value === NONE_SENTINEL ? null : textCaseMode.value,
  };
}

function validateForm(): boolean {
  return true;
}

function reset() {
  textCaseMode.value = props.data?.text_case_mode ?? NONE_SENTINEL;
}

defineExpose({ getValues, validateForm, reset });
</script>
