<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { VariableExtension } from '~/extensions/VariableExtension'
import type { ITemplateSectionVariableGroup } from '~/interfaces/ITemplateSection'

interface Props {
  modelValue: Record<string, any> | null
  variableGroups: ITemplateSectionVariableGroup[]
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Escribe el contenido de la cláusula…',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, any> | null): void
}>()

const editor = useEditor({
  editable: !props.disabled,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: props.placeholder }),
    VariableExtension,
  ],
  content: props.modelValue ?? undefined,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getJSON())
  },
})

watch(
  () => props.modelValue,
  (val) => {
    if (!editor.value) return
    const current = JSON.stringify(editor.value.getJSON())
    const incoming = JSON.stringify(val)
    if (current !== incoming) {
      editor.value.commands.setContent(val ?? '', false)
    }
  },
)

watch(
  () => props.disabled,
  (val) => editor.value?.setEditable(!val),
)

function insertVariable(id: string, label: string) {
  editor.value?.chain().focus().insertVariable({ id, label }).run()
}

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div class="tpl-editor" :class="{ 'tpl-editor--disabled': disabled }">
    <!-- Toolbar -->
    <div v-if="editor" class="tpl-toolbar">
      <button
        type="button"
        class="tpl-tb-btn"
        :class="{ active: editor.isActive('bold') }"
        title="Negrita"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <Icon name="lucide:bold" />
      </button>
      <button
        type="button"
        class="tpl-tb-btn"
        :class="{ active: editor.isActive('italic') }"
        title="Cursiva"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <Icon name="lucide:italic" />
      </button>
      <button
        type="button"
        class="tpl-tb-btn"
        :class="{ active: editor.isActive('bulletList') }"
        title="Lista"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <Icon name="lucide:list" />
      </button>
      <button
        type="button"
        class="tpl-tb-btn"
        :class="{ active: editor.isActive('orderedList') }"
        title="Lista numerada"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <Icon name="lucide:list-ordered" />
      </button>
      <div class="tpl-tb-divider" />
      <button
        type="button"
        class="tpl-tb-btn"
        :disabled="!editor.can().undo()"
        title="Deshacer"
        @click="editor.chain().focus().undo().run()"
      >
        <Icon name="lucide:undo-2" />
      </button>
      <button
        type="button"
        class="tpl-tb-btn"
        :disabled="!editor.can().redo()"
        title="Rehacer"
        @click="editor.chain().focus().redo().run()"
      >
        <Icon name="lucide:redo-2" />
      </button>
    </div>

    <!-- Editor area -->
    <EditorContent class="tpl-content" :editor="editor" />

    <!-- Variable groups panel -->
    <div v-if="variableGroups.length" class="tpl-variables">
      <p class="tpl-vars-title">
        <Icon name="lucide:braces" />
        Variables disponibles — clic para insertar
      </p>
      <div v-for="group in variableGroups" :key="group.group" class="tpl-var-group">
        <p class="tpl-var-group-name">{{ group.group }}</p>
        <div class="tpl-var-chips">
          <button
            v-for="v in group.variables"
            :key="v.id"
            type="button"
            class="tpl-var-chip"
            :disabled="disabled"
            :title="v.id"
            @click="insertVariable(v.id, v.label)"
          >
            {{ v.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---- Container ---- */
.tpl-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(88, 97, 103, 0.18);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.tpl-editor--disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* ---- Toolbar ---- */
.tpl-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  border-bottom: 1px solid rgba(88, 97, 103, 0.12);
  background: #f7f7fe;
  flex-wrap: wrap;
}

.tpl-tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 5px;
  cursor: pointer;
  color: #586167;
  transition: background 0.12s, color 0.12s;
}

.tpl-tb-btn:hover:not(:disabled) {
  background: rgba(88, 97, 103, 0.1);
  color: #1c2d3a;
}

.tpl-tb-btn.active {
  background: color-mix(in srgb, var(--theme-default7) 12%, transparent);
  color: var(--theme-default7);
}

.tpl-tb-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.tpl-tb-divider {
  width: 1px;
  height: 20px;
  background: rgba(88, 97, 103, 0.15);
  margin: 0 4px;
}

/* ---- Editor content ---- */
.tpl-content {
  flex: 1;
  min-height: 140px;
  padding: 12px 14px;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #1c2d3a;
  cursor: text;
}

:deep(.ProseMirror) {
  outline: none;
  min-height: 120px;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: rgba(28, 45, 58, 0.38);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.4em;
}

/* ---- Variable panel ---- */
.tpl-variables {
  padding: 10px 14px 12px;
  border-top: 1px solid rgba(88, 97, 103, 0.1);
  background: #f7f7fe;
}

.tpl-vars-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #586167;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px;
}

.tpl-var-group {
  margin-bottom: 8px;
}

.tpl-var-group:last-child {
  margin-bottom: 0;
}

.tpl-var-group-name {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(28, 45, 58, 0.6);
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tpl-var-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tpl-var-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 4px;
  font-size: 0.76rem;
  font-weight: 500;
  background: color-mix(in srgb, var(--theme-default7) 10%, transparent);
  color: var(--theme-default7);
  border: 1px solid color-mix(in srgb, var(--theme-default7) 28%, transparent);
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
  white-space: nowrap;
}

.tpl-var-chip:hover:not(:disabled) {
  background: color-mix(in srgb, var(--theme-default7) 20%, transparent);
  border-color: color-mix(in srgb, var(--theme-default7) 50%, transparent);
}

/* ==== DARK MODE ==== */
:global(body.dark-layout) .tpl-editor {
  background: #232323;
  border-color: #383434;
}

:global(body.dark-layout) .tpl-toolbar {
  background: #1b1b1b;
  border-bottom-color: #383434;
}

:global(body.dark-layout) .tpl-tb-btn {
  color: rgba(255, 255, 255, 0.76);
}

:global(body.dark-layout) .tpl-tb-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
}

:global(body.dark-layout) .tpl-tb-btn.active {
  background: color-mix(in srgb, var(--theme-default7) 18%, transparent);
  color: color-mix(in srgb, var(--theme-default7) 60%, #fff);
}

:global(body.dark-layout) .tpl-tb-divider {
  background: #383434;
}

:global(body.dark-layout) .tpl-content {
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .tpl-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: rgba(255, 255, 255, 0.35);
}

:global(body.dark-layout) .tpl-variables {
  background: #1b1b1b;
  border-top-color: #383434;
}

:global(body.dark-layout) .tpl-vars-title {
  color: rgba(255, 255, 255, 0.55);
}

:global(body.dark-layout) .tpl-var-group-name {
  color: rgba(255, 255, 255, 0.48);
}

:global(body.dark-layout) .tpl-var-chip {
  background: color-mix(in srgb, var(--theme-default7) 13%, transparent);
  color: color-mix(in srgb, var(--theme-default7) 60%, #fff);
  border-color: color-mix(in srgb, var(--theme-default7) 32%, transparent);
}

:global(body.dark-layout) .tpl-var-chip:hover:not(:disabled) {
  background: color-mix(in srgb, var(--theme-default7) 22%, transparent);
  border-color: color-mix(in srgb, var(--theme-default7) 50%, transparent);
}
</style>
