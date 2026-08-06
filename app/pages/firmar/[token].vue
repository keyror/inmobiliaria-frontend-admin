<template>
  <div class="sign-page">
    <!-- Loading inicial -->
    <div v-if="loading" class="sign-loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando enlace de firma...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="sign-error">
      <div class="sign-card text-center">
        <i class="fas fa-exclamation-circle text-danger mb-3" style="font-size:3rem"></i>
        <h4>Enlace no válido</h4>
        <p class="text-muted">{{ error }}</p>
      </div>
    </div>

    <!-- Completado -->
    <div v-else-if="submitted" class="sign-card text-center">
      <i
        class="fas mb-3"
        :class="submittedAction === 'sign' ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'"
        style="font-size:3rem"
      ></i>
      <h4>{{ submittedAction === 'sign' ? '¡Firma registrada!' : 'Firma rechazada' }}</h4>
      <p class="text-muted">
        {{ submittedAction === 'sign'
          ? 'Tu firma fue guardada correctamente. Recibirás el documento firmado por correo cuando todos hayan firmado.'
          : 'Has indicado que rechazas firmar este documento. La inmobiliaria fue notificada.' }}
      </p>
    </div>

    <!-- Contenido principal -->
    <template v-else-if="pageData">
      <div class="sign-header">
        <img v-if="pageData.company.logo_url" :src="pageData.company.logo_url" alt="" class="sign-logo" />
        <div>
          <div class="sign-company-name">{{ pageData.company.name }}</div>
          <div class="sign-doc-title">{{ pageData.document.title }}</div>
          <div v-if="pageData.document.number" class="sign-doc-number">N° {{ pageData.document.number }}</div>
        </div>
      </div>

      <div class="sign-body">
        <!-- Info del firmante -->
        <div class="sign-info-box">
          <div class="sign-info-row">
            <span class="sign-info-label">Firmante</span>
            <span>{{ pageData.signatory.name }}</span>
          </div>
          <div class="sign-info-row">
            <span class="sign-info-label">Rol</span>
            <span>{{ ROLE_LABELS[pageData.signatory.role] ?? pageData.signatory.role }}</span>
          </div>
          <div class="sign-info-row">
            <span class="sign-info-label">Válido hasta</span>
            <span>{{ formatDate(pageData.signatory.token_expires_at) }}</span>
          </div>
        </div>

        <!-- Visor del documento -->
        <div class="sign-pdf-section">
          <h6 class="sign-section-title">Documento a firmar</h6>
          <div v-if="loadingPdf" class="sign-pdf-loading">
            <div class="spinner-border spinner-border-sm text-secondary me-2"></div>
            Cargando documento...
          </div>
          <div v-else-if="pdfUrl" class="sign-pdf-wrapper">
            <iframe :src="pdfUrl" class="sign-pdf-iframe" title="Documento a firmar"></iframe>
          </div>
          <div v-else class="text-muted small">No se pudo cargar el documento.</div>
        </div>

        <!-- Sección de firma -->
        <div class="sign-action-section">
          <h6 class="sign-section-title">Tu firma</h6>

          <!-- Tabs: Dibujar / Subir -->
          <div class="sign-tabs">
            <button
              :class="['btn btn-sm', signMode === 'draw' ? 'btn-gradient color-4' : 'btn-dashed color-2']"
              @click="signMode = 'draw'"
            >
              <i class="fas fa-pen-nib me-1"></i> Dibujar
            </button>
            <button
              :class="['btn btn-sm', signMode === 'upload' ? 'btn-gradient color-4' : 'btn-dashed color-2']"
              @click="signMode = 'upload'"
            >
              <i class="fas fa-upload me-1"></i> Subir imagen
            </button>
          </div>

          <!-- Canvas para dibujar -->
          <div v-if="signMode === 'draw'" class="sign-canvas-wrapper">
            <canvas
              ref="canvasRef"
              class="sign-canvas"
              width="600"
              height="160"
              @mousedown="startDraw"
              @mousemove="draw"
              @mouseup="endDraw"
              @mouseleave="endDraw"
              @touchstart.prevent="startDrawTouch"
              @touchmove.prevent="drawTouch"
              @touchend="endDraw"
            ></canvas>
            <button class="btn btn-dashed color-2 btn-sm align-self-end" type="button" @click="clearCanvas">
              <i class="fas fa-undo me-1"></i> Limpiar
            </button>
          </div>

          <!-- Upload de imagen -->
          <div v-if="signMode === 'upload'" class="sign-upload-wrapper">
            <label class="sign-upload-label">
              <i class="fas fa-image me-2"></i>
              {{ uploadFile ? uploadFile.name : 'Seleccionar imagen de firma (PNG, JPG)' }}
              <input
                ref="fileInputRef"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                class="d-none"
                @change="onFileChange"
              />
            </label>
            <div v-if="uploadPreview" class="sign-upload-preview">
              <img :src="uploadPreview" alt="Vista previa de firma" />
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="sign-actions">
            <button
              class="btn btn-pill btn-gradient color-4 sign-submit-btn"
              :disabled="submitting || !hasSignature"
              @click="submitAction('sign')"
            >
              <i v-if="submitting && submittingAction === 'sign'" class="fas fa-spinner fa-spin me-1"></i>
              <i v-else class="fas fa-pen-nib me-1"></i>
              Firmar documento
            </button>

            <button
              class="btn btn-pill btn-dashed color-1 sign-reject-btn"
              :disabled="submitting"
              @click="showRejectForm = !showRejectForm"
            >
              <i class="fas fa-times me-1"></i> Rechazar firma
            </button>
          </div>

          <!-- Formulario de rechazo -->
          <div v-if="showRejectForm" class="sign-reject-form">
            <label class="form-label small fw-bold">Motivo del rechazo <span class="text-danger">*</span></label>
            <textarea
              v-model="rejectionReason"
              class="form-control"
              rows="3"
              placeholder="Explica el motivo por el que rechazas firmar este documento..."
            ></textarea>
            <button
              class="btn btn-pill btn-gradient color-1 btn-sm mt-2"
              :disabled="!rejectionReason.trim() || submitting"
              @click="submitAction('reject')"
            >
              <i v-if="submitting && submittingAction === 'reject'" class="fas fa-spinner fa-spin me-1"></i>
              Confirmar rechazo
            </button>
          </div>

          <!-- Aviso legal -->
          <p class="sign-legal-note">
            Al firmar, aceptas que esta firma electrónica tiene validez legal en Colombia según la
            <strong>Ley 527 de 1999</strong>. Se registrará tu dirección IP y la fecha/hora de la firma.
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import DocumentSignatoryService from "~/services/DocumentSignatoryService";
import type { ISigningPageData } from "~/interfaces/IDocumentSignatory";

definePageMeta({
  layout: "login",
  auth: false,
});

useHead({ title: "Firma electrónica de documento" });

const route = useRoute();
const token = route.params.token as string;

const ROLE_LABELS: Record<string, string> = {
  arrendatario: "Arrendatario",
  arrendador: "Arrendador",
  codeudor: "Codeudor",
  propietario: "Propietario",
  custom: "Otro",
};

// ── Estado ───────────────────────────────────────────────────────────────────
const loading = ref(true);
const error = ref<string | null>(null);
const pageData = ref<ISigningPageData | null>(null);
const loadingPdf = ref(false);
const pdfUrl = ref<string | null>(null);

const signMode = ref<"draw" | "upload">("draw");
const canvasRef = ref<HTMLCanvasElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const uploadFile = ref<File | null>(null);
const uploadPreview = ref<string | null>(null);

const showRejectForm = ref(false);
const rejectionReason = ref("");
const submitting = ref(false);
const submittingAction = ref<"sign" | "reject" | null>(null);
const submitted = ref(false);
const submittedAction = ref<"sign" | "reject" | null>(null);

let isDrawing = false;

// ── Computed ─────────────────────────────────────────────────────────────────
const hasSignature = computed(() => {
  if (signMode.value === "upload") return !!uploadFile.value;
  // Para el canvas, revisamos si tiene trazos
  return canvasHasContent.value;
});

const canvasHasContent = ref(false);

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await DocumentSignatoryService.getSigningPage(token);
    pageData.value = res?.data ?? null;

    if (pageData.value) {
      loadingPdf.value = true;
      try {
        const blob = await DocumentSignatoryService.getDocumentBlob(token);
        pdfUrl.value = URL.createObjectURL(blob);
      } catch {
        // El PDF no es bloqueante — se puede firmar igual
      } finally {
        loadingPdf.value = false;
      }
    }
  } catch (err: any) {
    error.value = err?.message ?? "El enlace de firma no es válido o ha expirado.";
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value);
});

// ── Canvas drawing ────────────────────────────────────────────────────────────
const getCtx = () => canvasRef.value?.getContext("2d") ?? null;

const getPos = (e: MouseEvent) => {
  const rect = canvasRef.value!.getBoundingClientRect();
  const scaleX = canvasRef.value!.width / rect.width;
  const scaleY = canvasRef.value!.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
};

const getPosTouch = (e: TouchEvent) => {
  const rect = canvasRef.value!.getBoundingClientRect();
  const scaleX = canvasRef.value!.width / rect.width;
  const scaleY = canvasRef.value!.height / rect.height;
  const touch = e.touches[0];
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY,
  };
};

const startDraw = (e: MouseEvent) => {
  isDrawing = true;
  const ctx = getCtx();
  if (!ctx) return;
  const { x, y } = getPos(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const draw = (e: MouseEvent) => {
  if (!isDrawing) return;
  const ctx = getCtx();
  if (!ctx) return;
  const { x, y } = getPos(e);
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#1a1a2e";
  ctx.lineTo(x, y);
  ctx.stroke();
  canvasHasContent.value = true;
};

const endDraw = () => { isDrawing = false; };

const startDrawTouch = (e: TouchEvent) => {
  isDrawing = true;
  const ctx = getCtx();
  if (!ctx) return;
  const { x, y } = getPosTouch(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const drawTouch = (e: TouchEvent) => {
  if (!isDrawing) return;
  const ctx = getCtx();
  if (!ctx) return;
  const { x, y } = getPosTouch(e);
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#1a1a2e";
  ctx.lineTo(x, y);
  ctx.stroke();
  canvasHasContent.value = true;
};

const clearCanvas = () => {
  const ctx = getCtx();
  if (!ctx || !canvasRef.value) return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  canvasHasContent.value = false;
};

const canvasToBlob = (): Promise<Blob | null> =>
  new Promise((resolve) => {
    if (!canvasRef.value) return resolve(null);
    canvasRef.value.toBlob((b) => resolve(b), "image/png");
  });

// ── Upload ────────────────────────────────────────────────────────────────────
const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  uploadFile.value = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => { uploadPreview.value = ev.target?.result as string; };
    reader.readAsDataURL(file);
  } else {
    uploadPreview.value = null;
  }
};

// ── Submit ────────────────────────────────────────────────────────────────────
const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
};

const submitAction = async (action: "sign" | "reject") => {
  if (submitting.value) return;
  submitting.value = true;
  submittingAction.value = action;

  try {
    const fd = new FormData();
    fd.append("action", action);

    if (action === "sign") {
      if (signMode.value === "draw") {
        const blob = await canvasToBlob();
        if (!blob) throw new Error("No se pudo capturar la firma del canvas.");
        fd.append("signature", blob, "firma.png");
        fd.append("signature_type", "drawn");
      } else {
        if (!uploadFile.value) throw new Error("Selecciona una imagen de firma.");
        fd.append("signature", uploadFile.value);
        fd.append("signature_type", "uploaded");
      }
    } else {
      if (!rejectionReason.value.trim()) throw new Error("Indica el motivo del rechazo.");
      fd.append("rejection_reason", rejectionReason.value.trim());
    }

    await DocumentSignatoryService.submitSignature(token, fd);
    submittedAction.value = action;
    submitted.value = true;
  } catch (err: any) {
    alert(err?.message ?? "Error al procesar la firma. Intenta de nuevo.");
  } finally {
    submitting.value = false;
    submittingAction.value = null;
  }
};
</script>

<style scoped>
.sign-page {
  min-height: 100vh;
  background: #f4f6fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 48px;
}

.sign-loading,
.sign-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.sign-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  padding: 40px 32px;
  max-width: 480px;
  width: 100%;
}

.sign-header {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;
  width: 100%;
  max-width: 780px;
  margin-bottom: 0;
}

.sign-logo {
  max-height: 48px;
  max-width: 120px;
  object-fit: contain;
}

.sign-company-name {
  font-weight: 700;
  font-size: 1rem;
  color: #1a1a2e;
}

.sign-doc-title {
  font-size: 0.92rem;
  color: #444;
  margin-top: 2px;
}

.sign-doc-number {
  font-size: 0.8rem;
  color: #888;
}

.sign-body {
  background: #fff;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  padding: 24px;
  width: 100%;
  max-width: 780px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sign-info-box {
  background: #f8f9fc;
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;
}

.sign-info-row {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.sign-info-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 2px;
}

.sign-section-title {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #666;
  border-left: 3px solid #6366f1;
  padding-left: 8px;
  margin-bottom: 12px;
}

.sign-pdf-section,
.sign-action-section {
  display: flex;
  flex-direction: column;
}

.sign-pdf-loading {
  color: #888;
  font-size: 0.88rem;
  padding: 12px 0;
}

.sign-pdf-wrapper {
  border: 1px solid #e0e4ef;
  border-radius: 8px;
  overflow: hidden;
}

.sign-pdf-iframe {
  width: 100%;
  height: 500px;
  border: none;
  display: block;
}

.sign-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.sign-canvas-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sign-canvas {
  border: 2px dashed #c0c4d6;
  border-radius: 8px;
  width: 100%;
  height: 160px;
  background: #fafbff;
  cursor: crosshair;
  touch-action: none;
}


.sign-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sign-upload-label {
  border: 2px dashed #c0c4d6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  font-size: 0.88rem;
  color: #666;
  transition: border-color 0.15s;
}

.sign-upload-label:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.sign-upload-preview img {
  max-height: 120px;
  max-width: 100%;
  border-radius: 6px;
  border: 1px solid #e0e4ef;
}

.sign-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.sign-submit-btn,
.sign-reject-btn {
  font-size: 0.9rem;
}

.sign-reject-form {
  margin-top: 12px;
  padding: 16px;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.sign-legal-note {
  font-size: 0.75rem;
  color: #888;
  margin-top: 16px;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .sign-actions {
    flex-direction: column;
  }
  .sign-submit-btn,
  .sign-reject-btn {
    width: 100%;
  }
  .sign-pdf-iframe {
    height: 340px;
  }
}
</style>
