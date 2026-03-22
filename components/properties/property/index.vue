<template>
  <div class="card-header ps-0">
    <h5> {{ props.isEditing ? 'Editar Propiedad' : 'Crear Propiedad' }}</h5>
  </div>

  <form class="row gx-3" @submit.prevent="sendForm">

    <!-- Título -->
    <CommonInputfieldsTextfield
        v-model="form.title"
        classes="col-md-6"
        label="Título"
        star="*"
        placeholder="Casa moderna en zona norte"
        :rules="PropertySchema.title"
        name="title"
    />

    <!-- Código -->
    <CommonInputfieldsTextfield
        v-model="form.code"
        classes="col-md-3"
        label="Código"
        placeholder="Ej: PROP-001"
        :rules="PropertySchema.code"
        name="code"
    />

    <!-- Número Catastral -->
    <CommonInputfieldsTextfield
        v-model="form.cadastral_number"
        classes="col-md-3"
        label="Número Catastral"
        :rules="PropertySchema.cadastral_number"
        name="cadastral_number"
    />

    <!-- Estado -->
    <CommonInputfieldsSelectfield
        v-model="form.status_property_id"
        classes="col-md-3"
        label="Estado Actual"
        :data="lookups.statusType"
        star="*"
        labelField="name"
        :rules="PropertySchema.status_property_id"
        name="status_id"
    />

    <!-- Estado -->
    <CommonInputfieldsSelectfield
        v-model="form.status_id"
        classes="col-md-3"
        label="Estado"
        :data="lookups.status"
        star="*"
        labelField="name"
        :rules="PropertySchema.status_id"
        name="status_id"
    />

    <!-- Tipo de Oferta -->
    <CommonInputfieldsSelectfield
        v-model="form.offer_type_id"
        classes="col-md-3"
        label="Tipo de Oferta"
        star="*"
        :data="lookups.offerType"
        labelField="name"
        :rules="PropertySchema.offer_type_id"
        name="offer_type_id"
    />

    <!-- Tipo de Propiedad -->
    <CommonInputfieldsSelectfield
        v-model="form.property_type_id"
        classes="col-md-3"
        label="Tipo de Propiedad"
        star="*"
        labelField="name"
        :data="lookups.propertyTypes"
        :rules="PropertySchema.property_type_id"
        name="property_type_id"
    />

    <!-- Estrato -->
    <CommonInputfieldsTextfield
        v-model="form.social_strata"
        classes="col-md-3"
        label="Estrato"
        star="*"
        placeholder="Ej: 3"
        :rules="PropertySchema.social_strata"
        name="social_strata"
    />

    <!-- Año Construcción -->
    <CommonInputfieldsTextfield
        v-model="form.year_built"
        classes="col-md-3"
        label="Año de Construcción"
        star="*"
        placeholder="Ej: 2018"
        :rules="PropertySchema.year_built"
        name="year_built"
    />

    <!-- Habitaciones -->
    <CommonInputfieldsTextfield
        v-model="form.rooms"
        classes="col-md-3"
        label="Habitaciones"
        star="*"
        :rules="PropertySchema.rooms"
        name="rooms"
    />

    <!-- Dormitorios -->
    <CommonInputfieldsTextfield
        v-model="form.bedrooms"
        classes="col-md-3"
        label="Dormitorios"
        star="*"
        :rules="PropertySchema.bedrooms"
        name="bedrooms"
    />

    <!-- Baños -->
    <CommonInputfieldsTextfield
        v-model="form.bathrooms"
        classes="col-md-3"
        label="Baños"
        star="*"
        :rules="PropertySchema.bathrooms"
        name="bathrooms"
    />

    <!-- Tipo de Garaje -->
    <CommonInputfieldsSelectfield
        v-model="form.garage_type_id"
        classes="col-md-3"
        label="Tipo de Garaje"
        star="*"
        labelField="name"
        :data="lookups.garageTypes"
        :rules="PropertySchema.garage_type_id"
        name="garage_type_id"
    />

    <!-- Cupos Garaje -->
    <CommonInputfieldsTextfield
        v-model="form.garage_spots"
        star="*"
        classes="col-md-3"
        label="Cupos de Garaje"
        :rules="PropertySchema.garage_spots"
        name="garage_spots"
    />

    <!-- Linderos
    <CommonInputfieldsTextarea
        v-model="form.boundaries"
        classes="col-md-6"
        label="Linderos"
        :rules="PropertySchema.boundaries"
        name="boundaries"
    />-->

    <!-- Precios -->

    <CommonInputfieldsSelectfield
        v-model="form.price.price_type_id"
        classes="col-md-3"
        label="Tipo de Precio"
        labelField="name"
        :data="lookups.priceTypes"
    />

    <CommonInputfieldsTextfield
        v-model="form.price.price_min"
        :type="'number'"
        classes="col-md-3"
        label="Precio Mínimo"
    />

    <CommonInputfieldsTextfield
        v-model="form.price.price_max"
        :type="'number'"
        classes="col-md-3"
        label="Precio Máximo"
    />

    <CommonInputfieldsTextfield
        v-model="form.price.price"
        :type="'number'"
        classes="col-md-3"
        label="Precio"
    />

    <CommonInputfieldsTextfield
        v-model="form.price.currency"
        classes="col-md-3"
        label="Moneda"
    />

    <!-- Descripción -->
    <CommonInputfieldsTextarea
        v-model="form.description"
        classes="col-md-12"
        label="Descripción"
        :rules="PropertySchema.description"
        name="description"
    />
    <!-- Características (múltiple) -->
    <CommonInputfieldsSelectfield
        v-model="form.features"
        classes="col-md-12"
        label="Características"
        labelField="name"
        :data="lookups.features"
        multiple
        searchable
        :rules="PropertySchema.features"
        name="features"
    />

    <!-- Google Maps -->
    <CommonInputfieldsTextfield
        v-model="form.url_google_map"
        classes="col-md-6"
        label="URL Google Maps"
        :rules="PropertySchema.url_google_map"
        name="url_google_map"
    />

    <!-- Latitud -->
    <CommonInputfieldsTextfield
        v-model="form.latitude"
        :type="'number'"
        classes="col-md-3"
        label="Latitud"
        :rules="PropertySchema.latitude"
        name="latitude"
    />

    <!-- Longitud -->
    <CommonInputfieldsTextfield
        v-model="form.longitude"
        :type="'number'"
        classes="col-md-3"
        label="Longitud"
        :rules="PropertySchema.longitude"
        name="longitude"
    />
    <PropertiesGallery
        @updateImages="handleImages"
        :data="form.images ?? []"
        ref="galleryRef"
    />

  </form>
</template>

<script setup lang="ts">
import type {ILookup} from "~/interfaces/ILookup";
import type {IProperty} from "~/interfaces/IProperty";
import {PropertySchema} from "~/utils/validations/property.schema";
import {useValidator} from "~/composables/useValidator";
import type {IArea} from "~/interfaces/IArea";
import type {IPublishChannel} from "~/interfaces/IPublishChannel";
import type {IPropertyObligation} from "~/interfaces/IPropertyObligation";
import type {IPropertyPrice} from "~/interfaces/IPropertyPrice";
import type {IImage, IImagePayload} from "~/interfaces/IImageItem";
import type {PropertiesGallery} from "#components";
import AlertService from "~/services/AlertService";

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IProperty,
  lookups: {
    garageTypes: ILookup[]
    propertyTypes: ILookup[]
    statusType: ILookup[],
    offerType: ILookup[],
    priceTypes: ILookup[],
    features: ILookup[],
    status: ILookup[],
    frequency: ILookup[],
    obligationTypes: ILookup[],
    opSiNo: ILookup[],
    publishChannels: ILookup[],
  },
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'sendForm', property: IProperty): void
  (e: "formInvalid", payload: boolean): void;
  (e: 'reload'): void
}>()

const initialForm: IProperty = {
  code: '',
  status_property_id: '',
  status_id: '',
  title: '',
  offer_type_id: '',
  property_type_id: '',
  social_strata: '',
  year_built: '',
  rooms: '',
  bedrooms: '',
  bathrooms: '',
  garage_type_id: '',
  garage_spots: '',
  cadastral_number: '',
  url_google_map: '',
  latitude: '',
  longitude: '',
  boundaries: '',
  description: '',
  areas: <IArea[]> [],
  publish_channels: <IPublishChannel[]> [],
  features: [],
  images: <IImage[]> [],
  obligations: <IPropertyObligation[]> [],
  price: <IPropertyPrice> {
    price_type_id: '',
    price_min: '',
    price_max: '',
    price: '',
    currency: '',
  },
};

const form = ref<IProperty>({ ...initialForm });
const formOriginal = ref<IProperty>({ ...initialForm });
const galleryRef = ref<InstanceType<typeof PropertiesGallery> | null>(null)

const handleImages = (images: IImagePayload[]) => {
  console.log('handleImages', images);
  form.value.images = images
}

watch(() => props.data, (newData) => {
  if (newData) {
    const modAttributes = {
      ...initialForm,
      ...newData,
      features: newData.features?.map(f => f.feature_type_id) ?? [],
    };

    form.value = { ...modAttributes };
    formOriginal.value = { ...modAttributes };
  }
}, { immediate: true });

const sendForm = () => {
  if (hasPendingUpload()) return

  const isValid = validateForm(form.value, PropertySchema);
  if (isValid) {
    const payload = {
      ...form.value,
      features: form.value.features?.map((id: string) => ({ feature_type_id: id }))
    }

    emit("sendForm", payload);
  } else {
    emit("formInvalid", true);
  }
}

const reset = () => {
  form.value = { ...formOriginal.value }
  resetErrors();
}

const hasPendingUpload = (): boolean => {
  if (galleryRef.value?.hasPendingUploads()) {
    emit("formInvalid", true)
    return true
  }

  return false
}

defineExpose({
  sendForm,
  reset
});

</script>

<style scoped>

</style>
