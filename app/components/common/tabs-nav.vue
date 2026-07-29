<template>
  <nav class="admin-theme-tabs">
    <div id="nav-tab" class="nav nav-tabs" role="tablist">
      <button
        v-for="tab in visibleTabs"
        :key="tab.key"
        class="nav-link"
        :class="{ active: modelValue === tab.key }"
        type="button"
        @click="$emit('update:modelValue', tab.key)"
      >
        {{ tab.label
        }}<span v-if="tab.required" class="tab-required" aria-hidden="true">*</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
export interface TabItem {
  key: string
  label: string
  required?: boolean
  visible?: boolean
}

const props = defineProps<{
  modelValue: string
  tabs: TabItem[]
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const visibleTabs = computed(() => props.tabs.filter((t) => t.visible !== false))
</script>
