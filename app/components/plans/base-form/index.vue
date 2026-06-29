<template>
  <div class="page-body">
    <CommonBreadcrumb
      :title="props.isEditing ? 'Editar Plan' : 'Crear Plan'"
      page="Planes SaaS"
    />
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body admin-form">
              <div class="card-header ps-0">
                <h5>{{ props.isEditing ? "Editar Plan" : "Crear Plan" }}</h5>
              </div>
              <form class="row gx-3" @submit.prevent="sendForm" novalidate>
                <CommonInputfieldsTextfield
                  label="Nombre del plan"
                  v-model="name"
                  :error="errors.name"
                  classes="col-md-6"
                  star="*"
                />

                <CommonInputfieldsNumberfield
                  label="Precio mensual (COP)"
                  v-model="price"
                  :error="errors.price"
                  classes="col-md-6"
                  star="*"
                />

                <CommonInputfieldsTextarea
                  label="Descripción"
                  v-model="description"
                  :error="errors.description"
                  classes="col-md-12"
                />

                <CommonInputfieldsNumberfield
                  label="Máx. usuarios"
                  v-model="max_users"
                  :error="errors.max_users"
                  classes="col-md-4"
                  star="*"
                />

                <CommonInputfieldsNumberfield
                  label="Máx. propiedades"
                  v-model="max_properties"
                  :error="errors.max_properties"
                  classes="col-md-4"
                  star="*"
                />

                <CommonInputfieldsNumberfield
                  label="Máx. imágenes por propiedad"
                  v-model="max_images_per_property"
                  :error="errors.max_images_per_property"
                  classes="col-md-4"
                  star="*"
                />

                <CommonInputfieldsCheckbox
                  label="Plan activo"
                  name="is_active"
                  v-model="is_active"
                  classes="col-md-6 mt-2"
                />

                <div class="form-btn mt-3">
                  <button
                    type="submit"
                    class="btn btn-pill btn-gradient color-4"
                  >
                    {{ props.isEditing ? "Actualizar" : "Crear" }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-pill btn-dashed color-4"
                    @click="navigateTo('/plans')"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlanService from "~/services/PlanService";
import type { IPlan } from "~/interfaces/IPlan";

const props = defineProps<{
  isEditing?: boolean;
}>();

const { run } = useApiHandler();
const route = useRoute();
const idPlan = route.params.id as string;

const errors = ref<Record<string, string>>({});
const name = ref("");
const description = ref<string | null>(null);
const price = ref<number>(0);
const max_users = ref<number>(3);
const max_properties = ref<number>(30);
const max_images_per_property = ref<number>(10);
const is_active = ref(true);

const sendForm = async () => {
  errors.value = {};

  const payload = {
    name: name.value,
    description: description.value,
    price: price.value,
    max_users: max_users.value,
    max_properties: max_properties.value,
    max_images_per_property: max_images_per_property.value,
    is_active: is_active.value,
  };

  const promise = props.isEditing
    ? PlanService.updatePlan(idPlan, payload)
    : PlanService.createPlan(payload);

  const response = await run(promise, {
    setErrors: (errs) => {
      errors.value = errs;
    },
    showSuccess: true,
    successMessage: props.isEditing
      ? "Plan actualizado correctamente"
      : "Plan creado correctamente",
  });

  if (response && !props.isEditing) {
    navigateTo("/plans");
  }
};

const loadPlan = async () => {
  if (!props.isEditing) return;

  const response = await run(PlanService.getPlan(idPlan));
  if (response) {
    const data = response.data as IPlan;
    name.value = data.name;
    description.value = data.description;
    price.value = Number(data.price);
    max_users.value = data.max_users;
    max_properties.value = data.max_properties;
    max_images_per_property.value = data.max_images_per_property;
    is_active.value = data.is_active;
  }
};

loadPlan();
</script>

<style scoped></style>
