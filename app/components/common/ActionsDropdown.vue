<template>
  <div ref="triggerRef">
    <button
      type="button"
      class="btn btn-dashed color-2 btn-sm"
      @click.stop="toggle"
    >
      <i class="fas fa-ellipsis-v"></i>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="dropdown-menu show shadow-sm actions-dropdown-menu"
        :style="menuStyle"
        @click.stop
      >
        <template v-for="(action, i) in visibleActions" :key="i">
          <hr v-if="action.divider" class="dropdown-divider" />
          <a
            v-else-if="action.href"
            :href="action.href"
            :target="action.target ?? '_self'"
            rel="noopener noreferrer"
            class="dropdown-item d-flex align-items-center gap-2"
            :class="action.variant ? `text-${action.variant}` : ''"
            @click="isOpen = false"
          >
            <i v-if="action.icon" :class="action.icon"></i>
            {{ action.label }}
          </a>
          <button
            v-else
            type="button"
            class="dropdown-item d-flex align-items-center gap-2"
            :class="action.variant ? `text-${action.variant}` : ''"
            @click="handleAction(action)"
          >
            <i v-if="action.icon" :class="action.icon"></i>
            {{ action.label }}
          </button>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { IDropdownAction } from "~/interfaces/IDropdownAction";

interface Props {
  actions: IDropdownAction[];
}

const props = defineProps<Props>();

const triggerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const menuStyle = ref<Record<string, string>>({});

const visibleActions = computed(() =>
  props.actions.filter((a) => a.show !== false),
);

const updatePosition = () => {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  menuStyle.value = {
    position: "fixed",
    top: `${rect.bottom + 4}px`,
    right: `${window.innerWidth - rect.right}px`,
    zIndex: "9999",
    display: "flex",
    flexDirection: "column",
  };
};

const toggle = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) nextTick(updatePosition);
};

const close = () => {
  isOpen.value = false;
};

const handleAction = (action: IDropdownAction) => {
  action.onClick?.();
  isOpen.value = false;
};

onMounted(() => {
  document.addEventListener("click", close);
  // Cerrar si la tabla hace scroll (captura en fase de captura)
  window.addEventListener("scroll", close, true);
});

onUnmounted(() => {
  document.removeEventListener("click", close);
  window.removeEventListener("scroll", close, true);
});
</script>

<!-- sin scoped: necesita apuntar a body.dark-layout y al menu teleportado -->
<style>
body.dark-layout .actions-dropdown-menu {
  background-color: #232323;
  border-color: #383434;
}

body.dark-layout .actions-dropdown-menu .dropdown-item {
  color: rgba(255, 255, 255, 0.8);
}

body.dark-layout .actions-dropdown-menu .dropdown-item:hover,
body.dark-layout .actions-dropdown-menu .dropdown-item:focus {
  background-color: #1a1919;
  color: rgba(255, 255, 255, 0.95);
}

body.dark-layout .actions-dropdown-menu .dropdown-divider {
  border-color: #383434;
}
</style>
