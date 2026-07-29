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

    <!-- Sucursales -->
    <div class="col-12">
      <hr class="my-2" />
      <h6 class="mb-2 text-muted">Módulo de sucursales</h6>
    </div>
    <div class="col-12">
      <CommonInputfieldsCheckbox
        v-model="uses_branches"
        label="Habilitar sucursales"
        name="uses_branches"
      />
      <small class="text-muted d-block mt-1">
        Al activar, la empresa actual queda como sede principal y podrás
        crear sucursales independientes con sus propios datos, usuarios y registros.
      </small>
    </div>
    <div v-if="uses_branches" class="col-12">
      <div class="branch-hq-info d-flex align-items-center gap-2 py-2 px-3 mt-1">
        <Icon name="lucide:info" size="16" class="flex-shrink-0" />
        <span>
          Esta empresa es la <strong>sede principal</strong>. Gestiona las sucursales desde
          <strong>Empresa → Sucursales</strong>.
        </span>
      </div>
    </div>

    <div class="col-12 col-lg-6">
      <label class="form-label">Logo</label>
      <Gallery
        ref="galleryRef"
        add-item-classes="col-12 col-sm-6 col-md-6"
        :data="logoImages"
        item-classes="col"
        :maxImages="1"
        @updateImages="handleLogo"
        dimensions="320x90"
        :showCover="false"
      />
      <small v-if="errors.logo_image_id" class="text-danger">
        {{ errors.logo_image_id }}
      </small>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useCompanyForm } from "~/composables/forms/useCompanyForm";

import type { Gallery } from "#components";
import type { ICompany, ICompanyPersonRelation } from "~/interfaces/ICompany";
import type { IImage, IImagePayload } from "~/interfaces/IImageItem";

const props = defineProps<{
  data?: ICompany | null;
  isEditing?: boolean;
}>();

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

const galleryRef = ref<InstanceType<typeof Gallery> | null>(null);
const logoImages = ref<IImage[]>([]);

type CompanyPersonKey = "legal_representative" | "person_attendant";
type CompanyRelationFallbackKey =
  | "legal_representative_person"
  | "person_attendant_person"
  | "legal_representative_data"
  | "person_attendant_data";
type CompanyWithRelationFallbacks = ICompany &
  Partial<Record<CompanyRelationFallbackKey, ICompanyPersonRelation | null>>;

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

const uses_branches = ref<boolean>(false);

const getCompanyValues = (company?: ICompany | null) => ({
  company_name: company?.company_name ?? "",
  tradename: company?.tradename ?? "",
  nit: company?.nit ?? "",
  logo_image_id: company?.logo_image_id ?? "",
  legal_representative_id: getCompanyPersonId(company, "legal_representative"),
  person_attendant_id: getCompanyPersonId(company, "person_attendant"),
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
  if (company === undefined) return;

  resetForm({
    values: getCompanyValues(company),
  });

  uses_branches.value = company?.uses_branches ?? false;
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
      uses_branches: uses_branches.value,
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
.branch-hq-info {
  border-radius: 6px;
  font-size: 13px;
  background: rgba(var(--theme-color-rgb), 0.06);
  color: rgba(28, 45, 58, 0.8);
  border: 1px solid rgba(var(--theme-color-rgb), 0.18);
}

:global(body.dark-layout) .branch-hq-info {
  background: rgba(var(--theme-color-rgb), 0.1);
  color: rgba(255, 255, 255, 0.76);
  border-color: rgba(var(--theme-color-rgb), 0.25);
}
</style>
