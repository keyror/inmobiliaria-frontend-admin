<template>
  <!-- Banner -->
  <RealstateSiteManagementImagePicker
    v-model="content.banner_image_url"
    classes="col-12"
    label="Imagen del banner"
    hint="Encabezado de la página Nosotros. Recomendado: 1920×600 px."
  />

  <!-- Introducción -->
  <RealstateSiteManagementSiteBlock
    title="Sección de introducción"
    hint="Texto e imágenes del bloque «Quiénes somos» al inicio de la página."
  >
    <div class="row gx-3">
      <CommonInputfieldsTextfield
        v-model="content.intro.title"
        :error="getError('intro.title')"
        classes="col-md-6"
        label="Título introductorio"
        :required="false"
        :disabled="!canEdit"
      />
      <CommonInputfieldsTextarea
        v-model="content.intro.description"
        :error="getError('intro.description')"
        classes="col-md-6"
        label="Párrafo introductorio"
        :required="false"
        :disabled="!canEdit"
      />
      <RealstateSiteManagementImagePicker
        v-model="introImageUrls"
        classes="col-12"
        hint="Dos imágenes superpuestas decorativas. Máximo 2."
        item-classes="col-12 col-md-6"
        label="Imágenes decorativas"
        :max-images="2"
      />
    </div>
  </RealstateSiteManagementSiteBlock>

  <!-- Historia / Misión / Visión -->
  <RealstateSiteManagementSiteBlock
    title="Historia, misión y visión"
    hint="Textos institucionales que aparecen en la sección central de la página."
  >
    <div class="row gx-3">
      <CommonInputfieldsTextarea
        v-model="content.history"
        :error="getError('history')"
        classes="col-md-4"
        label="Historia"
        :required="false"
        :disabled="!canEdit"
      />
      <CommonInputfieldsTextarea
        v-model="content.mission"
        :error="getError('mission')"
        classes="col-md-4"
        label="Misión"
        :required="false"
        :disabled="!canEdit"
      />
      <CommonInputfieldsTextarea
        v-model="content.vision"
        :error="getError('vision')"
        classes="col-md-4"
        label="Visión"
        :required="false"
        :disabled="!canEdit"
      />
    </div>
  </RealstateSiteManagementSiteBlock>

  <!-- Por qué elegirnos -->
  <RealstateSiteManagementSiteBlock
    title="Por qué elegirnos"
    hint="Argumentos con ícono que refuerzan la confianza del visitante."
  >
    <template #action>
      <button
        v-if="canEdit"
        class="btn btn-pill btn-gradient color-4"
        type="button"
        @click="onAddItem"
      >
        <i class="fas fa-plus me-1"></i> Agregar razón
      </button>
    </template>

    <p v-if="!content.why_choose_us.length" class="site-empty-state">
      Sin razones configuradas.
    </p>

    <div
      v-for="(item, index) in content.why_choose_us"
      :key="`why-${index}`"
      class="site-item"
    >
      <div class="site-item-header">
        <span class="site-item-label">Razón {{ index + 1 }}</span>
        <button
          v-if="canEdit"
          class="btn btn-dashed color-1 btn-sm"
          type="button"
          @click="onRemoveItem(index)"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
      <div class="row gx-3">
        <RealstateSiteManagementSiteIconPickerField
          v-model="item.icon"
          classes="col-md-4"
          label="Ícono"
        />
        <CommonInputfieldsTextfield
          v-model="item.title"
          classes="col-md-8"
          label="Título"
          :required="false"
          :disabled="!canEdit"
        />
        <CommonInputfieldsTextarea
          v-model="item.description"
          classes="col-12"
          label="Descripción"
          :required="false"
          :disabled="!canEdit"
        />
      </div>
    </div>
  </RealstateSiteManagementSiteBlock>
</template>

<script setup lang="ts">
import type {
  RealstateAboutContent,
  RealstateEditableImage,
} from "~/interfaces/IRealstateSiteManagement";

interface Props {
  content: RealstateAboutContent;
  getError: (field: string) => string | undefined;
  canEdit: boolean;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const props = defineProps<Props>();

const introImageUrls = computed<string[]>({
  get: () =>
    props.content.intro.images
      .map((img: RealstateEditableImage) => img.url.trim())
      .filter(Boolean),
  set: (urls: string[]) => {
    const current = props.content.intro.images;
    props.content.intro.images = urls.map((url, i) => ({
      url,
      alt: current[i]?.alt ?? "",
    }));
  },
});
</script>
