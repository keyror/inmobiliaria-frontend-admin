<template>
  <div class="pdf-viewer-root">
    <!-- Barra de progreso de lectura -->
    <div :class="['pdf-read-bar', readComplete ? 'pdf-read-bar--done' : '']">
      <i :class="['fas', readComplete ? 'fa-check-circle' : 'fa-arrow-down']"></i>
      <span v-if="!readComplete && totalPages > 0">
        Página {{ currentPage }} de {{ totalPages }} — desplázate hasta el final para continuar
      </span>
      <span v-else-if="readComplete"> Documento leído — puedes proceder a firmar </span>
      <span v-else>Cargando documento...</span>
    </div>

    <!-- Contenedor scrollable con las páginas -->
    <div ref="scrollRef" class="pdf-scroll-area" @scroll="onScroll">
      <div v-if="loadError" class="pdf-load-error">
        <i class="fas fa-exclamation-circle me-2"></i>No se pudo cargar el documento.
      </div>

      <div v-else-if="loading" class="pdf-loading-msg">
        <div class="spinner-border spinner-border-sm text-secondary me-2"></div>
        Cargando documento...
      </div>

      <template v-else>
        <canvas
          v-for="n in totalPages"
          :key="n"
          :ref="(el) => setPageRef(el as HTMLCanvasElement | null, n)"
          class="pdf-page"
        ></canvas>
        <!-- Centinela invisible al final — IntersectionObserver lo observa -->
        <div ref="sentinelRef" class="pdf-sentinel"></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  blobUrl: string | null;
}>();

const emit = defineEmits<{
  "read-complete": [];
}>();

const scrollRef = ref<HTMLDivElement | null>(null);
const sentinelRef = ref<HTMLDivElement | null>(null);

const loading = ref(true);
const loadError = ref(false);
const errorDetail = ref('');
const totalPages = ref(0);
const currentPage = ref(1);
const readComplete = ref(false);

const pageCanvases: Record<number, HTMLCanvasElement> = {};

function setPageRef(el: HTMLCanvasElement | null, n: number) {
  if (el) { pageCanvases[n] = el; }
}

// ── PDF.js ───────────────────────────────────────────────────────────────────

let pdfDoc: any = null;

async function loadPdf(url: string) {
  loading.value = true;
  loadError.value = false;

  try {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).href;

    const loadingTask = pdfjsLib.getDocument({ url });
    pdfDoc = await loadingTask.promise;
    totalPages.value = pdfDoc.numPages;

    loading.value = false;

    await nextTick();

    for (let n = 1; n <= pdfDoc.numPages; n++) {
      await renderPage(n);
    }

    setupSentinel();
  } catch (e: any) {
    loadError.value = true;
    loading.value = false;
    errorDetail.value = e?.message ?? String(e);
  }
}

async function renderPage(n: number) {
  const page = await pdfDoc.getPage(n);
  const canvas = pageCanvases[n];
  if (!canvas) { return; }

  // Ancho del contenedor, fallback a 680px
  const containerWidth = scrollRef.value?.clientWidth ?? 680;
  const viewport = page.getViewport({ scale: 1 });
  const scale = (containerWidth - 24) / viewport.width;
  const scaled = page.getViewport({ scale });

  canvas.width = scaled.width;
  canvas.height = scaled.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) { return; }

  await page.render({ canvasContext: ctx, viewport: scaled }).promise;
}

// ── IntersectionObserver sobre el centinela ──────────────────────────────────

let observer: IntersectionObserver | null = null;

function setupSentinel() {
  if (!sentinelRef.value || !scrollRef.value) { return; }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && !readComplete.value) {
        readComplete.value = true;
        emit("read-complete");
        observer?.disconnect();
      }
    },
    {
      root: scrollRef.value,
      threshold: 0.5,
    }
  );

  observer.observe(sentinelRef.value);
}

// ── Página actual por scroll ─────────────────────────────────────────────────

function onScroll() {
  if (!scrollRef.value || totalPages.value === 0) { return; }

  const containerTop = scrollRef.value.scrollTop;
  let found = 1;

  for (let n = 1; n <= totalPages.value; n++) {
    const canvas = pageCanvases[n];
    if (canvas && canvas.offsetTop <= containerTop + 40) {
      found = n;
    }
  }

  currentPage.value = found;
}

// ── Watcher ──────────────────────────────────────────────────────────────────

watch(
  () => props.blobUrl,
  (url) => {
    if (url) { loadPdf(url); }
  },
  { immediate: true }
);

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<style scoped>
.pdf-viewer-root {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-read-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 500;
  background: #fff8e1;
  color: #92400e;
  border-bottom: 1px solid #fde68a;
  transition: background 0.3s, color 0.3s;
}

.pdf-read-bar--done {
  background: #f0fdf4;
  color: #166534;
  border-bottom-color: #bbf7d0;
}

.pdf-scroll-area {
  height: 480px;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.pdf-page {
  display: block;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  background: #fff;
}

.pdf-sentinel {
  height: 1px;
  width: 100%;
  flex-shrink: 0;
}

.pdf-loading-msg,
.pdf-load-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
  font-size: 13px;
}

.pdf-load-error {
  color: #dc2626;
  flex-direction: column;
  gap: 4px;
}

.pdf-error-detail {
  font-size: 11px;
  color: #9b1c1c;
  font-family: monospace;
  word-break: break-all;
  max-width: 90%;
  text-align: center;
}
</style>
