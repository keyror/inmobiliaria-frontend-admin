<template>
  <!-- Imágenes de fondo -->
  <RealstateSiteManagementImagePicker
    v-model="content.background_image_url"
    classes="col-12"
    label="Imagen de fondo principal"
    hint="Se muestra detrás del hero. Recomendado: 1920×1080 px."
  />
  <RealstateSiteManagementImagePicker
    v-model="content.featured_sections_bg_url"
    classes="col-12"
    label="Imagen de fondo — Sección de íconos"
    hint="Fondo de la franja de accesos rápidos bajo el hero."
  />

  <!-- Slides del hero -->
  <RealstateSiteManagementSiteBlock
    title="Slides del hero"
    hint="Título, imagen y botón de cada slide. El primer slide es el principal."
  >
    <template #action>
      <button
        v-if="canEdit"
        class="btn btn-pill btn-gradient color-4"
        type="button"
        @click="onAddSlide"
      >
        <i class="fas fa-plus me-1"></i> Agregar slide
      </button>
    </template>

    <p v-if="!content.hero_slides.length" class="site-empty-state">
      Sin slides configurados — agrega al menos uno para mostrar el hero.
    </p>

    <div
      v-for="(item, index) in content.hero_slides"
      :key="`slide-${index}`"
      class="site-item"
    >
      <div class="site-item-header">
        <span class="site-item-label">Slide {{ index + 1 }}</span>
        <button
          v-if="canEdit"
          class="btn btn-dashed color-1 btn-sm"
          type="button"
          @click="onRemoveSlide(index)"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
      <div class="row gx-3">
        <CommonInputfieldsTextfield
          v-model="item.title"
          classes="col-md-6"
          label="Título"
          :required="false"
          :disabled="!canEdit"
        />
        <CommonInputfieldsTextfield
          v-model="item.description"
          classes="col-md-6"
          label="Descripción corta"
          :required="false"
          :disabled="!canEdit"
        />
        <RealstateSiteManagementImagePicker
          v-model="item.img"
          classes="col-12"
          label="Imagen del slide"
          hint="Recomendado: 1600×900 px."
        />
        <RealstateSiteManagementSiteRoutePicker
          v-model="item.link"
          classes="col-md-6"
          label="Destino del botón"
        />
        <CommonInputfieldsTextfield
          v-model="item.button_text"
          classes="col-md-6"
          label="Texto del botón"
          :required="false"
          :disabled="!canEdit"
        />
      </div>
    </div>
  </RealstateSiteManagementSiteBlock>

  <!-- Secciones de íconos -->
  <RealstateSiteManagementSiteBlock
    title="Accesos rápidos (íconos destacados)"
    hint="Grupos de íconos con enlace que guían al visitante desde el hero."
  >
    <template #action>
      <button
        v-if="canEdit"
        class="btn btn-pill btn-gradient color-4"
        type="button"
        @click="onAddSection"
      >
        <i class="fas fa-plus me-1"></i> Agregar grupo
      </button>
    </template>

    <p v-if="!content.featured_sections.length" class="site-empty-state">
      Sin grupos configurados.
    </p>

    <div
      v-for="(section, sIdx) in content.featured_sections"
      :key="`section-${sIdx}`"
      class="site-item"
    >
      <div class="site-item-header">
        <span class="site-item-label">Grupo {{ sIdx + 1 }}</span>
        <button
          v-if="canEdit"
          class="btn btn-dashed color-1 btn-sm"
          type="button"
          @click="onRemoveSection(sIdx)"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
      <div class="row gx-3">
        <CommonInputfieldsTextfield
          v-model="section.heading"
          classes="col-md-8"
          label="Encabezado del grupo"
          :required="false"
          :disabled="!canEdit"
        />
        <CommonInputfieldsTextfield
          v-model="section.type"
          classes="col-md-4"
          label="Tipo (filter / link)"
          :required="false"
          :disabled="!canEdit"
        />
      </div>

      <!-- Íconos del grupo -->
      <div class="site-icons-header">
        <span class="site-item-label">Íconos del grupo</span>
        <button
          v-if="canEdit"
          class="btn btn-pill btn-gradient color-4 btn-sm"
          type="button"
          @click="onAddIcon(sIdx)"
        >
          <i class="fas fa-plus me-1"></i> Agregar ícono
        </button>
      </div>

      <p v-if="!section.icons.length" class="site-empty-state" style="text-align:left;">
        Sin íconos en este grupo.
      </p>

      <div
        v-for="(item, iIdx) in section.icons"
        :key="`icon-${sIdx}-${iIdx}`"
        class="site-subitem"
      >
        <div class="site-subitem-header">
          <span class="site-subitem-label">Ícono {{ iIdx + 1 }}</span>
          <button
            v-if="canEdit"
            class="btn btn-dashed color-1 btn-sm"
            type="button"
            @click="onRemoveIcon(sIdx, iIdx)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>
        <div class="row gx-3">
          <CommonInputfieldsTextfield
            v-model="item.name"
            classes="col-md-4"
            label="Etiqueta"
            :required="false"
            :disabled="!canEdit"
          />
          <RealstateSiteManagementSiteIconPickerField
            v-model="item.icon"
            classes="col-md-4"
            label="Ícono"
          />
          <RealstateSiteManagementSiteRoutePicker
            v-model="item.path"
            classes="col-md-4"
            label="Destino"
          />
        </div>
      </div>
    </div>
  </RealstateSiteManagementSiteBlock>

  <!-- Marcas -->
  <RealstateSiteManagementSiteBlock
    title="Marcas y aliados"
    hint="Logos que se muestran en un carrusel antes del footer. Formato PNG transparente recomendado."
  >
    <RealstateSiteManagementImagePicker
      v-model="content.brands"
      classes="col-12"
      item-classes="col-6 col-sm-4 col-md-3 col-lg-2"
      label="Logos"
      :max-images="20"
    />
  </RealstateSiteManagementSiteBlock>
</template>

<script setup lang="ts">
import type { RealstateHomeContent } from "~/interfaces/IRealstateSiteManagement";

interface Props {
  content: RealstateHomeContent;
  canEdit: boolean;
  onAddSlide: () => void;
  onRemoveSlide: (index: number) => void;
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
  onAddIcon: (sectionIndex: number) => void;
  onRemoveIcon: (sectionIndex: number, iconIndex: number) => void;
}

defineProps<Props>();
</script>

<style scoped>
.site-icons-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(88, 97, 103, 0.1);
}

:global(body.dark-layout) .site-icons-header {
  border-top-color: #383434;
}
</style>
