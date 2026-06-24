<template>
  <div class="container">
    <draggable
      v-model="images"
      :item-key="(el) => el.id ?? el.tempId"
      class="row g-2"
      ghost-class="ghost"
      chosen-class="chosen"
      :disabled="!can('images.edit') || images.some((i) => i.uploading)"
      :class="{
        'draggable-disabled':
          !can('images.edit') || images.some((i) => i.uploading),
      }"
      @end="onDragEnd"
    >
      <!-- IMÁGENES -->
      <template #item="{ element, index }">
        <div :class="props.itemClasses">
          <div class="image-card">
            <img
              v-if="element.url"
              :src="element.url"
              @load="element.imageLoading = false"
              @error="element.imageLoading = false"
              alt="img"
            />
            <!-- PLACEHOLDER -->
            <div v-else class="placeholder">
              <div class="placeholder-text">{{ props.dimensions }}</div>
            </div>

            <!-- LOADING GLOBAL -->
            <!-- Overlay spinner actualizado -->
            <div
              v-if="
                element.uploading || element.deleting || element.settingCover
              "
              class="overlay"
            >
              <i class="fas fa-spinner fa-spin"></i>
            </div>

            <!-- ERROR -->
            <div v-if="element.error" class="overlay error">
              <i class="fas fa-exclamation-triangle"></i>
            </div>

            <!-- ELIMINAR -->
            <span
              class="icon-btn delete"
              @click="remove(index)"
              v-if="
                can('images.delete') &&
                !element.uploading &&
                !element.deleting &&
                !element.settingCover
              "
            >
              <i class="fas fa-times"></i>
            </span>

            <!-- PORTADA -->
            <span
              class="icon-btn star"
              :class="{ active: element.is_cover }"
              @click="setCover(index)"
              v-if="
                props.showCover &&
                can('images.edit') &&
                !element.uploading &&
                !element.deleting &&
                !element.settingCover
              "
            >
              <i class="fas fa-star"></i>
            </span>
            <!-- PREVIEW -->
            <span class="icon-btn eye" @click="openPreview(element.url)">
              <i class="fas fa-eye"></i>
            </span>
          </div>
        </div>
      </template>

      <!-- AGREGAR -->
      <template
        #footer
        v-if="can('images.create') && images.length < props.maxImages"
      >
        <div :class="addItemClasses">
          <label
            class="image-card add-card"
            :class="{
              'with-dimensions': images.length === 0 && props.dimensions,
            }"
          >
            <input
              type="file"
              :multiple="props.maxImages > 1"
              accept="image/*"
              @change="onFileChange"
              hidden
            />
            <span class="plus">+</span>
            <!-- Dimensiones dentro de la misma card cuando aún no hay imágenes -->
            <span
              v-if="images.length === 0 && props.dimensions"
              class="placeholder-text"
            >
              {{ props.dimensions }}
            </span>
          </label>
        </div>
      </template>
    </draggable>

    <div class="mb-2 text-muted">
      {{ images.length }} / {{ props.maxImages }} imágenes permitidas
    </div>

    <!-- MODAL PREVIEW -->
    <CommonModal v-model:show="showPreview" title="Vista previa" size="xl">
      <div class="text-center">
        <img v-if="previewImage" :src="previewImage" class="preview-img" />
      </div>
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import draggable from "vuedraggable";

import { useApiHandler } from "~/composables/useApiHandler";
import GalleryService from "~/services/GalleryService";

import type { IImage, IImagePayload, ImageItem } from "~/interfaces/IImageItem";

interface DragEndEvent {
  oldIndex?: number;
  newIndex?: number;
}

const { run } = useApiHandler();
const { can } = useAuthorization();

const emit = defineEmits<{
  (e: "updateImages", value: IImagePayload[]): void;
}>();

const props = withDefaults(
  defineProps<{
    data?: IImage[];
    maxImages?: number;
    itemClasses?: string;
    addItemClasses?: string;
    dimensions?: string;
    showCover?: boolean;
  }>(),
  {
    data: () => [],
    maxImages: 10,
    itemClasses: "col-sm-12 col-lg-2",
    addItemClasses: "",
    dimensions: "",
    showCover: true,
  },
);

const { optimizeImage } = useImageOptimizer();

const images = ref<ImageItem[]>([]);
const previewImage = ref<string | null>(null);
const showPreview = ref(false);
const addItemClasses = computed(
  () => props.addItemClasses || props.itemClasses,
);

const openPreview = (url: string) => {
  previewImage.value = url;
  showPreview.value = true;
};

const emitImages = () => {
  const data: IImagePayload[] = images.value
    .filter((img) => img.url && !img.error && !img.uploading)
    .map((img, index) => ({
      id: img.id ?? null,
      url: img.url,
      is_cover: img.is_cover,
      sort_order: index,
    }));

  emit("updateImages", data);
};

const ensureSingleCover = () => {
  const first = images.value.findIndex((i) => i.is_cover);

  if (first === -1 && images.value.length >= 1) {
    images.value[0].is_cover = true;
  }

  images.value.forEach((img, i) => {
    img.is_cover = i === (first === -1 ? 0 : first);
  });
};

//
// SUBIR IMÁGENES
//
const onFileChange = async (event: Event) => {
  if (!can("images.create")) return;

  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const availableSlots = props.maxImages - images.value.length;
  const files = Array.from(target.files).slice(0, availableSlots);

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const optimized = await optimizeImage(file);
    const localUrl = URL.createObjectURL(optimized);

    const tempId = `temp_${Date.now()}_${Math.random()}`;

    const tempImage: ImageItem = {
      tempId,
      url: localUrl,
      is_cover: false,
      uploading: true,
      imageLoading: false,
    };

    images.value.push(tempImage);

    const formData = new FormData();
    formData.append("image", optimized);

    const response = await run(GalleryService.uploadSingle(formData), {
      showSuccess: true,
    });

    const idx = images.value.findIndex((i) => i.tempId === tempId);

    if (response && idx !== -1) {
      images.value[idx] = {
        ...images.value[idx],
        tempId: undefined,
        url: response.data.url,
        id: response.data.id,
        uploading: false,
        imageLoading: false,
      };

      ensureSingleCover();
      emitImages();
    } else if (idx !== -1) {
      images.value[idx] = {
        ...images.value[idx],
        uploading: false,
        imageLoading: false,
        error: true,
      };
    }
  }

  target.value = "";
};

//
// ELIMINAR
//
const remove = async (index: number) => {
  if (!can("images.delete")) return;

  const img = images.value[index];

  if (!img.id) {
    images.value.splice(index, 1);
    emitImages();
    return;
  }

  img.deleting = true;

  const response = await run(GalleryService.deleteImage(img.id), {
    showSuccess: true,
  });

  if (response) {
    images.value.splice(index, 1);
    ensureSingleCover();
    emitImages();
  } else {
    img.deleting = false;
  }
};

//
// PORTADA
//
const setCover = async (index: number) => {
  if (!can("images.edit")) return;

  const img = images.value[index];
  if (!img.id) return;

  img.settingCover = true;

  const response = await run(GalleryService.setCover(img.id), {
    showSuccess: true,
  });

  if (response) {
    images.value.forEach((i, idx) => {
      i.is_cover = idx === index;
    });
    emitImages();
  }

  img.settingCover = false;
};

const onDragEnd = (event: DragEndEvent) => {
  if (!can("images.edit")) return;

  if (event.oldIndex !== event.newIndex) {
    emitImages();
  }
};

watch(
  () => props.data,
  (newData) => {
    if (newData && newData.length) {
      images.value = newData.map((img: IImage) => ({
        id: img.id,
        url: img.url,
        is_cover: !!img.is_cover,
        uploading: false,
        imageLoading: false,
      }));
    } else {
      images.value = [];
    }
  },
  { immediate: true },
);

defineExpose({
  hasPendingUploads: () => {
    return images.value.some((i) => i.uploading);
  },
});
</script>

<style scoped>
.image-card {
  position: relative;
  border: 1px dashed #ccc;
  border-radius: 10px;
  height: 120px;
  overflow: hidden;
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* PLACEHOLDER */
.placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #bbb;
}

.placeholder-text {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  text-align: center;
}

/* ADD */
.add-card {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #888;
}

/* Solo cuando se muestra el texto de dimensiones junto al "+" (placeholder vacío) */
.add-card.with-dimensions {
  flex-direction: column;
  gap: 6px;
}

.plus {
  font-size: 40px;
  line-height: 1;
}

/* OVERLAY */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay.error {
  background: rgba(255, 0, 0, 0.5);
}

/* PREVIEW */
.preview-img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 10px;
}

/* DRAG */
.ghost {
  opacity: 0.4;
}

.chosen {
  transform: scale(1.05);
}

/* ICONOS */
.icon-btn {
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* POSICIONES */
.icon-btn.delete {
  top: 5px;
  right: 5px;
}
.icon-btn.eye {
  top: 5px;
  left: 5px;
}
.icon-btn.star {
  bottom: 5px;
  left: 5px;
}

/* ICONO */
.icon-btn i {
  font-size: 16px;
  padding: 6px;
  border-radius: 50%;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
}

/* COLORES */
.icon-btn.delete i {
  background: rgba(255, 0, 0, 0.7);
}

.icon-btn.star i {
  color: #ccc;
}

/* HOVER */
.icon-btn i:hover {
  transform: scale(1.2);
}

/* ACTIVO */
.icon-btn.star.active i {
  color: gold;
  transform: scale(1.3);
}

/* SOLO AL HOVER */
.image-card:hover .icon-btn {
  opacity: 1;
}

/* Cursor bloqueado cuando hay uploads en curso */
.draggable-disabled .image-card {
  cursor: not-allowed;
}

.draggable-disabled .add-card {
  cursor: pointer;
}
</style>
