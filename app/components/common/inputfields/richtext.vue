<template>
  <div class="form-group" :class="[classes, { 'was-validated': error }]">
    <label v-if="label">
      {{ label }}
      <span v-if="star" class="font-danger">{{ star }}</span>
    </label>

    <div
      class="richtext-wrapper"
      :class="{ 'is-invalid': error, 'richtext-disabled': disabled }"
    >
      <!-- Toolbar -->
      <div class="richtext-toolbar">
        <button
          type="button"
          :class="{ active: editor?.isActive('bold') }"
          title="Negrita"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          :class="{ active: editor?.isActive('italic') }"
          title="Cursiva"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          :class="{ active: editor?.isActive('bulletList') }"
          title="Lista con viñetas"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          ≡•
        </button>
        <button
          type="button"
          :class="{ active: editor?.isActive('orderedList') }"
          title="Lista numerada"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          ≡1
        </button>
        <div class="richtext-toolbar-sep"></div>
        <button
          type="button"
          title="Deshacer"
          @click="editor?.chain().focus().undo().run()"
        >
          ↩
        </button>
        <button
          type="button"
          title="Rehacer"
          @click="editor?.chain().focus().redo().run()"
        >
          ↪
        </button>
      </div>

      <!-- Editor content -->
      <editor-content class="richtext-content" :editor="editor" />
    </div>

    <small v-if="error" class="text-danger">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/vue-3";

const props = defineProps({
  classes: String,
  label: String,
  placeholder: { type: String, default: "Escribe aquí..." },
  modelValue: { type: String, default: "" },
  star: String,
  disabled: { type: Boolean, default: false },
  name: String,
  error: String,
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  content: props.modelValue ?? "",
  editable: !props.disabled,
  onUpdate({ editor }) {
    const html = editor.getHTML();
    emit("update:modelValue", html === "<p></p>" ? "" : html);
  },
});

watch(
  () => props.modelValue,
  (val) => {
    if (!editor.value) return;
    const current = editor.value.getHTML();
    const incoming = val ?? "";
    if (current === incoming || (current === "<p></p>" && !incoming)) return;
    editor.value.commands.setContent(incoming, false);
  },
);

watch(
  () => props.disabled,
  (val) => editor.value?.setEditable(!val),
);

onBeforeUnmount(() => editor.value?.destroy());
</script>

<style scoped>
.richtext-wrapper {
  border: 1px solid #ced4da;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  transition: border-color 0.15s;
}
.richtext-wrapper:focus-within {
  border-color: #7366ff;
  box-shadow: 0 0 0 0.2rem rgba(115, 102, 255, 0.15);
}
.richtext-wrapper.is-invalid {
  border-color: #dc3545;
}
.richtext-wrapper.richtext-disabled {
  background: #e9ecef;
  opacity: 0.7;
  pointer-events: none;
}

/* Toolbar */
.richtext-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px 8px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}
.richtext-toolbar button {
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 13px;
  line-height: 1.4;
  cursor: pointer;
  color: #495057;
  transition:
    background 0.12s,
    border-color 0.12s;
  min-width: 28px;
}
.richtext-toolbar button:hover {
  background: #e9ecef;
  border-color: #ced4da;
}
.richtext-toolbar button.active {
  background: #7366ff22;
  border-color: #7366ff88;
  color: #7366ff;
}
.richtext-toolbar-sep {
  width: 1px;
  height: 18px;
  background: #dee2e6;
  margin: 0 4px;
}

/* Editor area */
.richtext-content {
  padding: 10px 12px;
  min-height: 120px;
  outline: none;
}

/* Tiptap inner element needs full height */
:deep(.ProseMirror) {
  min-height: 100px;
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  color: #495057;
}
:deep(.ProseMirror p) {
  margin-bottom: 0.5rem;
}
:deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}
:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.4rem;
  margin-bottom: 0.5rem;
}
:deep(.ProseMirror li) {
  margin-bottom: 0.2rem;
}
:deep(.ProseMirror .is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #adb5bd;
  pointer-events: none;
  float: left;
  height: 0;
}

/* Dark mode */
:global(body.dark-layout) .richtext-wrapper {
  background: #1b1b1b;
  border-color: #383434;
}
:global(body.dark-layout) .richtext-wrapper:focus-within {
  border-color: #7366ff;
  box-shadow: 0 0 0 0.2rem rgba(115, 102, 255, 0.2);
}
:global(body.dark-layout) .richtext-toolbar {
  background: #232323;
  border-bottom-color: #383434;
}
:global(body.dark-layout) .richtext-toolbar button {
  color: rgba(255, 255, 255, 0.76);
}
:global(body.dark-layout) .richtext-toolbar button:hover {
  background: #383434;
  border-color: #4a4a4a;
}
:global(body.dark-layout) .richtext-toolbar button.active {
  background: #7366ff33;
  border-color: #7366ffaa;
  color: #a99dff;
}
:global(body.dark-layout) .richtext-toolbar-sep {
  background: #383434;
}
:global(body.dark-layout) .richtext-content :deep(.ProseMirror) {
  color: rgba(255, 255, 255, 0.82);
}
:global(body.dark-layout)
  .richtext-content
  :deep(.ProseMirror .is-editor-empty:first-child::before) {
  color: rgba(255, 255, 255, 0.38);
}
:global(body.dark-layout) .richtext-wrapper.richtext-disabled {
  background: #2a2a2a;
}
</style>
