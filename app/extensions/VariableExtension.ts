import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import VariableChip from '~/components/template-editor/VariableChip.vue'

export interface VariableAttrs {
  id: string
  label: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (attrs: VariableAttrs) => ReturnType
    }
  }
}

export const VariableExtension = Node.create({
  name: 'variable',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: { default: '' },
      label: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-variable]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-variable': '' }, HTMLAttributes), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(VariableChip)
  },

  addCommands() {
    return {
      insertVariable:
        (attrs: VariableAttrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          })
        },
    }
  },
})
