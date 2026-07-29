<template>
  <!-- Banner -->
  <RealstateSiteManagementImagePicker
    v-model="content.banner_image_url"
    classes="col-12"
    label="Imagen del banner"
    hint="Encabezado de la página de Servicios. Recomendado: 1920×600 px."
  />

  <!-- Hero de la sección -->
  <RealstateSiteManagementSiteBlock
    title="Bloque hero de servicios"
    hint="Texto e imagen del encabezado destacado que aparece al entrar a la página."
  >
    <div class="row gx-3">
      <CommonInputfieldsTextfield
        v-model="content.hero.title"
        classes="col-md-6"
        label="Título"
        :required="false"
        :disabled="!canEdit"
      />
      <CommonInputfieldsTextarea
        v-model="content.hero.description"
        classes="col-md-6"
        label="Descripción"
        :required="false"
        :disabled="!canEdit"
      />
      <RealstateSiteManagementImagePicker
        v-model="content.hero.image"
        classes="col-12"
        label="Imagen del hero"
        hint="Imagen que acompaña el texto introductorio."
      />
      <CommonInputfieldsTextfield
        v-model="content.hero.button_text"
        classes="col-md-6"
        label="Texto del botón"
        :required="false"
        :disabled="!canEdit"
      />
      <RealstateSiteManagementSiteRoutePicker
        v-model="content.hero.button_link"
        classes="col-md-6"
        label="Destino del botón"
      />
    </div>
  </RealstateSiteManagementSiteBlock>

  <!-- Servicios de la inmobiliaria -->
  <RealstateSiteManagementSiteBlock
    title="Servicios de la inmobiliaria"
    hint="Tarjetas con ícono, descripción y enlace (acompañamiento, arriendo, venta, etc.)."
  >
    <template #action>
      <button
        v-if="canEdit"
        class="btn btn-pill btn-gradient color-4"
        type="button"
        @click="onAddProvidedService"
      >
        <i class="fas fa-plus me-1"></i> Agregar servicio
      </button>
    </template>

    <p v-if="!content.provided_services.length" class="site-empty-state">
      Sin servicios configurados.
    </p>

    <div
      v-for="(item, index) in content.provided_services"
      :key="`provided-${index}`"
      class="site-item"
    >
      <div class="site-item-header">
        <span class="site-item-label">Servicio {{ index + 1 }}</span>
        <button
          v-if="canEdit"
          class="btn btn-dashed color-1 btn-sm"
          type="button"
          @click="onRemoveProvidedService(index)"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
      <div class="row gx-3">
        <CommonInputfieldsTextfield
          v-model="item.title"
          classes="col-md-4"
          label="Título"
          :required="false"
          :disabled="!canEdit"
        />
        <RealstateSiteManagementSiteIconPickerField
          v-model="item.icon"
          classes="col-md-4"
          label="Ícono"
        />
        <RealstateSiteManagementSiteRoutePicker
          v-model="item.link"
          classes="col-md-4"
          label="Enlace"
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

  <!-- Servicios por tipo de propiedad -->
  <RealstateSiteManagementSiteBlock
    title="Servicios por tipo de propiedad"
    hint="Tarjetas con puntos destacados para arriendo, venta, administración, etc."
  >
    <template #action>
      <button
        v-if="canEdit"
        class="btn btn-pill btn-gradient color-4"
        type="button"
        @click="onAddPropertyService"
      >
        <i class="fas fa-plus me-1"></i> Agregar tipo
      </button>
    </template>

    <p v-if="!content.property_services.length" class="site-empty-state">
      Sin tipos de servicio configurados.
    </p>

    <div
      v-for="(item, index) in content.property_services"
      :key="`prop-${index}`"
      class="site-item"
    >
      <div class="site-item-header">
        <span class="site-item-label">Tipo {{ index + 1 }}</span>
        <button
          v-if="canEdit"
          class="btn btn-dashed color-1 btn-sm"
          type="button"
          @click="onRemovePropertyService(index)"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
      <div class="row gx-3">
        <CommonInputfieldsTextfield
          v-model="item.title"
          classes="col-md-4"
          label="Título"
          :required="false"
          :disabled="!canEdit"
        />
        <RealstateSiteManagementSiteIconPickerField
          v-model="item.icon"
          classes="col-md-4"
          label="Ícono"
        />
        <RealstateSiteManagementSiteRoutePicker
          v-model="item.link"
          classes="col-md-4"
          label="Enlace"
        />
        <CommonInputfieldsTextarea
          v-model="item.description"
          classes="col-md-6"
          label="Descripción"
          :required="false"
          :disabled="!canEdit"
        />
        <div class="form-group col-md-6">
          <label>Puntos destacados</label>
          <textarea
            class="form-control"
            rows="4"
            :disabled="!canEdit"
            :value="pointsToText(item.points)"
            @input="onSetPoints(item, $event)"
          ></textarea>
          <small class="text-muted">Un punto por línea.</small>
        </div>
      </div>
    </div>
  </RealstateSiteManagementSiteBlock>
</template>

<script setup lang="ts">
import type {
  RealstateContentItem,
  RealstateServicesContent,
} from "~/interfaces/IRealstateSiteManagement";

interface Props {
  content: RealstateServicesContent;
  getError: (field: string) => string | undefined;
  canEdit: boolean;
  onAddProvidedService: () => void;
  onRemoveProvidedService: (index: number) => void;
  onAddPropertyService: () => void;
  onRemovePropertyService: (index: number) => void;
  pointsToText: (points?: string[]) => string;
  onSetPoints: (item: RealstateContentItem, event: Event) => void;
}

defineProps<Props>();
</script>
