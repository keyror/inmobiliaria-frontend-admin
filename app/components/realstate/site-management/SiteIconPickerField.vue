<template>
  <div ref="pickerRef" class="si-picker" :class="classes">
    <label v-if="label" class="form-label">{{ label }}</label>

    <div class="si-trigger" :class="{ open: isOpen }" @click="toggle">
      <span class="si-preview">
        <i v-if="modelValue" :class="modelValue"></i>
        <i v-else class="fas fa-icons si-placeholder-icon"></i>
      </span>
      <span class="si-current-name">{{ currentName || "Seleccionar ícono..." }}</span>
      <i class="fas fa-chevron-down si-chevron"></i>
    </div>

    <div v-if="isOpen" class="si-panel">
      <input
        ref="searchRef"
        v-model="search"
        class="si-search form-control form-control-sm"
        placeholder="Buscar: casa, llave, teléfono, estrella..."
        type="text"
        @click.stop
      />

      <div class="si-grid">
        <button
          v-for="icon in filteredIcons"
          :key="icon.cls"
          class="si-btn"
          :class="{ active: modelValue === icon.cls }"
          type="button"
          :title="icon.name"
          @click.stop="select(icon.cls)"
        >
          <i :class="icon.cls"></i>
          <span class="si-btn-name">{{ icon.name }}</span>
        </button>

        <p v-if="!filteredIcons.length" class="si-no-results">
          Sin resultados para "{{ search }}"
        </p>
      </div>
    </div>

    <small v-if="hint" class="text-muted d-block mt-1">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
import { FA5_FREE_ICONS } from "~/constants/FA5FreeIcons";

interface Props {
  modelValue?: string;
  label?: string;
  hint?: string;
  classes?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: "",
  hint: "",
  classes: "col-md-4",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const pickerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const search = ref("");
const searchRef = ref<HTMLInputElement | null>(null);

const normalizeStr = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const filteredIcons = computed(() => {
  if (!search.value.trim()) return FA5_FREE_ICONS;
  const q = normalizeStr(search.value.trim());
  return FA5_FREE_ICONS.filter(
    (icon) =>
      normalizeStr(icon.name).includes(q) ||
      icon.cls.includes(q) ||
      icon.keywords.some((kw) => normalizeStr(kw).includes(q)),
  );
});

const currentName = computed(
  () => FA5_FREE_ICONS.find((icon) => icon.cls === props.modelValue)?.name ?? "",
);

function toggle() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    search.value = "";
    nextTick(() => searchRef.value?.focus());
  }
}

function close() {
  isOpen.value = false;
}

function select(cls: string) {
  emit("update:modelValue", cls);
  isOpen.value = false;
}

function onDocumentClick(event: MouseEvent) {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>

<style scoped>
.si-picker {
  position: relative;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
}

/* Trigger */
.si-trigger {
  align-items: center;
  background: #fff;
  border: 1px solid rgba(88, 97, 103, 0.28);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 0.6rem;
  min-height: 40px;
  padding: 0.45rem 0.75rem;
  transition: border-color 0.15s ease;
  user-select: none;
}

.si-trigger:hover,
.si-trigger.open {
  border-color: var(--theme-default7, #7f50f3);
}

.si-preview {
  align-items: center;
  border-radius: 6px;
  color: var(--theme-default7, #7f50f3);
  display: flex;
  flex-shrink: 0;
  font-size: 1.05rem;
  height: 26px;
  justify-content: center;
  width: 26px;
}

.si-placeholder-icon {
  color: rgba(88, 97, 103, 0.42) !important;
}

.si-current-name {
  color: #1c2d3a;
  flex: 1;
  font-size: 0.8125rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.si-chevron {
  color: rgba(88, 97, 103, 0.5);
  flex-shrink: 0;
  font-size: 0.7rem;
  transition: transform 0.2s ease;
}

.si-trigger.open .si-chevron {
  transform: rotate(180deg);
}

/* Dropdown panel */
.si-panel {
  background: #fff;
  border: 1px solid rgba(88, 97, 103, 0.18);
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(28, 45, 58, 0.13);
  left: 0;
  margin-top: 4px;
  min-width: 260px;
  padding: 0.65rem;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 200;
}

.si-search {
  font-size: 0.8125rem;
  margin-bottom: 0.6rem;
}

/* Icon grid */
.si-grid {
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  max-height: 256px;
  overflow-y: auto;
  padding-right: 2px;
}

.si-btn {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 7px;
  color: #586167;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 7px 4px;
  text-align: center;
  transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}

.si-btn i {
  font-size: 1.15rem;
  line-height: 1;
}

.si-btn-name {
  display: block;
  font-size: 0.6rem;
  line-height: 1.2;
  max-width: 68px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.si-btn:hover {
  background: rgba(127, 80, 243, 0.08);
  border-color: rgba(127, 80, 243, 0.2);
  color: var(--theme-default7, #7f50f3);
}

.si-btn.active {
  background: rgba(127, 80, 243, 0.12);
  border-color: var(--theme-default7, #7f50f3);
  color: var(--theme-default7, #7f50f3);
}

.si-no-results {
  color: rgba(88, 97, 103, 0.7);
  font-size: 0.8125rem;
  grid-column: 1 / -1;
  margin: 0;
  padding: 1rem 0;
  text-align: center;
}

/* Dark mode */
:global(body.dark-layout) .si-trigger {
  background: #232323;
  border-color: #383434;
}

:global(body.dark-layout) .si-trigger:hover,
:global(body.dark-layout) .si-trigger.open {
  border-color: var(--theme-default7, #7f50f3);
}

:global(body.dark-layout) .si-current-name {
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .si-preview {
  color: var(--theme-default7, #7f50f3);
}

:global(body.dark-layout) .si-placeholder-icon {
  color: rgba(255, 255, 255, 0.3) !important;
}

:global(body.dark-layout) .si-chevron {
  color: rgba(255, 255, 255, 0.4);
}

:global(body.dark-layout) .si-panel {
  background: #232323;
  border-color: #383434;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.38);
}

:global(body.dark-layout) .si-btn {
  color: rgba(255, 255, 255, 0.7);
}

:global(body.dark-layout) .si-btn:hover {
  background: rgba(127, 80, 243, 0.14);
  color: rgba(255, 255, 255, 0.9);
}

:global(body.dark-layout) .si-btn.active {
  background: rgba(127, 80, 243, 0.22);
  color: #fff;
}

:global(body.dark-layout) .si-no-results {
  color: rgba(255, 255, 255, 0.45);
}

:global(body.dark-layout) .si-picker .form-label {
  color: rgba(255, 255, 255, 0.8);
}

:global(body.dark-layout) .si-picker .text-muted {
  color: rgba(255, 255, 255, 0.48) !important;
}

:global(body.dark-layout) .si-search {
  background: #1b1b1b;
  border-color: #383434;
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .si-search::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
</style>
