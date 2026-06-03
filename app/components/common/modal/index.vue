<script setup>
import { onBeforeUnmount, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "lg", // sm, lg, xl
    validator: (value) => ["sm", "lg", "xl"].includes(value),
  },
});

const emit = defineEmits(["update:show", "close"]);

const closeModal = () => {
  emit("update:show", false);
  emit("close");
};

// Manejar overflow del body
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="show"
        class="modal-backdrop fade show common-modal-backdrop"
        @click="closeModal"
      ></div>
    </Transition>

    <!-- Modal -->
    <Transition name="modal">
      <div
        v-if="show"
        :style="{ display: 'block' }"
        aria-modal="true"
        class="modal fade show common-modal"
        role="dialog"
        tabindex="-1"
        @keydown.esc="closeModal"
      >
        <div :class="`modal-${size}`" class="modal-dialog common-modal-dialog">
          <div class="modal-content common-modal-content">
            <!-- Header -->
            <div class="modal-header common-modal-header">
              <h5 class="modal-title common-modal-title">{{ title }}</h5>
              <button
                aria-label="Cerrar modal"
                class="btn btn-pill btn-dashed color-4 common-modal-close"
                title="Cerrar"
                type="button"
                @click="closeModal"
              >
                X
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body common-modal-body">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div class="modal-footer common-modal-footer">
              <button
                class="btn btn-pill btn-dashed color-4 common-modal-action"
                type="button"
                @click="closeModal"
              >
                Cerrar
              </button>
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s linear;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Z-index */
.modal-backdrop {
  z-index: 1050;
}

.modal {
  z-index: 1055;
}

.common-modal-backdrop {
  background: rgba(12, 16, 22, 0.62);
  backdrop-filter: blur(3px);
}

.common-modal-dialog {
  margin-top: 5vh;
}

.common-modal-content {
  overflow: hidden;
  color: #1c2d3a;
  background: #ffffff;
  border: 1px solid rgba(88, 97, 103, 0.12);
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
}

.common-modal-header {
  align-items: flex-start;
  gap: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), #f7f7fe);
  border-bottom: 1px solid rgba(88, 97, 103, 0.1);
}

.common-modal-title {
  color: #586167;
  line-height: 1.35;
}

.common-modal-close {
  flex: 0 0 auto;
  width: 38px;
  min-width: 38px;
  height: 38px;
  padding: 0;
  line-height: 1;
}

.common-modal-body {
  color: rgba(28, 45, 58, 0.78);
}

.common-modal-body :deep(.card) {
  color: #1c2d3a;
  background: #ffffff;
  border: 1px solid rgba(88, 97, 103, 0.12);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.05);
}

.common-modal-body :deep(.text-muted),
.common-modal-body :deep(small) {
  color: rgba(28, 45, 58, 0.58) !important;
}

.common-modal-footer {
  background: rgba(247, 247, 254, 0.72);
  border-top: 1px solid rgba(88, 97, 103, 0.1);
}

:global(body.dark-layout .common-modal-backdrop) {
  background: rgba(0, 0, 0, 0.76);
}

:global(body.dark-layout .common-modal-content) {
  color: rgba(255, 255, 255, 0.82);
  background: #232323;
  border-color: #383434;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.48);
}

:global(body.dark-layout .common-modal-header) {
  background: linear-gradient(
    135deg,
    rgba(35, 35, 35, 0.98),
    rgba(40, 39, 39, 0.94)
  );
  border-bottom-color: #383434;
}

:global(body.dark-layout .common-modal-title) {
  color: rgba(255, 255, 255, 0.92);
}

:global(body.dark-layout .common-modal-body) {
  color: rgba(255, 255, 255, 0.76);
}

:global(body.dark-layout .common-modal-body .card) {
  color: rgba(255, 255, 255, 0.82);
  background: #1b1b1b;
  border-color: #383434;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
}

:global(body.dark-layout .common-modal-body strong) {
  color: rgba(255, 255, 255, 0.92);
}

:global(body.dark-layout .common-modal-body .text-muted),
:global(body.dark-layout .common-modal-body small) {
  color: rgba(255, 255, 255, 0.58) !important;
}

:global(body.dark-layout .common-modal-body .form-control) {
  color: rgba(255, 255, 255, 0.86);
  background-color: #1b1b1b;
  border-color: #383434;
}

:global(body.dark-layout .common-modal-body .form-control::placeholder) {
  color: rgba(255, 255, 255, 0.48);
}

:global(body.dark-layout .common-modal-body .dropdown),
:global(body.dark-layout .common-modal-body .dropdown-menu) {
  color: rgba(255, 255, 255, 0.76);
  background-color: #1b1b1b;
  border-color: #383434;
}

:global(body.dark-layout .common-modal-body .dropdown-item) {
  color: rgba(255, 255, 255, 0.76);
}

:global(body.dark-layout .common-modal-body .dropdown-item:hover),
:global(body.dark-layout .common-modal-body .dropdown-item:focus) {
  color: rgba(255, 255, 255, 0.92);
  background-color: #282727;
}

:global(body.dark-layout .common-modal-footer) {
  background: rgba(27, 27, 27, 0.76);
  border-top-color: #383434;
}

:global(body.dark-layout .common-modal-close),
:global(body.dark-layout .common-modal-action) {
  color: rgba(255, 255, 255, 0.82);
  border-color: #383434;
}
</style>
