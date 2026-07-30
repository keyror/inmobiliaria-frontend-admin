<template>
  <div class="col-12 site-block-col">
    <div class="site-block">
      <div class="site-block-header">
        <div class="site-block-meta">
          <span class="site-block-title">{{ title }}</span>
          <span v-if="hint" class="site-block-hint">{{ hint }}</span>
        </div>
        <slot name="action" />
      </div>
      <div class="site-block-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    hint?: string;
  }>(),
  { hint: "" },
);
</script>

<style scoped>
.site-block-col {
  margin-bottom: 0.25rem;
}

.site-block {
  border: 1px solid rgba(88, 97, 103, 0.14);
  border-radius: 14px;
  overflow: hidden;
}

.site-block-header {
  align-items: flex-start;
  background: rgba(88, 97, 103, 0.028);
  border-bottom: 1px solid rgba(88, 97, 103, 0.1);
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  min-height: 52px;
  padding: 0.8rem 1.1rem;
}

.site-block-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  min-width: 0;
}

.site-block-title {
  color: #1c2d3a;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
}

.site-block-hint {
  color: rgba(88, 97, 103, 0.68);
  font-size: 0.78rem;
  line-height: 1.45;
}

.site-block-body {
  padding: 1.1rem;
}

/* ── Shared item styles (global so child editors can use them) ─── */
:global(.site-item) {
  background: rgba(88, 97, 103, 0.025);
  border-left: 3px solid var(--theme-default7);
  border-radius: 0 10px 10px 0;
  margin-bottom: 0.75rem;
  padding: 0.9rem 1rem;
}

:global(.site-item:last-child) {
  margin-bottom: 0;
}

:global(.site-item-header) {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.85rem;
}

:global(.site-item-label) {
  color: rgba(88, 97, 103, 0.6);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

:global(.site-subitem) {
  background: rgba(88, 97, 103, 0.02);
  border: 1px solid rgba(88, 97, 103, 0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  padding: 0.75rem 0.85rem;
}

:global(.site-subitem:last-child) {
  margin-bottom: 0;
}

:global(.site-subitem-header) {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.65rem;
}

:global(.site-subitem-label) {
  color: rgba(88, 97, 103, 0.55);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

:global(.site-empty-state) {
  color: rgba(88, 97, 103, 0.52);
  font-size: 0.8125rem;
  margin: 0.25rem 0 0;
  padding: 0.25rem 0;
  text-align: center;
}

/* ── Dark mode ────────────────────────────────────────────────── */
:global(body.dark-layout) .site-block {
  border-color: #383434;
}

:global(body.dark-layout) .site-block-header {
  background: rgba(255, 255, 255, 0.02);
  border-bottom-color: #383434;
}

:global(body.dark-layout) .site-block-title {
  color: rgba(255, 255, 255, 0.9);
}

:global(body.dark-layout) .site-block-hint {
  color: rgba(255, 255, 255, 0.44);
}

:global(body.dark-layout .site-item) {
  background: rgba(255, 255, 255, 0.025);
  border-left-color: color-mix(in srgb, var(--theme-default7) 60%, #fff);
}

:global(body.dark-layout .site-item-label) {
  color: rgba(255, 255, 255, 0.46);
}

:global(body.dark-layout .site-subitem) {
  background: rgba(255, 255, 255, 0.015);
  border-color: #383434;
}

:global(body.dark-layout .site-subitem-label) {
  color: rgba(255, 255, 255, 0.4);
}

:global(body.dark-layout .site-empty-state) {
  color: rgba(255, 255, 255, 0.36);
}
</style>
