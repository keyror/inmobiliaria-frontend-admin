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

    <CommonInputfieldsSelectfield
      v-model="legal_representative_id"
      :data="persons"
      :error="errors.legal_representative_id"
      :onSearch="searchPerson"
      classes="col-md-4"
      label="Representante legal"
      labelField="name"
      searchable
      star="*"
    />

    <CommonInputfieldsSelectfield
      v-model="person_attendant_id"
      :data="persons"
      :error="errors.person_attendant_id"
      :onSearch="searchPerson"
      classes="col-md-4"
      label="Persona encargada"
      labelField="name"
      searchable
      star="*"
    />

    <div class="col-12">
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
import { useApiHandler } from "~/composables/useApiHandler";
import { useDebounce } from "~/composables/useDebounce";
import PersonService from "~/services/PersonService";

import type { Gallery } from "#components";
import type { ICompany } from "~/interfaces/ICompany";
import type { IImage, IImagePayload } from "~/interfaces/IImageItem";
import type { IParamsTable } from "~/interfaces/IParamsTable";

const { run } = useApiHandler();

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
const persons = ref<PersonOption[]>([]);

interface PersonOption {
  id: string;
  name: string;
  raw: any;
}

const paramsTable = ref<IParamsTable>({
  page: 1,
  perPage: 99999,
  sortBy: "created_at",
  sortType: "desc",
  search: "",
});

const personLabel = (person: any): string => {
  const name = person?.full_name ?? person?.company_name ?? "";
  const document = [
    person?.document_type_alias,
    person?.document_number,
  ].filter(Boolean);

  return document.length ? `${name} - ${document.join(" ")}` : name;
};

const toPersonOption = (person: any): PersonOption | null => {
  if (!person?.id) return null;

  return {
    id: person.id,
    name: personLabel(person),
    raw: person,
  };
};

const uniquePersonOptions = (options: PersonOption[]): PersonOption[] => {
  return options.filter(
    (person, index, self) =>
      index === self.findIndex((item) => item.id === person.id),
  );
};

const getCompanyRelationPerson = (
  company: any,
  key: "legal_representative" | "person_attendant",
) => {
  return (
    company?.[key] ??
    company?.[`${key}_person`] ??
    company?.[`${key}_data`] ??
    null
  );
};

const getCompanyPersonOptions = (company?: ICompany | null): PersonOption[] => {
  const relationOptions = [
    toPersonOption(getCompanyRelationPerson(company, "legal_representative")),
    toPersonOption(getCompanyRelationPerson(company, "person_attendant")),
  ].filter(Boolean) as PersonOption[];

  const selectedIds = [
    company?.legal_representative_id,
    company?.person_attendant_id,
  ].filter(Boolean);

  const existingOptions = persons.value.filter((person) =>
    selectedIds.includes(person.id),
  );

  return uniquePersonOptions([...relationOptions, ...existingOptions]);
};

const selectedPersonIds = computed(
  () =>
    new Set(
      [values.legal_representative_id, values.person_attendant_id].filter(
        Boolean,
      ),
    ),
);

const getCompanyPersonId = (
  company: any,
  key: "legal_representative" | "person_attendant",
) => {
  const idKey =
    key === "legal_representative"
      ? "legal_representative_id"
      : "person_attendant_id";

  return company?.[idKey] ?? getCompanyRelationPerson(company, key)?.id ?? "";
};

const getCompanyValues = (company?: ICompany | null) => ({
  company_name: company?.company_name ?? "",
  tradename: company?.tradename ?? "",
  nit: company?.nit ?? "",
  logo_image_id: company?.logo_image_id ?? "",
  legal_representative_id: getCompanyPersonId(
    company,
    "legal_representative",
  ),
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
  resetForm({
    values: getCompanyValues(company),
  });

  logoImages.value = getLogoImages(company);
  persons.value = getCompanyPersonOptions(company);
};

const handleLogo = (images: IImagePayload[]) => {
  const logo = images[0];
  setFieldValue("logo_image_id", logo?.id ?? "");
};

const hasPendingUpload = (): boolean => {
  return galleryRef.value?.hasPendingUploads?.() ?? false;
};

const debouncedSearch = useDebounce(async (term: string) => {
  paramsTable.value.search = term;

  const response = await run(PersonService.getPeople(paramsTable.value));
  if (!response) return;

  const newPersons = response.data.data.map((person: any) => ({
    id: person.id,
    name: personLabel(person),
    raw: person,
  }));

  const alreadySelected = persons.value.filter((person) =>
    selectedPersonIds.value.has(person.id),
  );

  persons.value = uniquePersonOptions([...alreadySelected, ...newPersons]);
}, 700);

const searchPerson = (term: string) => {
  if (!term || term.length < 3) return;
  debouncedSearch(term);
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

<style scoped></style>
