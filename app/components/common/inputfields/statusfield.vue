<template>
  <div class="form-group" :class="classes">
    <label>
      {{ label }}
      <span class="font-danger" v-if="star">{{ star }}</span>
    </label>

    <!--  SELECT TIPO INPUT -->
    <div class="dropdown w-100">
      <div
        class="form-control d-flex justify-content-between align-items-center"
        :class="{ 'is-invalid': error }"
        data-bs-toggle="dropdown"
        style="cursor: pointer"
      >
        <span>{{ selectedstatus || show }}</span>
        <i class="fas fa-angle-down"></i>
      </div>

      <!--  opciones -->
      <div class="dropdown-menu w-100 text-start">
        <a
          href="javascript:void(0)"
          class="dropdown-item"
          v-for="(item, index) in data"
          :key="index"
          @click="getsatus(item)"
        >
          {{ item }}
        </a>
      </div>
    </div>

    <!--  error -->
    <small v-if="error" class="text-danger">
      {{ error }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  classes: String,
  label: String,
  data: Array as () => string[],
  show: String,
  star: String,
  modelValue: String,
  error: String,
});

const emit = defineEmits(["update:modelValue"]);

const selectedstatus = ref<string | undefined>(props.modelValue || "");

watch(
  () => props.modelValue,
  (newVal) => {
    selectedstatus.value = newVal;
  },
);

function getsatus(status: string) {
  selectedstatus.value = status;
  emit("update:modelValue", status);
}
</script>

<style scoped>
/* mejora visual para que sea igual al input */
.form-control {
  min-height: 38px;
}

/* opcional: hover tipo select */
.form-control:hover {
  background-color: #f8f9fa;
}

.dropdown.is-invalid {
  border: 1px solid #dc3545 !important;
}
</style>
