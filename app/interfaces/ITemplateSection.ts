export type TemplateSectionType =
  | 'clause'
  | 'observation'
  | 'header'
  | 'party_info'
  | 'property_info'
  | 'contract_info'
  | 'signature'
  | 'table'
  | 'separator'

export interface ITemplateSection {
  id: number
  template_key: string
  section_key: string | null
  section_type: TemplateSectionType
  heading: string | null
  body: string | null
  content_json: Record<string, any> | null
  section_config: Record<string, any> | null
  sort_order: number
  is_active: boolean
  is_default: boolean
  created_at?: string
  updated_at?: string
}

export interface ITemplateSectionVariable {
  id: string
  label: string
}

export interface ITemplateSectionVariableGroup {
  group: string
  icon: string
  variables: ITemplateSectionVariable[]
}

// ── section_config shapes por tipo ──────────────────────────────────────────

export interface PartyInfoConfig {
  role: 'arrendatario' | 'propietario' | 'codeudor'
  fields: string[]
}

export interface PropertyInfoConfig {
  fields: string[]
}

export interface ContractInfoConfig {
  fields: string[]
}

export interface SignatoryConfig {
  role: 'arrendador' | 'arrendatario' | 'codeudor' | 'propietario' | 'custom'
  label: string
  side: 'left' | 'right'
}

export interface SignatureConfig {
  signatories: SignatoryConfig[]
}

export interface SeparatorConfig {
  style: 'line' | 'page_break'
}

export interface ITemplateSectionMeta {
  templates: Record<string, { label: string; category: string }>
  variables: Record<string, string>
  variable_groups: ITemplateSectionVariableGroup[]
  dotted_to_placeholder: Record<string, string>
}
