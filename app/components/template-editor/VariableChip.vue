<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'

defineProps<{
  node: { attrs: { id: string; label: string } }
  selected: boolean
}>()
</script>

<template>
  <NodeViewWrapper as="span" class="variable-chip-wrapper" draggable="false">
    <span class="variable-chip" :class="{ selected }">
      <Icon name="lucide:braces" class="chip-icon" />
      {{ node.attrs.label }}
    </span>
  </NodeViewWrapper>
</template>

<style scoped>
.variable-chip-wrapper {
  display: inline;
}

.variable-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 7px 1px 5px;
  border-radius: 4px;
  font-size: 0.78em;
  font-weight: 500;
  font-family: inherit;
  background: rgba(99, 102, 241, 0.12);
  color: #4f46e5;
  border: 1px solid rgba(99, 102, 241, 0.3);
  cursor: default;
  user-select: none;
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 1.6;
  transition: background 0.15s;
}

.variable-chip.selected {
  background: rgba(99, 102, 241, 0.22);
  border-color: #4f46e5;
  outline: 2px solid rgba(99, 102, 241, 0.4);
  outline-offset: 1px;
}

.chip-icon {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  opacity: 0.8;
}

:global(body.dark-layout) .variable-chip {
  background: rgba(129, 140, 248, 0.15);
  color: #a5b4fc;
  border-color: rgba(129, 140, 248, 0.35);
}

:global(body.dark-layout) .variable-chip.selected {
  background: rgba(129, 140, 248, 0.28);
  border-color: #a5b4fc;
  outline-color: rgba(129, 140, 248, 0.45);
}
</style>
