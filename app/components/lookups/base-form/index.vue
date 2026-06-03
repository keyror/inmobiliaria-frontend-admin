<template>
  <div class="page-body">
    <CommonBreadcrumb
      :title="props.isEditing ? 'Editar' : 'Crear'"
      page="Administrar lookups"
    />

    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <h5>{{ props.isEditing ? "Editar lookup" : "Crear lookup" }}</h5>
            </div>

            <div class="card-body admin-form">
              <form
                autocomplete="off"
                class="row gx-3"
                novalidate
                @submit.prevent="sendForm"
              >
                <CommonInputfieldsSelectfield
                  v-model="category"
                  allow-custom
                  :data="categorySelectOptions"
                  :error="errors.category"
                  classes="col-md-6 col-sm-6"
                  label="Categoría"
                  name="category"
                  searchable
                  show="Selecciona o escribe una categoría"
                  star="*"
                />

                <CommonInputfieldsTextfield
                  v-model="name"
                  :error="errors.name"
                  classes="col-md-6 col-sm-6"
                  label="Nombre"
                  name="name"
                  placeholder="Ej: Apartamento"
                  star="*"
                />

                <CommonInputfieldsTextfield
                  v-model="alias"
                  :error="errors.alias"
                  :required="false"
                  classes="col-md-4 col-sm-6"
                  label="Alias"
                  name="alias"
                  placeholder="Ej: APARTMENT"
                />

                <CommonInputfieldsTextfield
                  v-model="code"
                  :error="errors.code"
                  :required="false"
                  classes="col-md-4 col-sm-6"
                  label="Código"
                  name="code"
                  placeholder="Ej: APT"
                />

                <CommonInputfieldsNumberfield
                  v-model="value"
                  :error="errors.value"
                  :required="false"
                  :step="0.01"
                  classes="col-md-4 col-sm-6"
                  label="Valor"
                  name="value"
                  placeholder="Valor numérico"
                />

                <CommonInputfieldsTextfield
                  v-model="lang"
                  :error="errors.lang"
                  :required="false"
                  classes="col-md-4 col-sm-6"
                  label="Idioma"
                  name="lang"
                  placeholder="ES"
                />

                <CommonInputfieldsTextfield
                  v-model="icon"
                  :error="errors.icon"
                  :required="false"
                  classes="col-md-4 col-sm-6"
                  label="Ícono"
                  name="icon"
                  placeholder="Ej: mdi-home"
                />

                <CommonInputfieldsCheckbox
                  v-model="is_active"
                  :error="errors.is_active"
                  classes="col-md-4 col-sm-6 d-flex align-items-end pb-2"
                  label="Activo"
                  name="is_active"
                />

                <div class="form-btn mt-3">
                  <button
                    class="btn btn-pill btn-gradient color-4"
                    type="submit"
                  >
                    {{ props.isEditing ? "Actualizar" : "Crear" }}
                  </button>

                  <button
                    class="btn btn-pill btn-dashed color-4"
                    type="button"
                    @click="cancel"
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
import {
  getLookupInitialValues,
  useLookupForm,
} from "~/composables/forms/useLookupForm";
import { useApiHandler } from "~/composables/useApiHandler";
import LookupAdminService from "~/services/LookupAdminService";

import type { ILookup } from "~/interfaces/ILookup";
import type { LookupPayload } from "~/interfaces/ILookupAdmin";

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const lookupId = computed(() => String(route.params.id ?? ""));
const { run } = useApiHandler();

const form = useLookupForm();
const { handleSubmit, errors, defineField, resetForm, setErrors } = form;

const [category] = defineField("category");
const [name] = defineField("name");
const [alias] = defineField("alias");
const [value] = defineField("value");
const [code] = defineField("code");
const [is_active] = defineField("is_active");
const [lang] = defineField("lang");
const [icon] = defineField("icon");
const categoryOptions = ref<ILookup[]>([]);

const createCategoryOption = (categoryName: string): ILookup => ({
  id: categoryName,
  category: "lookup_category",
  name: categoryName,
  alias: null,
  value: null,
  code: null,
  icon: null,
  is_active: true,
  lang: "ES",
});

const syncCategoryOptions = (categoryNames: string[]) => {
  const categories = Array.from(
    new Set(categoryNames.map((item) => item.trim()).filter(Boolean)),
  ).sort((first, second) => first.localeCompare(second));

  categoryOptions.value = categories.map(createCategoryOption);
};

const categorySelectOptions = computed(() => {
  const currentCategory =
    typeof category.value === "string" ? category.value.trim() : "";

  if (
    !currentCategory ||
    categoryOptions.value.some((item) => item.id === currentCategory)
  ) {
    return categoryOptions.value;
  }

  return [createCategoryOption(currentCategory), ...categoryOptions.value];
});

const loadCategoryOptions = async () => {
  const response = await run(LookupAdminService.getCategories());

  if (!response) return;

  syncCategoryOptions(response.data ?? []);
};

const toPayload = (values: LookupPayload): LookupPayload => ({
  category: values.category,
  name: values.name,
  alias: values.alias || null,
  value: values.value ?? null,
  code: values.code || null,
  is_active: values.is_active ?? true,
  lang: values.lang || "ES",
  icon: values.icon || null,
});

const sendForm = handleSubmit(async (values) => {
  const payload = toPayload(values);
  const promise = props.isEditing
    ? LookupAdminService.update(lookupId.value, payload)
    : LookupAdminService.store(payload);

  const response = await run(promise, {
    setErrors,
    showSuccess: true,
    successMessage: props.isEditing
      ? "Lookup actualizado correctamente"
      : "Lookup creado correctamente",
  });

  if (!response) return;

  syncCategoryOptions([
    ...categoryOptions.value.map((item) => item.id),
    payload.category,
  ]);

  if (props.isEditing) {
    await getLookup();
    return;
  }

  resetForm({
    values: getLookupInitialValues(),
  });
});

const getLookup = async () => {
  if (!props.isEditing || !lookupId.value) return;

  const response = await run(LookupAdminService.show(lookupId.value), {
    setErrors,
  });

  if (!response) return;

  resetForm({
    values: getLookupInitialValues(response.data),
  });
};

const cancel = () => {
  if (props.isEditing) {
    navigateTo("/lookups/all");
    return;
  }

  resetForm({
    values: getLookupInitialValues(),
  });
};

loadCategoryOptions();
getLookup();
</script>

<style scoped></style>
