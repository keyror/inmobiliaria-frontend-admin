<template>
  <RealstateSiteManagementImagePicker
    v-model="content.banner_image_url"
    classes="col-12"
    label="Imagen del banner"
    hint="Encabezado de la página de propiedades. Recomendado: 1920×600 px."
  />

  <RealstateSiteManagementSiteBlock
    title="Textos de la página"
    hint="Título y subtítulo que aparecen en el encabezado de la lista de propiedades."
  >
    <div class="row gx-3">
      <CommonInputfieldsTextfield
        v-model="content.title"
        :error="getError('title')"
        classes="col-md-6"
        label="Título"
        :required="false"
        :disabled="!canEdit"
      />
      <CommonInputfieldsTextfield
        v-model="content.subtitle"
        :error="getError('subtitle')"
        classes="col-md-6"
        label="Subtítulo"
        :required="false"
        :disabled="!canEdit"
      />
    </div>
  </RealstateSiteManagementSiteBlock>
</template>

<script setup lang="ts">
import type { RealstatePropertyListContent } from "~/interfaces/IRealstateSiteManagement";

interface Props {
  content: RealstatePropertyListContent;
  getError: (field: string) => string | undefined;
  canEdit: boolean;
}

defineProps<Props>();
</script>
