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

                <CommonInputfieldsSelectfield
                  label="Tipo de plan"
                  v-model="frequency_type_id"
                  :data="frequencyOptions"
                  labelField="name"
                  :error="errors.frequency_type_id"
                  classes="col-md-3"
                />

                <CommonInputfieldsSelectfield
                  v-if="isAnnual"
                  label="Descuento anual (%)"
                  v-model="discount"
                  :data="discountOptions"
                  labelField="label"
                  :error="errors.discount"
                  classes="col-md-3"
                />

                <div v-else class="col-md-3" />

                <CommonInputfieldsNumberfield
                  label="Precio (COP)"
                  v-model="price"
                  :error="errors.price"
                  :format="true"
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
                    @click="resetForm()"
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
import { Constants } from "~/constants/Constants";
import { usePlanForms } from "~/composables/forms/usePlanForm";
import type { IPlan } from "~/interfaces/IPlan";

const props = defineProps<{
  isEditing?: boolean;
}>();

const { run } = useApiHandler();
const route = useRoute();
const idPlan = route.params.id as string;

const { usePlanCreateForm, usePlanUpdateForm } = usePlanForms();
const form = props.isEditing ? usePlanUpdateForm() : usePlanCreateForm();
const { handleSubmit, errors, defineField, resetForm, setErrors } = form;

const [name] = defineField("name");
const [description] = defineField("description");
const [price] = defineField("price");
const [frequency_type_id] = defineField("frequency_type_id");
const [discount] = defineField("discount");
const [max_users] = defineField("max_users");
const [max_properties] = defineField("max_properties");
const [max_images_per_property] = defineField("max_images_per_property");
const [is_active] = defineField("is_active");

const { lookups } = useLookups([Constants.FREQUENCY]);

const frequencyOptions = computed(() =>
  (lookups.value[Constants.FREQUENCY] ?? []).filter(
    (f: any) => f.alias === "MENSUAL" || f.alias === "ANUAL",
  ),
);

const discountOptions = computed(() =>
  Array.from({ length: 101 }, (_, i) => ({ id: i, label: `${i}%` })),
);

const isAnnual = computed(() => {
  const selected = frequencyOptions.value.find(
    (f: any) => f.id === frequency_type_id.value,
  );
  return selected?.alias === "ANUAL";
});

watch(isAnnual, (annual) => {
  if (!annual) discount.value = null;
});

const sendForm = handleSubmit(async (values) => {
  const payload = {
    ...values,
    discount: isAnnual.value ? values.discount : null,
  };

  const promise = props.isEditing
    ? PlanService.updatePlan(idPlan, payload)
    : PlanService.createPlan(payload);

  const response = await run(promise, {
    setErrors,
    showSuccess: true,
    successMessage: props.isEditing
      ? "Plan actualizado correctamente"
      : "Plan creado correctamente",
  });

  if (response) {
    props.isEditing ? await loadPlan() : resetForm();
  }
});

const loadPlan = async () => {
  if (!props.isEditing) return;

  const response = await run(PlanService.getPlan(idPlan));
  if (response) {
    const data = response.data as IPlan;
    resetForm({
      values: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        frequency_type_id: data.frequency_type_id ?? null,
        discount: data.discount ?? null,
        max_users: data.max_users,
        max_properties: data.max_properties,
        max_images_per_property: data.max_images_per_property,
        is_active: data.is_active,
      },
    });
  }
};

loadPlan();
</script>

<style scoped></style>
