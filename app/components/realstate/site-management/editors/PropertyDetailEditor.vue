<template>
  <!-- Comportamiento de la ficha -->
  <RealstateSiteManagementSiteBlock
    title="Comportamiento de la ficha"
    hint="Opciones que aplican a todas las páginas de detalle de propiedad."
  >
    <div class="row gx-3">
      <CommonInputfieldsCheckbox
        v-model="content.show_related_properties"
        classes="col-md-6"
        label="Mostrar propiedades relacionadas al final de cada ficha"
        name="show_related_properties"
      />
      <CommonInputfieldsCheckbox
        v-model="content.hide_address"
        classes="col-md-6"
        label="Ocultar dirección exacta (mostrar solo ciudad y departamento)"
        name="hide_address"
      />
    </div>
  </RealstateSiteManagementSiteBlock>

  <!-- Formulario de contacto en la ficha -->
  <RealstateSiteManagementSiteBlock
    title="Formulario de contacto en la ficha"
    hint="Textos del bloque de contacto que aparece al costado de cada propiedad."
  >
    <div class="row gx-3">
      <CommonInputfieldsTextfield
        v-model="content.contact_title"
        :error="getError('contact_title')"
        classes="col-md-6"
        label="Título del formulario"
        :required="false"
        :disabled="!canEdit"
      />
      <CommonInputfieldsTextarea
        v-model="content.contact_description"
        :error="getError('contact_description')"
        classes="col-md-6"
        label="Descripción del formulario"
        :required="false"
        :disabled="!canEdit"
      />
      <CommonInputfieldsTextfield
        v-model="content.related_title"
        :error="getError('related_title')"
        classes="col-md-6"
        label="Título de propiedades relacionadas"
        :required="false"
        :disabled="!canEdit"
      />
    </div>
  </RealstateSiteManagementSiteBlock>

  <!-- Galería fallback -->
  <RealstateSiteManagementSiteBlock
    title="Imágenes de galería por defecto"
    hint="Se muestran solo cuando la propiedad no tiene imágenes propias cargadas."
  >
    <RealstateSiteManagementImagePicker
      v-model="content.gallery_fallback"
      classes="col-12"
      item-classes="col-12 col-sm-6 col-lg-3"
      label="Imágenes"
      :max-images="10"
    />
  </RealstateSiteManagementSiteBlock>
</template>

<script setup lang="ts">
import type { RealstatePropertyDetailContent } from "~/interfaces/IRealstateSiteManagement";

interface Props {
  content: RealstatePropertyDetailContent;
  getError: (field: string) => string | undefined;
  canEdit: boolean;
}

defineProps<Props>();
</script>
