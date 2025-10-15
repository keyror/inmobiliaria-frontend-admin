<script setup>
import {watch} from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'lg', // sm, lg, xl
    validator: (value) => ['sm', 'lg', 'xl'].includes(value)
  }
});

const emit = defineEmits(['update:show', 'close']);

const closeModal = () => {
  emit('update:show', false);
  emit('close');
};

// Manejar overflow del body
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="show"
           class="modal-backdrop fade show"
           @click="closeModal"></div>
    </Transition>

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="show"
           :style="{ display: 'block' }"
           aria-modal="true"
           class="modal fade show"
           role="dialog"
           tabindex="-1"
           @keydown.esc="closeModal">
        <div :class="`modal-${size}`" class="modal-dialog">
          <div class="modal-content">
            <!-- Header -->
            <div class="modal-header">
              <h5 class="modal-title">{{ title }}</h5>
              <button class="btn btn-pill btn-dashed color-4"
                      type="button"
                      @click="closeModal">
                X
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <button class="btn btn-pill btn-dashed color-4"
                      type="button"
                      @click="closeModal">
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
</style>
