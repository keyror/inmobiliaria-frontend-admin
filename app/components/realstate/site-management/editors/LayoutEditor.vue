<template>
  <RealstateSiteManagementSiteBlock
    title="Logo del footer"
    hint="Si no se sube, se usa el logo principal de la empresa. Recomendado: PNG transparente con proporciones similares al logo del header."
  >
    <RealstateSiteManagementImagePicker
      v-model="content.footer_logo_url"
      classes="col-12"
      label="Logo"
    />
  </RealstateSiteManagementSiteBlock>

  <RealstateSiteManagementSiteBlock
    title="Favicon del sitio"
    hint="Ícono que aparece en la pestaña del navegador. PNG cuadrado de mínimo 64×64 px. Si no se sube, se usa el logo de la empresa."
  >
    <RealstateSiteManagementImagePicker
      v-model="content.favicon_url"
      classes="col-12"
      label="Favicon"
    />
  </RealstateSiteManagementSiteBlock>

  <RealstateSiteManagementSiteBlock
    title="Imagen de fondo del footer"
    hint="Se aplica como fondo en el footer de todas las páginas del sitio público."
  >
    <RealstateSiteManagementImagePicker
      v-model="content.footer_bg_url"
      classes="col-12"
      label="Imagen"
    />
  </RealstateSiteManagementSiteBlock>
</template>

<script setup lang="ts">
import type { RealstateLayoutContent } from "~/interfaces/IRealstateSiteManagement";

interface Props {
  content: RealstateLayoutContent;
  canEdit: boolean;
}

defineProps<Props>();
</script>
