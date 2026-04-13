<template>
  <div class="card-header ps-0">
    <h5>{{ props.isEditing ? 'Editar Propiedad' : 'Crear Propiedad' }}</h5>
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
    <CommonInputfieldsTextfield
        v-model="year_built"
        :error="errors.year_built"
        classes="col-md-3"
        label="Año de Construcción"
        star="*"
    />

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

    <!-- Precio -->
    <CommonInputfieldsSelectfield
        v-model="price_type_id"
        :data="lookups.priceTypes"
        classes="col-md-3"
        label="Tipo de Precio"
        labelField="name"
    />

    <CommonInputfieldsTextfield
        v-model="price_min"
        classes="col-md-3"
        label="Precio Mínimo"
    />

    <CommonInputfieldsTextfield
        v-model="price_max"
        classes="col-md-3"
        label="Precio Máximo"
    />

    <CommonInputfieldsTextfield
        v-model="price"
        classes="col-md-3"
        label="Precio"
    />

    <CommonInputfieldsTextfield
        v-model="currency"
        classes="col-md-3"
        label="Moneda"
    />

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
    <PropertiesGallery
        ref="galleryRef"
        :data="values.images ?? []"
        @updateImages="handleImages"
    />

  </form>
</template>

<script setup lang="ts">
import type { ILookup } from "~/interfaces/ILookup";
import type { IProperty } from "~/interfaces/IProperty";
import type { IImagePayload } from "~/interfaces/IImageItem";
import type { PropertiesGallery } from "#components";

import { usePropertyForm } from '~/composables/forms/usePropertyForm'

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
  },
  isEditing?: boolean
}>()

const form = usePropertyForm(props.data)

const {
  defineField,
  validate,
  values,
  resetForm,
  errors,
  setErrors,
  setFieldValue,
} = form

// fields
const [title] = defineField('title')
const [code] = defineField('code')
const [cadastral_number] = defineField('cadastral_number')
const [status_property_id] = defineField('status_property_id')
const [status_id] = defineField('status_id')
const [offer_type_id] = defineField('offer_type_id')
const [property_type_id] = defineField('property_type_id')
const [social_strata] = defineField('social_strata')
const [year_built] = defineField('year_built')
const [rooms] = defineField('rooms')
const [bedrooms] = defineField('bedrooms')
const [bathrooms] = defineField('bathrooms')
const [garage_type_id] = defineField('garage_type_id')
const [garage_spots] = defineField('garage_spots')
const [description] = defineField('description')
const [features] = defineField('features')
const [url_google_map] = defineField('url_google_map')
const [latitude] = defineField('latitude')
const [longitude] = defineField('longitude')

// nested (price)
const [price_type_id] = defineField('price.price_type_id')
const [price_min] = defineField('price.price_min')
const [price_max] = defineField('price.price_max')
const [price] = defineField('price.price')
const [currency] = defineField('price.currency')

// gallery
const galleryRef = ref<InstanceType<typeof PropertiesGallery> | null>(null)

const handleImages = (imgs: IImagePayload[]) => {
  setFieldValue('images', imgs)
}

// cargar edición
watch(() => props.data, (newData) => {
  if (newData) {
    resetForm({
      values: {
        ...newData,
        features: newData.features?.map((f: any) => f.feature_type_id) ?? [],
      }
    })
  }
}, { immediate: true })

// validar antes de enviar
const hasPendingUpload = (): boolean => {
  return galleryRef.value?.hasPendingUploads?.() ?? false
}

defineExpose({
  async validateForm() {
    if (hasPendingUpload()) return false

    const result = await validate()
    return result.valid
  },
  getValues(): IProperty {
    return {
      ...values,
      features: values.features?.map((id: string) => ({
        feature_type_id: id
      }))
    } as IProperty
  },
  reset() {
    resetForm()
  },
  setBackendErrors(backendErrors: Record<string, string>) {
    setErrors(backendErrors)
  }
})
</script>

<style scoped>

</style>
