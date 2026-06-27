<template>
  <div class="card-header ps-0">
    <h5>{{ props.isEditing ? "Editar Propiedad" : "Crear Propiedad" }}</h5>
  </div>

  <form class="row gx-3">
    <!-- Título -->
    <CommonInputfieldsTextfield
      v-model="title"
      :error="errors.title"
      classes="col-md-6"
      label="Título"
      star="*"
    />

    <!-- Código -->
    <CommonInputfieldsTextfield
      v-model="code"
      :error="errors.code"
      classes="col-md-3"
      label="Código"
    />

    <!-- Número Catastral -->
    <CommonInputfieldsTextfield
      v-model="cadastral_number"
      :error="errors.cadastral_number"
      classes="col-md-3"
      label="Número Catastral"
    />

    <!-- Estado Actual -->
    <CommonInputfieldsSelectfield
      v-model="status_property_id"
      :data="lookups.statusType"
      :error="errors.status_property_id"
      classes="col-md-3"
      label="Estado Actual"
      labelField="name"
      star="*"
    />

    <!-- Estado -->
    <CommonInputfieldsSelectfield
      v-model="status_id"
      :data="lookups.status"
      :error="errors.status_id"
      classes="col-md-3"
      label="Estado"
      labelField="name"
      star="*"
    />

    <!-- Tipo Oferta -->
    <CommonInputfieldsSelectfield
      v-model="offer_type_id"
      :data="lookups.offerType"
      :error="errors.offer_type_id"
      classes="col-md-3"
      label="Tipo de Oferta"
      labelField="name"
      star="*"
    />

    <!-- Tipo Propiedad -->
    <CommonInputfieldsSelectfield
      v-model="property_type_id"
      :data="lookups.propertyTypes"
      :error="errors.property_type_id"
      classes="col-md-3"
      label="Tipo de Propiedad"
      labelField="name"
      star="*"
    />

    <!-- Estrato -->
    <CommonInputfieldsTextfield
      v-model="social_strata"
      :error="errors.social_strata"
      classes="col-md-3"
      label="Estrato"
      star="*"
    />

    <!-- Año -->
    <div class="col-md-3">
      <label>Año de Construcción <span class="font-danger">*</span></label>
      <VueDatePicker
        v-model="year_built"
        year-picker
        format="yyyy"
        :model-type="'yyyy'"
        :class="{ 'is-invalid': errors.year_built }"
        :state="errors.year_built ? false : null"
      />
      <small class="text-danger" v-if="errors.year_built">
        {{ errors.year_built }}
      </small>
    </div>

    <!-- Habitaciones -->
    <CommonInputfieldsTextfield
      v-model="rooms"
      :error="errors.rooms"
      classes="col-md-3"
      label="Habitaciones"
    />

    <!-- Dormitorios -->
    <CommonInputfieldsTextfield
      v-model="bedrooms"
      :error="errors.bedrooms"
      classes="col-md-3"
      label="Dormitorios"
    />

    <!-- Baños -->
    <CommonInputfieldsTextfield
      v-model="bathrooms"
      :error="errors.bathrooms"
      classes="col-md-3"
      label="Baños"
    />

    <!-- Garaje -->
    <CommonInputfieldsSelectfield
      v-model="garage_type_id"
      :data="lookups.garageTypes"
      :error="errors.garage_type_id"
      classes="col-md-3"
      label="Tipo de Garaje"
      labelField="name"
    />

    <!-- Cupos -->
    <CommonInputfieldsTextfield
      v-model="garage_spots"
      :error="errors.garage_spots"
      classes="col-md-3"
      label="Cupos de Garaje"
    />

    <!-- Precios -->
    <div class="col-12 mt-3 mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">Precios</h6>
        <button
          v-if="offer_type_id"
          type="button"
          class="btn btn-pill btn-dashed color-4"
          @click="showPricesModal = true"
        >
          <i class="bi bi-pencil me-1"></i>
          Editar precios
        </button>
      </div>

      <div v-if="!offer_type_id" class="alert alert-warning mb-0">
        Seleccione un tipo de oferta para configurar los precios.
      </div>
      <div v-else-if="values.prices?.length" class="d-flex flex-wrap gap-2">
        <span
          v-for="price in values.prices"
          :key="String(price.price_type_id)"
          class="badge bg-light text-dark border p-2 fs-6"
        >
          <span class="fw-semibold"
            >{{ getPriceTypeName(price.price_type_id) }}:</span
          >
          {{ price.price ? formatCOP(price.price) : 'Sin valor' }}
        </span>
      </div>
      <div v-else class="alert alert-info mb-0">
        Sin precios configurados.
        <button
          type="button"
          class="btn btn-sm btn-link p-0 ms-2"
          @click="showPricesModal = true"
        >Configurar ahora</button>
      </div>
    </div>

    <CommonModal
      v-model:show="showPricesModal"
      title="Configurar Precios"
      size="xl"
      @close="onPricesModalClose"
    >
      <form class="admin-form" @submit.prevent>
        <PropertiesPrices
          ref="pricesRef"
          :price-types="filteredPriceTypes"
          :show-add-button="false"
          :locked-type="true"
        />
      </form>
      <template #actions>
        <button
          type="button"
          class="btn btn-pill btn-gradient color-4"
          @click="savePricesModal"
        >
          Guardar
        </button>
      </template>
    </CommonModal>

    <!-- Descripción -->
    <CommonInputfieldsTextarea
      v-model="description"
      :error="errors.description"
      classes="col-md-12"
      label="Descripción"
    />

    <!-- Features -->
    <CommonInputfieldsSelectfield
      v-model="features"
      :data="lookups.features"
      :error="errors.features"
      classes="col-md-12"
      label="Características"
      labelField="name"
      multiple
      searchable
    />

    <!-- Maps -->
    <CommonInputfieldsTextfield
      v-model="url_google_map"
      :error="errors.url_google_map"
      classes="col-md-6"
      label="URL Google Maps"
    />

    <CommonInputfieldsTextfield
      v-model="latitude"
      :error="errors.latitude"
      classes="col-md-3"
      label="Latitud"
    />

    <CommonInputfieldsTextfield
      v-model="longitude"
      :error="errors.longitude"
      classes="col-md-3"
      label="Longitud"
    />

    <!-- GALERÍA -->
    <Gallery
      ref="galleryRef"
      :data="values.images ?? []"
      item-classes="col-sm-12 col-md-4 col-lg-2"
      @updateImages="handleImages"
    />
  </form>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

import { usePropertyForm } from "~/composables/forms/usePropertyForm";

import type { Gallery } from "#components";
import type { IImagePayload } from "~/interfaces/IImageItem";
import type { ILookup } from "~/interfaces/ILookup";
import type { IProperty } from "~/interfaces/IProperty";
import type { IPropertyPrice } from "~/interfaces/IPropertyPrice";

interface PropertyFeatureFormValue {
  feature_type_id: string;
}

const props = defineProps<{
  data?: IProperty;
  lookups: {
    garageTypes: ILookup[];
    propertyTypes: ILookup[];
    statusType: ILookup[];
    offerType: ILookup[];
    priceTypes: ILookup[];
    features: ILookup[];
    status: ILookup[];
  };
  isEditing?: boolean;
}>();

const form = usePropertyForm(props.data);

const {
  defineField,
  validate,
  values,
  resetForm,
  errors,
  setErrors,
  setFieldValue,
} = form;

// fields
const [title] = defineField("title");
const [code] = defineField("code");
const [cadastral_number] = defineField("cadastral_number");
const [status_property_id] = defineField("status_property_id");
const [status_id] = defineField("status_id");
const [offer_type_id] = defineField("offer_type_id");
const [property_type_id] = defineField("property_type_id");
const [social_strata] = defineField("social_strata");
const [year_built] = defineField("year_built");
const [rooms] = defineField("rooms");
const [bedrooms] = defineField("bedrooms");
const [bathrooms] = defineField("bathrooms");
const [garage_type_id] = defineField("garage_type_id");
const [garage_spots] = defineField("garage_spots");
const [description] = defineField("description");
const [features] = defineField("features");
const [url_google_map] = defineField("url_google_map");
const [latitude] = defineField("latitude");
const [longitude] = defineField("longitude");

// sincronización oferta ↔ precio (dirigida por offer_type.code en el lookup)
const isResettingForm = ref(false);
const showPricesModal = ref(false);

const selectedOfferType = computed(
  () => props.lookups.offerType?.find((o) => o.id === offer_type_id.value) ?? null,
);

const allowedPriceAliases = computed((): string[] => {
  const code = selectedOfferType.value?.code;
  if (!code) return [];
  return code.split(",").map((s) => s.trim());
});

const filteredPriceTypes = computed(() =>
  (props.lookups.priceTypes ?? []).filter((pt) =>
    allowedPriceAliases.value.includes(pt.alias ?? ""),
  ),
);

const prePopulatePrices = (): IPropertyPrice[] =>
  allowedPriceAliases.value
    .map((alias) => {
      const priceType = props.lookups.priceTypes.find((pt) => pt.alias === alias);
      if (!priceType) return null;
      return { id: null, price_type_id: priceType.id, price_min: "", price_max: "", price: null, currency: "COP" };
    })
    .filter((p): p is IPropertyPrice => p !== null);

const getPriceTypeName = (priceTypeId: string | null): string =>
  props.lookups.priceTypes.find((pt) => pt.id === priceTypeId)?.name ?? "";

const copFormatter = new Intl.NumberFormat("es-CO");
const formatCOP = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "";
  return copFormatter.format(Number(value));
};

type PricesComponentRef = { validatePrices: () => boolean; resetValidation: () => void };
const pricesRef = ref<PricesComponentRef | null>(null);

const isNewOfferTypeSelection = ref(false);

watch(offer_type_id, (newVal, oldVal) => {
  if (isResettingForm.value || !newVal || oldVal === newVal) return;
  setFieldValue("prices", prePopulatePrices());
  isNewOfferTypeSelection.value = true;
  pricesRef.value?.resetValidation();
  showPricesModal.value = true;
});

const savePricesModal = () => {
  if (!pricesRef.value?.validatePrices()) return;
  isNewOfferTypeSelection.value = false;
  showPricesModal.value = false;
};

const onPricesModalClose = () => {
  if (!isNewOfferTypeSelection.value) return;
  isResettingForm.value = true;
  setFieldValue("offer_type_id", null);
  setFieldValue("prices", []);
  nextTick(() => {
    isResettingForm.value = false;
  });
  isNewOfferTypeSelection.value = false;
};

// gallery
const galleryRef = ref<InstanceType<typeof Gallery> | null>(null);

const handleImages = (imgs: IImagePayload[]) => {
  setFieldValue("images", imgs);
};

// cargar edición
watch(
  () => props.data,
  async (newData) => {
    if (newData) {
      isResettingForm.value = true;
      resetForm({
        values: {
          ...newData,
          features:
            newData.features?.map(
              (feature: PropertyFeatureFormValue) => feature.feature_type_id,
            ) ?? [],
          prices: newData.prices ?? [],
        },
      });
      await nextTick();
      isResettingForm.value = false;
    }
  },
  { immediate: true },
);

// validar antes de enviar
const hasPendingUpload = (): boolean => {
  return galleryRef.value?.hasPendingUploads?.() ?? false;
};

defineExpose({
  async validateForm() {
    if (hasPendingUpload()) return false;

    const result = await validate();
    return result.valid;
  },
  getValues(): IProperty {
    return {
      ...values,
      features: values.features?.map((id: string) => ({
        feature_type_id: id,
      })),
      prices: values.prices ?? [],
    } as IProperty;
  },
  reset() {
    resetForm();
  },
  setBackendErrors(backendErrors: Record<string, string>) {
    setErrors(backendErrors);
  },
});
</script>

<style scoped></style>
