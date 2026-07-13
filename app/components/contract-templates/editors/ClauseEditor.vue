<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { VariableExtension } from '~/extensions/VariableExtension'
import type { ITemplateSectionVariableGroup } from '~/interfaces/ITemplateSection'

interface Props {
  modelValue: Record<string, any> | null
  variableGroups: ITemplateSectionVariableGroup[]
  placeholder?: string
  bodyFallback?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Escribe el contenido…',
  bodyFallback: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, any> | null): void
}>()

const editor = useEditor({
  extensions: [
    StarterKit, // v3 ya incluye Underline — no agregar por separado
    Placeholder.configure({ placeholder: props.placeholder }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    VariableExtension,
  ],
  content: props.modelValue ?? (props.bodyFallback ?? undefined),
  onCreate: ({ editor }) => {
    // Si content_json es null pero body tiene HTML, emitir el JSON parseado
    // para que el formulario tenga contenido listo al guardar sin editar
    if (props.modelValue === null && props.bodyFallback) {
      emit('update:modelValue', editor.getJSON())
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getJSON())
  },
})

watch(
  () => props.modelValue,
  (val) => {
    if (!editor.value) return
    const current = JSON.stringify(editor.value.getJSON())
    if (current !== JSON.stringify(val)) {
      editor.value.commands.setContent(val ?? '', { emitUpdate: false })
    }
  },
)

function insertVariable(id: string, label: string) {
  editor.value?.chain().focus().insertVariable({ id, label }).run()
}

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div class="clause-editor">
    <!-- Toolbar -->
    <div v-if="editor" class="ce-toolbar">
      <button
        type="button"
        class="ce-btn"
        :class="{ active: editor.isActive('bold') }"
        title="Negrita"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <Icon name="lucide:bold" />
      </button>
      <button
        type="button"
        class="ce-btn"
        :class="{ active: editor.isActive('italic') }"
        title="Cursiva"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <Icon name="lucide:italic" />
      </button>
      <button
        type="button"
        class="ce-btn"
        :class="{ active: editor.isActive('underline') }"
        title="Subrayado"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <Icon name="lucide:underline" />
      </button>
      <div class="ce-divider" />
      <button
        type="button"
        class="ce-btn"
        :class="{ active: editor.isActive({ textAlign: 'left' }) }"
        title="Alinear izquierda"
        @click="editor.chain().focus().setTextAlign('left').run()"
      >
        <Icon name="lucide:align-left" />
      </button>
      <button
        type="button"
        class="ce-btn"
        :class="{ active: editor.isActive({ textAlign: 'center' }) }"
        title="Centrar"
        @click="editor.chain().focus().setTextAlign('center').run()"
      >
        <Icon name="lucide:align-center" />
      </button>
      <button
        type="button"
        class="ce-btn"
        :class="{ active: editor.isActive({ textAlign: 'justify' }) }"
        title="Justificar"
        @click="editor.chain().focus().setTextAlign('justify').run()"
      >
        <Icon name="lucide:align-justify" />
      </button>
      <div class="ce-divider" />
      <button
        type="button"
        class="ce-btn"
        :class="{ active: editor.isActive('bulletList') }"
        title="Lista"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <Icon name="lucide:list" />
      </button>
      <button
        type="button"
        class="ce-btn"
        :class="{ active: editor.isActive('orderedList') }"
        title="Lista numerada"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <Icon name="lucide:list-ordered" />
      </button>
      <div class="ce-divider" />
      <button
        type="button"
        class="ce-btn"
        :disabled="!editor.can().undo()"
        title="Deshacer"
        @click="editor.chain().focus().undo().run()"
      >
        <Icon name="lucide:undo-2" />
      </button>
      <button
        type="button"
        class="ce-btn"
        :disabled="!editor.can().redo()"
        title="Rehacer"
        @click="editor.chain().focus().redo().run()"
      >
        <Icon name="lucide:redo-2" />
      </button>
    </div>

    <!-- Content area -->
    <EditorContent class="ce-content" :editor="editor" />

    <!-- Variables panel -->
    <div v-if="variableGroups.length" class="ce-vars">
      <p class="ce-vars-title">
        <Icon name="lucide:braces" />
        Variables — clic para insertar
      </p>
      <div v-for="group in variableGroups" :key="group.group" class="ce-var-group">
        <p class="ce-var-group-name">{{ group.group }}</p>
        <div class="ce-var-chips">
          <button
            v-for="v in group.variables"
            :key="v.id"
            type="button"
            class="ce-var-chip"
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
.clause-editor {
  --ce-accent: var(--theme-default7);
  --ce-accent-10: color-mix(in srgb, var(--theme-default7) 10%, transparent);
  --ce-accent-12: color-mix(in srgb, var(--theme-default7) 12%, transparent);
  --ce-accent-20: color-mix(in srgb, var(--theme-default7) 20%, transparent);
  --ce-accent-28: color-mix(in srgb, var(--theme-default7) 28%, transparent);
  --ce-accent-50: color-mix(in srgb, var(--theme-default7) 50%, transparent);

  display: flex;
  flex-direction: column;
  border: 1px solid rgba(88, 97, 103, 0.18);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.ce-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  border-bottom: 1px solid rgba(88, 97, 103, 0.12);
  background: #f7f7fe;
  flex-wrap: wrap;
}

.ce-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 5px;
  cursor: pointer;
  color: #586167;
  transition: background 0.12s, color 0.12s;
}

.ce-btn:hover:not(:disabled) {
  background: rgba(88, 97, 103, 0.1);
  color: #1c2d3a;
}

.ce-btn.active {
  background: var(--ce-accent-12);
  color: var(--ce-accent);
}

.ce-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.ce-divider {
  width: 1px;
  height: 18px;
  background: rgba(88, 97, 103, 0.15);
  margin: 0 3px;
}

.ce-content {
  flex: 1;
  min-height: 130px;
  padding: 12px 14px;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #1c2d3a;
  cursor: text;
}

:deep(.ProseMirror) {
  outline: none;
  min-height: 110px;
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

:deep(.ProseMirror [style*="text-align: center"]) { text-align: center; }
:deep(.ProseMirror [style*="text-align: right"])  { text-align: right; }
:deep(.ProseMirror [style*="text-align: justify"]){ text-align: justify; }

.ce-vars {
  padding: 10px 14px 12px;
  border-top: 1px solid rgba(88, 97, 103, 0.1);
  background: #f7f7fe;
}

.ce-vars-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #586167;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px;
}

.ce-var-group { margin-bottom: 8px; }
.ce-var-group:last-child { margin-bottom: 0; }

.ce-var-group-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(28, 45, 58, 0.6);
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ce-var-chips { display: flex; flex-wrap: wrap; gap: 5px; }

.ce-var-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--ce-accent-10);
  color: var(--ce-accent);
  border: 1px solid var(--ce-accent-28);
  cursor: pointer;
  transition: background 0.12s;
  white-space: nowrap;
}

.ce-var-chip:hover {
  background: var(--ce-accent-20);
  border-color: var(--ce-accent-50);
}

/* ── Dark mode ── */
:global(body.dark-layout) .clause-editor { background: #232323; border-color: #383434; }
:global(body.dark-layout) .ce-toolbar { background: #1b1b1b; border-bottom-color: #383434; }
:global(body.dark-layout) .ce-btn { color: rgba(255,255,255,0.76); }
:global(body.dark-layout) .ce-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.92); }
:global(body.dark-layout) .ce-btn.active { background: color-mix(in srgb, var(--theme-default7) 18%, transparent); color: color-mix(in srgb, var(--theme-default7) 60%, #fff); }
:global(body.dark-layout) .ce-divider { background: #383434; }
:global(body.dark-layout) .ce-content { color: rgba(255,255,255,0.82); }
:global(body.dark-layout) .clause-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) { color: rgba(255,255,255,0.35); }
:global(body.dark-layout) .ce-vars { background: #1b1b1b; border-top-color: #383434; }
:global(body.dark-layout) .ce-vars-title { color: rgba(255,255,255,0.55); }
:global(body.dark-layout) .ce-var-group-name { color: rgba(255,255,255,0.48); }
:global(body.dark-layout) .ce-var-chip { background: color-mix(in srgb, var(--theme-default7) 13%, transparent); color: color-mix(in srgb, var(--theme-default7) 60%, #fff); border-color: color-mix(in srgb, var(--theme-default7) 32%, transparent); }
:global(body.dark-layout) .ce-var-chip:hover { background: color-mix(in srgb, var(--theme-default7) 22%, transparent); }
</style>
