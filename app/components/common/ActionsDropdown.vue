<template>
  <div ref="triggerRef">
    <button
      type="button"
      class="btn btn-dashed color-4 btn-sm"
      title="Más opciones"
      @click.stop="toggle"
    >
      <Icon name="lucide:more-horizontal" style="width:13px;height:13px" />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="adm-menu"
        :style="menuStyle"
        @click.stop
      >
        <template v-for="(action, i) in visibleActions" :key="i">
          <hr v-if="action.divider" class="adm-divider" />
          <a
            v-else-if="action.href"
            :href="action.href"
            :target="action.target ?? '_self'"
            rel="noopener noreferrer"
            class="adm-item"
            :class="action.variant ? `adm-item--${action.variant}` : ''"
            @click="isOpen = false"
          >
            <i v-if="action.icon" :class="action.icon" class="adm-icon"></i>
            {{ action.label }}
          </a>
          <button
            v-else
            type="button"
            class="adm-item"
            :class="action.variant ? `adm-item--${action.variant}` : ''"
            @click="handleAction(action)"
          >
            <i v-if="action.icon" :class="action.icon" class="adm-icon"></i>
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
  window.addEventListener("scroll", close, true);
});

onUnmounted(() => {
  document.removeEventListener("click", close);
  window.removeEventListener("scroll", close, true);
});
</script>

<!-- sin scoped: el menú se teleporta a body -->
<style>
.adm-menu {
  background: #fff;
  border: 1px solid rgba(88, 97, 103, 0.15);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.adm-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 14px;
  border: none;
  background: transparent;
  font-size: 0.84rem;
  color: #1c2d3a;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  transition: background 0.1s;
  white-space: nowrap;
}

.adm-item:hover { background: rgba(88, 97, 103, 0.07); color: #1c2d3a; }

.adm-item--danger { color: #b83a2d; }
.adm-item--danger:hover { background: rgba(184, 58, 45, 0.07); color: #b83a2d; }

.adm-item--success { color: #1a7a4a; }
.adm-item--success:hover { background: rgba(26, 122, 74, 0.07); color: #1a7a4a; }

.adm-icon { width: 13px; text-align: center; flex-shrink: 0; opacity: 0.75; }

.adm-divider {
  margin: 4px 0;
  border: none;
  border-top: 1px solid rgba(88, 97, 103, 0.12);
}

/* Dark mode */
body.dark-layout .adm-menu {
  background: #232323;
  border-color: #383434;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}

body.dark-layout .adm-item { color: rgba(255, 255, 255, 0.88); }
body.dark-layout .adm-item:hover { background: rgba(255, 255, 255, 0.06); color: rgba(255, 255, 255, 0.88); }

body.dark-layout .adm-item--danger { color: #e06050; }
body.dark-layout .adm-item--danger:hover { background: rgba(224, 96, 80, 0.08); color: #e06050; }

body.dark-layout .adm-item--success { color: #4caf7d; }
body.dark-layout .adm-item--success:hover { background: rgba(76, 175, 125, 0.08); color: #4caf7d; }

body.dark-layout .adm-divider { border-top-color: #383434; }
</style>
