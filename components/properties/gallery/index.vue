<template>
  <div class="container mt-3">

    <draggable
        v-model="images"
        :item-key="(el) => el.id ?? el.tempId"
        class="row g-2"
        ghost-class="ghost"
        chosen-class="chosen"
        :disabled="images.some(i => i.uploading)"
        :class="{ 'draggable-disabled': images.some(i => i.uploading) }"
        @end="onDragEnd"
    >

      <!-- IMÁGENES -->
      <template #item="{ element, index }">
        <div class="col-sm-12 col-lg-2">
          <div class="image-card">
            <img :src="element.url"
                 @load="element.imageLoading = false"
                 @error="element.imageLoading = false"
                 alt="img"
            />

            <!-- LOADING GLOBAL -->
            <!-- Overlay spinner actualizado -->
            <div
                v-if="element.uploading || element.deleting || element.settingCover"
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
                v-if="!element.uploading && !element.deleting && !element.settingCover"
            >
              <i class="fas fa-times"></i>
            </span>

            <!-- PORTADA -->
            <span
                class="icon-btn star"
                :class="{ active: element.is_cover }"
                @click="setCover(index)"
                v-if="!element.uploading && !element.deleting && !element.settingCover"
            >
              <i class="fas fa-star"></i>
            </span>
            <!-- PREVIEW -->
            <span
                class="icon-btn eye"
                @click="openPreview(element.url)"
            >
              <i class="fas fa-eye"></i>
            </span>

          </div>
        </div>
      </template>

      <!-- AGREGAR -->
      <template #footer v-if="images.length < props.maxImages">
        <div class="col-3">
          <label class="image-card add-card">
            <input
                type="file"
                multiple
                accept="image/*"
                @change="onFileChange"
                hidden
            />
            <span class="plus">+</span>
          </label>
        </div>
      </template>
    </draggable>

    <div class="mb-2 text-muted">
      {{ images.length }} / {{ props.maxImages }} imágenes permitidas
    </div>

    <!-- MODAL PREVIEW -->
    <CommonModal
        v-model:show="showPreview"
        title="Vista previa"
        size="xl"
    >
      <div class="text-center">
        <img
            v-if="previewImage"
            :src="previewImage"
            class="preview-img"
        />
      </div>
    </CommonModal>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import GalleryService from '@/services/GalleryService'
import type {IImage, IImagePayload, ImageItem} from "@/interfaces/IImageItem";
import AlertService from "~/services/AlertService";

const emit = defineEmits<{
  (e: 'updateImages', value: IImagePayload[]): void
}>()

const props = withDefaults(defineProps<{
  data?: IImage[]
  maxImages?: number
}>(), {
  data: () => [],
  maxImages: 10
})

const { optimizeImage } = useImageOptimizer()

const images = ref<ImageItem[]>([])

const previewImage = ref<string | null>(null)
const showPreview = ref(false)

const openPreview = (url: string) => {
  previewImage.value = url
  showPreview.value = true
}

const emitImages = () => {
  const data: IImagePayload[] = images.value
      .filter(img => img.url && !img.error && !img.uploading)
      .map((img, index) => ({
        id: img.id ?? null,
        url: img.url,
        is_cover: img.is_cover,
        sort_order: index,
      }))

  emit('updateImages', data)
}

const ensureSingleCover = () => {
  const first = images.value.findIndex(i => i.is_cover)

  if (first === -1 && images.value.length >= 1) {
    images.value[0].is_cover = true
  }

  images.value.forEach((img, i) => {
    img.is_cover = i === (first === -1 ? 0 : first)
  })
}

// SUBIR IMÁGENES
const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return

  const files = Array.from(target.files)

  for (const file of files) {
    if (!file.type.startsWith('image/')) continue

    if (file) {

    }

    const optimized = await optimizeImage(file)
    const localUrl = URL.createObjectURL(optimized)

    // ID temporal único para rastrear aunque draggable clone el objeto
    const tempId = `temp_${Date.now()}_${Math.random()}`

    const tempImage: ImageItem = {
      tempId,
      url: localUrl,
      is_cover: false,
      uploading: true,
      imageLoading: false,
    }

    images.value.push(tempImage)

    const formData = new FormData()
    formData.append('image', optimized)

    GalleryService.uploadSingle(formData)
        .then((response) => {
          // Buscar por tempId, sobrevive al reorden de draggable
          const idx = images.value.findIndex(i => i.tempId === tempId)
          if (idx !== -1) {
            images.value[idx] = {
              ...images.value[idx],
              tempId: undefined,
              url: response.data.url,
              id: response.data.id,
              uploading: false,
              imageLoading: false,
            }

            ensureSingleCover()
            emitImages()
          }
        })
        .catch(() => {
          const idx = images.value.findIndex(i => i.tempId === tempId)
          if (idx !== -1) {
            images.value[idx] = {
              ...images.value[idx],
              uploading: false,
              imageLoading: false,
              error: true,
            }
            emitImages()
          }
        })
  }

  target.value = ''
}

//  ELIMINAR
const remove = (index: number) => {
  const img = images.value[index]

  if (!img.id) {
    images.value.splice(index, 1)
    emitImages()
    return
  }

  img.deleting = true

  GalleryService.deleteImage(img.id)
      .then(() => {
        images.value.splice(index, 1)
        ensureSingleCover()
        emitImages()
      })
      .catch((error) => {
        console.error(error)
        img.deleting = false
      })
}

// PORTADA
const setCover = (index: number) => {
  const img = images.value[index]
  if (!img.id) return

  img.settingCover = true

  GalleryService.setCover(img.id)
      .then(() => {
        images.value.forEach((i, idx) => {
          i.is_cover = idx === index
        })
        emitImages()
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        img.settingCover = false
      })
}

const onDragEnd = (event: any) => {
  if (event.oldIndex !== event.newIndex) {
    emitImages()
  }
}

watch(() => props.data, (newData) => {
  if (newData && newData.length) {
    images.value = newData.map((img: IImage) => ({
      id: img.id,
      url: img.url,
      is_cover: !!img.is_cover,
      uploading: false,
      imageLoading: false,
    }))
  }
}, { immediate: true })

defineExpose({
  hasPendingUploads: () => {
    return images.value.some(i => i.uploading)
  }
})

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

/* ADD */
.add-card {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #888;
}

.plus {
  font-size: 40px;
}

/* OVERLAY */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay.error {
  background: rgba(255,0,0,0.5);
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
.icon-btn.delete { top: 5px; right: 5px; }
.icon-btn.eye { top: 5px; left: 5px; }
.icon-btn.star { bottom: 5px; left: 5px; }

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
