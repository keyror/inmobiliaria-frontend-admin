<template>
  <div class="vfy-page">

    <!-- Loading -->
    <div v-if="pending" class="vfy-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Verificando...</span>
      </div>
      <p class="mt-3 text-muted small">Verificando documento...</p>
    </div>

    <!-- Error -->
    <div v-else-if="!doc" class="vfy-center">
      <div class="vfy-card text-center" style="max-width:440px; width:100%;">
        <i class="fas fa-shield-alt text-danger mb-3" style="font-size:2.8rem"></i>
        <h5 class="fw-bold mb-2">No se pudo verificar</h5>
        <p class="text-muted mb-1">{{ errorMessage }}</p>
        <p class="text-muted small">Comprueba que el número de documento sea correcto.</p>
      </div>
    </div>

    <!-- Resultado -->
    <div v-else class="vfy-container">

      <!-- Header -->
      <div class="vfy-header">
        <div class="vfy-shield">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div>
          <div class="vfy-header-title">Verificación de Firma Electrónica</div>
          <div class="vfy-header-sub">Ley 527 de 1999 — República de Colombia</div>
        </div>
        <div class="vfy-doc-number ms-auto text-end">
          <div class="text-muted small">N° Documento</div>
          <div class="vfy-mono fw-bold">{{ doc.number }}</div>
        </div>
      </div>

      <!-- Banner firmado -->
      <div class="vfy-status-banner">
        <i class="fas fa-check-circle vfy-status-icon"></i>
        <div>
          <div class="vfy-status-title">Documento firmado electrónicamente</div>
          <div class="vfy-status-sub">Firma completada el {{ formatDateTime(doc.signed_at) }}</div>
        </div>
      </div>

      <!-- Info del documento -->
      <div class="vfy-card">
        <div class="vfy-section-title">Información del Documento</div>
        <div class="vfy-field-grid">
          <div class="vfy-field">
            <span class="vfy-label">Título</span>
            <span class="vfy-value">{{ doc.title }}</span>
          </div>
          <div class="vfy-field">
            <span class="vfy-label">Generado</span>
            <span class="vfy-value">{{ formatDateTime(doc.generated_at) }}</span>
          </div>
          <div class="vfy-field">
            <span class="vfy-label">Expedido por</span>
            <span class="vfy-value">
              {{ company?.name }}
              <span v-if="company?.nit" class="text-muted small"> — NIT {{ company.nit }}</span>
            </span>
          </div>
          <div class="vfy-field">
            <span class="vfy-label">Verificado el</span>
            <span class="vfy-value">{{ verifiedAt ? formatDateTime(verifiedAt) : '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Firmantes -->
      <div class="vfy-card">
        <div class="vfy-section-title">Registro de Firmantes</div>
        <div class="vfy-sig-list">
          <div v-for="(sig, idx) in sigs" :key="idx" class="vfy-sig-row">
            <div class="vfy-sig-avatar">{{ sig.name?.charAt(0)?.toUpperCase() ?? '?' }}</div>
            <div class="vfy-sig-info">
              <div class="fw-bold" style="font-size:0.88rem">{{ sig.name }}</div>
              <div class="text-muted" style="font-size:0.78rem">{{ ROLE_LABELS[sig.role] ?? sig.role }}</div>
              <div style="font-size:0.75rem; color:#9ca3af; margin-top:2px;">
                {{ formatDateTime(sig.signed_at) }}
                <span v-if="sig.ip_address" class="ms-1">· IP: {{ sig.ip_address }}</span>
              </div>
            </div>
            <div class="vfy-sig-check">
              <i class="fas fa-check"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Integridad -->
      <div class="vfy-card">
        <div class="vfy-section-title">Integridad del Documento</div>
        <div class="vfy-field mb-2">
          <span class="vfy-label">Hash SHA-256 del PDF firmado</span>
          <code class="vfy-hash">{{ doc.pdf_hash }}</code>
        </div>
        <div v-if="doc.has_tsr" class="vfy-tsr-badge">
          <i class="fas fa-clock vfy-tsr-icon text-primary"></i>
          <div>
            <div class="fw-bold" style="font-size:0.8rem; color:#1d4ed8">Sello de tiempo RFC 3161 (FreeTSA)</div>
            <div style="font-size:0.75rem; color:#3b82f6">Sellado el {{ formatDateTime(doc.tsa_stamped_at) }}</div>
          </div>
        </div>
      </div>

      <!-- Pie legal -->
      <div class="vfy-legal text-muted small text-center">
        <p>
          Este documento fue firmado electrónicamente al amparo de la
          <strong>Ley 527 de 1999</strong> de la República de Colombia.
          La firma electrónica tiene plena validez legal y no requiere firma manuscrita ni autenticación notarial.
        </p>
        <p class="mt-1">Documento N° <strong>{{ doc.number }}</strong></p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'login', auth: false });

const route = useRoute();
const numParam = route.params.number;
const number = (Array.isArray(numParam) ? numParam[0] : numParam) as string;

const ROLE_LABELS: Record<string, string> = {
  arrendatario: 'Arrendatario',
  arrendador: 'Arrendador',
  codeudor: 'Codeudor / Garante',
  propietario: 'Propietario',
};

const { data, pending, error } = await useAsyncData(
  `verify-doc-${number}`,
  () => $fetch<any>(`/api/public/documents/${encodeURIComponent(number)}/verify`),
  { default: () => null },
);

const doc = computed<Record<string, any> | null>(() => {
  const d = data.value;
  if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
  const document = (d as any).document;
  if (!document || typeof document !== 'object') return null;
  return document;
});

const company = computed<Record<string, any> | null>(() => {
  const d = data.value;
  if (!d || typeof d !== 'object') return null;
  return (d as any).company ?? null;
});

const sigs = computed<any[]>(() => {
  const d = data.value;
  if (!d || typeof d !== 'object') return [];
  const s = (d as any).signatories;
  return Array.isArray(s) ? s : [];
});

const verifiedAt = ref<string | null>(null);
onMounted(() => { verifiedAt.value = new Date().toISOString(); });

const errorMessage = computed((): string => {
  if (!error.value) return 'No fue posible verificar el documento en este momento.';
  const status = (error.value as any)?.status ?? (error.value as any)?.statusCode;
  if (status === 404) return 'No se encontró ningún documento con ese número.';
  if (status === 422) return 'Este documento aún no ha sido firmado electrónicamente.';
  return 'No fue posible verificar el documento en este momento.';
});

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota',
    });
  } catch {
    return iso;
  }
}

useHead({
  title: doc.value?.number
    ? `Verificación — Documento N° ${doc.value.number}`
    : `Verificación — ${number}`,
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});
</script>

<style scoped>
.vfy-page {
  min-height: 100vh;
  background: #f4f6fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 48px;
}

/* Centrado para loading/error */
.vfy-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

/* Contenedor principal del resultado */
.vfy-container {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Header */
.vfy-header {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
  padding: 18px 22px;
}
.vfy-shield {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ede9fe;
  color: #6366f1;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.vfy-header-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a2e;
}
.vfy-header-sub {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 2px;
}
.vfy-doc-number { font-size: 0.82rem; }
.vfy-mono { font-family: 'Courier New', monospace; font-size: 0.85rem; }

/* Banner estado */
.vfy-status-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #d1fae5;
  border-left: 4px solid #059669;
  border-radius: 0 0 8px 8px;
  padding: 14px 22px;
  margin-top: -16px;
}
.vfy-status-icon {
  font-size: 1.6rem;
  color: #059669;
  flex-shrink: 0;
}
.vfy-status-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #065f46;
}
.vfy-status-sub {
  font-size: 0.78rem;
  color: #047857;
  margin-top: 2px;
}

/* Cards */
.vfy-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
  padding: 18px 22px;
}

.vfy-section-title {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  border-left: 3px solid #6366f1;
  padding-left: 8px;
  margin-bottom: 14px;
}

/* Grid de campos */
.vfy-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 500px) { .vfy-field-grid { grid-template-columns: 1fr; } }

.vfy-field { display: flex; flex-direction: column; gap: 2px; }
.vfy-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  font-weight: 600;
}
.vfy-value { font-size: 0.85rem; color: #1a1a2e; }

/* Hash */
.vfy-hash {
  display: block;
  word-break: break-all;
  background: #f8f9fc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 10px;
  margin-top: 4px;
  font-size: 0.72rem;
  color: #374151;
  line-height: 1.7;
}

/* TSR badge */
.vfy-tsr-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 10px 14px;
  margin-top: 12px;
}
.vfy-tsr-icon { font-size: 1.1rem; flex-shrink: 0; }

/* Firmantes */
.vfy-sig-list { display: flex; flex-direction: column; gap: 10px; }
.vfy-sig-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fc;
  border-radius: 8px;
  padding: 10px 14px;
}
.vfy-sig-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.vfy-sig-info { flex: 1; min-width: 0; }
.vfy-sig-check {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #d1fae5;
  color: #059669;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Legal */
.vfy-legal { padding: 4px 8px; line-height: 1.6; }
</style>
