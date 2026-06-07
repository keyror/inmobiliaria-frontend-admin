<template>
  <div class="realstate-image-picker" :class="classes">
    <label v-if="label" class="form-label">{{ label }}</label>
    <Gallery
      ref="galleryRef"
      :add-item-classes="resolvedAddItemClasses"
      :data="galleryData"
      :item-classes="itemClasses"
      :max-images="maxImages"
      @updateImages="handleUpdateImages"
    />
    <small v-if="hint" class="text-muted d-block mt-1">
      {{ hint }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { Gallery } from "#components";
import type { IImage, IImagePayload } from "~/interfaces/IImageItem";

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[] | null;
    label?: string;
    hint?: string;
    classes?: string;
    itemClasses?: string;
    addItemClasses?: string;
    maxImages?: number;
  }>(),
  {
    modelValue: "",
    label: "",
    hint: "",
    classes: "col-12",
    itemClasses: "col-12 col-sm-6 col-lg-3",
    addItemClasses: "",
    maxImages: 1,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string | string[]): void;
}>();

const galleryRef = ref<InstanceType<typeof Gallery> | null>(null);
const imageIdsByUrl = ref(new Map<string, string | null>());

const resolvedAddItemClasses = computed(
  () => props.addItemClasses || props.itemClasses,
);

const shouldEmitArray = computed(
  () => Array.isArray(props.modelValue) || props.maxImages > 1,
);

const urls = computed(() => {
  const values = Array.isArray(props.modelValue)
    ? props.modelValue
    : [props.modelValue];

  return values
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter(Boolean);
});

const galleryData = computed<IImage[]>(() =>
  urls.value.map((url, index) => ({
    id: imageIdsByUrl.value.get(url) ?? null,
    url,
    is_cover: index === 0,
    sort_order: index,
  })),
);

const handleUpdateImages = (images: IImagePayload[]) => {
  images.forEach((image) => {
    if (image.url) imageIdsByUrl.value.set(image.url, image.id ?? null);
  });

  const imageUrls = images.map((image) => image.url.trim()).filter(Boolean);

  emit(
    "update:modelValue",
    shouldEmitArray.value ? imageUrls : (imageUrls[0] ?? ""),
  );
};

defineExpose({
  hasPendingUploads: () => galleryRef.value?.hasPendingUploads?.() ?? false,
});
</script>

<style scoped>
:global(body.dark-layout) .realstate-image-picker :deep(.image-card) {
  background: #1f1f1f;
  border-color: rgba(255, 255, 255, 0.14);
}

:global(body.dark-layout) .realstate-image-picker :deep(.add-card) {
  color: rgba(255, 255, 255, 0.62);
}

:global(body.dark-layout) .realstate-image-picker :deep(.plus) {
  color: rgba(255, 255, 255, 0.7);
}

:global(body.dark-layout) .realstate-image-picker .form-label,
:global(body.dark-layout) .realstate-image-picker .text-muted {
  color: rgba(255, 255, 255, 0.64) !important;
}
</style>
