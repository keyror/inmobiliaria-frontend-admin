<template>
  <div class="col-12">
    <div class="alert alert-light border site-info-alert d-flex align-items-center gap-2">
      <i class="fas fa-info-circle text-muted flex-shrink-0"></i>
      <span>
        La dirección, teléfono y correo del formulario de contacto se toman de los datos de la empresa.
        <NuxtLink to="/company" class="alert-link ms-1">
          Ir a Configuración de empresa →
        </NuxtLink>
      </span>
    </div>
  </div>

  <RealstateSiteManagementImagePicker
    v-model="content.banner_image_url"
    classes="col-12"
    label="Imagen del banner"
    hint="Encabezado de la página de Contacto. Recomendado: 1920×600 px."
  />

  <RealstateSiteManagementSiteBlock
    title="Textos de la página"
    hint="Título y descripción que aparecen en la sección principal de contacto."
  >
    <div class="row gx-3">
      <CommonInputfieldsTextfield
        v-model="content.title"
        classes="col-md-6"
        label="Título"
        :required="false"
        :disabled="!canEdit"
      />
      <CommonInputfieldsTextarea
        v-model="content.description"
        classes="col-md-6"
        label="Descripción"
        :required="false"
        :disabled="!canEdit"
      />
    </div>
  </RealstateSiteManagementSiteBlock>

  <RealstateSiteManagementImagePicker
    v-model="content.image"
    classes="col-12"
    label="Imagen decorativa"
    hint="Aparece al lado del formulario de contacto."
  />
</template>

<script setup lang="ts">
import type { RealstateContactContent } from "~/interfaces/IRealstateSiteManagement";

interface Props {
  content: RealstateContactContent;
  getError: (field: string) => string | undefined;
  canEdit: boolean;
}

defineProps<Props>();
</script>

<style scoped>
.site-info-alert {
  font-size: 0.875rem;
}

:global(body.dark-layout) .site-info-alert {
  background: #1b1b1b;
  border-color: #383434 !important;
  color: rgba(255, 255, 255, 0.76);
}

:global(body.dark-layout) .site-info-alert .alert-link {
  color: var(--theme-default7, #7f50f3);
}
</style>
