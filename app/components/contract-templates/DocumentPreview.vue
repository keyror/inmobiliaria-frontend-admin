<script setup lang="ts">
import TemplateSectionService from '~/services/TemplateSectionService'

interface Props {
  show: boolean
  templateKey: string
  templateLabel: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
}>()

const loading = ref(false)
const previewError = ref(false)
const previewBlobUrl = ref<string | null>(null)
const iframeRef = ref<HTMLIFrameElement | null>(null)

watch(
  () => props.show,
  async (open) => {
    if (!open) return
    loading.value = true
    previewError.value = false
    if (previewBlobUrl.value) {
      URL.revokeObjectURL(previewBlobUrl.value)
      previewBlobUrl.value = null
    }
    try {
      previewBlobUrl.value = await TemplateSectionService.preview(props.templateKey)
    } catch {
      previewError.value = true
    } finally {
      loading.value = false
    }
  },
)

watch(
  () => props.show,
  (open) => {
    if (!open && previewBlobUrl.value) {
      URL.revokeObjectURL(previewBlobUrl.value)
      previewBlobUrl.value = null
    }
  },
)

function print() {
  iframeRef.value?.contentWindow?.print()
}

function close() {
  emit('update:show', false)
}
</script>

<template>
  <CommonModal
    :show="show"
    :title="`Vista previa — ${templateLabel}`"
    size="xl"
    @update:show="close"
    @close="close"
  >
    <!-- Loading -->
    <div v-if="loading" class="preview-loading">
      <Icon name="lucide:loader-circle" class="spin" style="width:32px;height:32px" />
      <p class="mt-2 text-muted small">Generando vista previa con DomPDF…</p>
    </div>

    <!-- iframe con el PDF embebido -->
    <div v-else-if="previewBlobUrl" class="preview-wrapper">
      <iframe
        ref="iframeRef"
        class="preview-iframe"
        :src="previewBlobUrl"
        title="Vista previa del documento"
      />
      <p class="preview-notice">
        <Icon name="lucide:info" style="width:13px;height:13px;flex-shrink:0" />
        Los valores resaltados son datos de muestra. Este PDF es idéntico al que exporta el sistema.
      </p>
    </div>

    <!-- Error -->
    <div v-else-if="previewError" class="preview-loading text-muted">
      <Icon name="lucide:file-x" style="width:32px;height:32px;opacity:0.4" />
      <p class="mt-2 small">No se pudo generar la vista previa. Verifica que el servidor esté activo y que la plantilla tenga secciones.</p>
    </div>

    <template #actions>
      <button
        type="button"
        class="btn btn-pill btn-gradient color-4 btn-sm"
        :disabled="!previewBlobUrl || loading"
        @click="print"
      >
        <Icon name="lucide:printer" class="me-1" style="width:13px;height:13px" />
        Imprimir
      </button>
    </template>
  </CommonModal>
</template>

<style scoped>
.preview-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.preview-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-iframe {
  width: 100%;
  height: 70vh;
  border: 1px solid rgba(88, 97, 103, 0.15);
  border-radius: 6px;
  background: #fff;
}

.preview-notice {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.76rem;
  color: rgba(28, 45, 58, 0.55);
  margin: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spin { animation: spin 1s linear infinite; display: inline-block; }

/* Dark mode */
:global(body.dark-layout) .preview-iframe {
  border-color: #383434;
  background: #232323;
}

:global(body.dark-layout) .preview-notice {
  color: rgba(255, 255, 255, 0.42);
}
</style>
