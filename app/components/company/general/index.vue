<template>
  <div class="card-header ps-0">
    <h5>{{ props.isEditing ? "Editar Empresa" : "Crear Empresa" }}</h5>
  </div>

  <form class="row gx-3">
    <CommonInputfieldsTextfield
      v-model="company_name"
      :error="errors.company_name"
      classes="col-md-6"
      label="Razón social"
      star="*"
    />

    <CommonInputfieldsTextfield
      v-model="tradename"
      :error="errors.tradename"
      classes="col-md-6"
      label="Nombre comercial"
      star="*"
    />

    <CommonInputfieldsTextfield
      v-model="nit"
      :error="errors.nit"
      classes="col-md-4"
      label="NIT"
      star="*"
    />

    <CommonInputfieldsPersonselect
      v-model="legal_representative_id"
      :error="errors.legal_representative_id"
      :initialPeople="initialPeople"
      classes="col-md-4"
      label="Representante legal"
      star="*"
    />

    <CommonInputfieldsPersonselect
      v-model="person_attendant_id"
      :error="errors.person_attendant_id"
      :initialPeople="initialPeople"
      classes="col-md-4"
      label="Persona encargada"
      star="*"
    />

    <div
      class="form-group col-md-3"
      :class="{ 'was-validated': primaryColorError }"
    >
      <label for="company-theme-primary" class="form-label"
        >Color primario</label
      >
      <div class="theme-color-field">
        <input
          id="company-theme-primary"
          v-model="theme_primary"
          class="form-control form-control-color theme-color-input"
          :class="{ 'is-invalid': primaryColorError }"
          type="color"
          name="theme.colors.primary"
        />
        <span class="theme-color-value">{{ theme_primary }}</span>
      </div>
      <small v-if="primaryColorError" class="text-danger">
        {{ primaryColorError }}
      </small>
    </div>

    <div
      class="form-group col-md-3"
      :class="{ 'was-validated': secondaryColorError }"
    >
      <label for="company-theme-secondary" class="form-label"
        >Color secundario</label
      >
      <div class="theme-color-field">
        <input
          id="company-theme-secondary"
          v-model="theme_secondary"
          class="form-control form-control-color theme-color-input"
          :class="{ 'is-invalid': secondaryColorError }"
          type="color"
          name="theme.colors.secondary"
        />
        <span class="theme-color-value">{{ theme_secondary }}</span>
      </div>
      <small v-if="secondaryColorError" class="text-danger">
        {{ secondaryColorError }}
      </small>
    </div>

    <div class="col-6">
      <label class="form-label">Logo</label>
      <Gallery
        ref="galleryRef"
        :data="logoImages"
        :maxImages="1"
        @updateImages="handleLogo"
      />
      <small v-if="errors.logo_image_id" class="text-danger">
        {{ errors.logo_image_id }}
      </small>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useCompanyForm } from "~/composables/forms/useCompanyForm";
import { DEFAULT_COMPANY_THEME_COLORS } from "~/constants/CompanyTheme";
import { usecustomizerStore } from "~/store/costomizer";

import type { Gallery } from "#components";
import type { ICompany, ICompanyPersonRelation } from "~/interfaces/ICompany";
import type { IImage, IImagePayload } from "~/interfaces/IImageItem";

const props = defineProps<{
  data?: ICompany | null;
  isEditing?: boolean;
}>();

const customizerStore = usecustomizerStore();
const form = useCompanyForm(props.data);
const {
  defineField,
  validate,
  values,
  resetForm,
  errors,
  setErrors,
  setFieldValue,
} = form;

const [company_name] = defineField("company_name");
const [tradename] = defineField("tradename");
const [nit] = defineField("nit");
const [legal_representative_id] = defineField("legal_representative_id");
const [person_attendant_id] = defineField("person_attendant_id");
const [theme_primary] = defineField("theme.colors.primary");
const [theme_secondary] = defineField("theme.colors.secondary");

const galleryRef = ref<InstanceType<typeof Gallery> | null>(null);
const logoImages = ref<IImage[]>([]);

const getFormError = (field: string): string | undefined => {
  return (errors.value as Record<string, string | undefined>)[field];
};

const primaryColorError = computed(() => getFormError("theme.colors.primary"));
const secondaryColorError = computed(() =>
  getFormError("theme.colors.secondary"),
);

type CompanyPersonKey = "legal_representative" | "person_attendant";
type CompanyRelationFallbackKey =
  | "legal_representative_person"
  | "person_attendant_person"
  | "legal_representative_data"
  | "person_attendant_data";
type CompanyWithRelationFallbacks = ICompany &
  Partial<Record<CompanyRelationFallbackKey, ICompanyPersonRelation | null>>;

const isHexThemeColor = (color?: string | null): color is string => {
  return /^#[0-9A-Fa-f]{6}$/.test(color ?? "");
};

const normalizeThemeColors = (
  primary?: string | null,
  secondary?: string | null,
) => ({
  primary: isHexThemeColor(primary)
    ? primary
    : DEFAULT_COMPANY_THEME_COLORS.primary,
  secondary: isHexThemeColor(secondary)
    ? secondary
    : DEFAULT_COMPANY_THEME_COLORS.secondary,
});

const applyThemePreview = (
  primary?: string | null,
  secondary?: string | null,
) => {
  if (!import.meta.client) return;

  customizerStore.setcolor(normalizeThemeColors(primary, secondary));
};

const getCompanyRelationPerson = (
  company: CompanyWithRelationFallbacks | null | undefined,
  key: CompanyPersonKey,
): ICompanyPersonRelation | null => {
  return (
    company?.[key] ??
    company?.[`${key}_person`] ??
    company?.[`${key}_data`] ??
    null
  );
};

const initialPeople = computed(() =>
  [
    getCompanyRelationPerson(props.data, "legal_representative"),
    getCompanyRelationPerson(props.data, "person_attendant"),
  ].filter(Boolean),
);

const getCompanyPersonId = (
  company: CompanyWithRelationFallbacks | null | undefined,
  key: CompanyPersonKey,
): string => {
  const idKey =
    key === "legal_representative"
      ? "legal_representative_id"
      : "person_attendant_id";

  return company?.[idKey] ?? getCompanyRelationPerson(company, key)?.id ?? "";
};

const getCompanyThemeColors = (company?: ICompany | null) =>
  normalizeThemeColors(
    company?.theme?.colors?.primary,
    company?.theme?.colors?.secondary,
  );

const getCompanyValues = (company?: ICompany | null) => ({
  company_name: company?.company_name ?? "",
  tradename: company?.tradename ?? "",
  nit: company?.nit ?? "",
  logo_image_id: company?.logo_image_id ?? "",
  legal_representative_id: getCompanyPersonId(company, "legal_representative"),
  person_attendant_id: getCompanyPersonId(company, "person_attendant"),
  theme: {
    colors: getCompanyThemeColors(company),
  },
});

const getLogoImages = (company?: ICompany | null): IImage[] => {
  if (!company?.logo?.url || !(company.logo.id || company.logo_image_id)) {
    return [];
  }

  return [
    {
      ...company.logo,
      id: company.logo.id ?? company.logo_image_id,
      is_cover: true,
    },
  ];
};

const resetToCompany = (company?: ICompany | null) => {
  resetForm({
    values: getCompanyValues(company),
  });

  logoImages.value = getLogoImages(company);
};

const handleLogo = (images: IImagePayload[]) => {
  const logo = images[0];
  setFieldValue("logo_image_id", logo?.id ?? "");
};

const hasPendingUpload = (): boolean => {
  return galleryRef.value?.hasPendingUploads?.() ?? false;
};

watch(
  () => props.data,
  (newData) => {
    resetToCompany(newData);
  },
  { immediate: true },
);

watch(
  [theme_primary, theme_secondary],
  ([primary, secondary]) => {
    applyThemePreview(primary, secondary);
  },
  { immediate: true },
);

defineExpose({
  async validateForm() {
    if (hasPendingUpload()) return false;

    const result = await validate();
    return result.valid;
  },
  getValues(): Partial<ICompany> {
    return {
      company_name: values.company_name,
      tradename: values.tradename,
      nit: values.nit,
      logo_image_id: values.logo_image_id,
      legal_representative_id: values.legal_representative_id,
      person_attendant_id: values.person_attendant_id,
      theme: {
        colors: normalizeThemeColors(
          values.theme?.colors?.primary,
          values.theme?.colors?.secondary,
        ),
      },
    };
  },
  reset() {
    resetToCompany(props.data);
  },
  setBackendErrors(backendErrors: Record<string, string>) {
    setErrors(backendErrors);
  },
});
</script>

<style scoped>
.theme-color-field {
  align-items: center;
  display: flex;
  gap: 0.75rem;
}

.theme-color-input {
  height: 42px;
  padding: 0.25rem;
  width: 72px;
}

.theme-color-value {
  color: #6c757d;
  font-family: monospace;
}
</style>
