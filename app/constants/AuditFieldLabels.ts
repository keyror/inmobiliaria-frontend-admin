/**
 * Traducción de nombres de campos de BD a etiquetas legibles en español.
 * Cubre todos los modelos auditados del sistema.
 */
export const AUDIT_FIELD_LABELS: Record<string, string> = {
  // ── Campos comunes ──────────────────────────────────────────────────────
  id: "ID",
  created_at: "Fecha de creación",
  updated_at: "Última actualización",
  deleted_at: "Fecha de eliminación",
  is_active: "Activo",
  is_principal: "Principal",
  status_id: "Estado",
  sort_order: "Orden",

  // ── Propiedad (Property) ────────────────────────────────────────────────
  code: "Código",
  status_property_id: "Estado de la propiedad",
  title: "Título",
  offer_type_id: "Tipo de oferta",
  property_type_id: "Tipo de inmueble",
  stratum_id: "Estrato",
  year_built: "Año de construcción",
  rooms: "Habitaciones",
  bathrooms: "Baños",
  garage_type_id: "Tipo de garaje",
  garage_spots: "Puestos de garaje",
  cadastral_number: "Número catastral",
  url_google_map: "URL Google Maps",
  latitude: "Latitud",
  longitude: "Longitud",
  boundaries: "Linderos",
  description: "Descripción",
  is_featured: "Destacado",
  property_id: "Propiedad",

  // ── Característica de propiedad (PropertyFeature) ──────────────────────
  feature_type_id: "Tipo de característica",
  feature_description: "Descripción de la característica",

  // ── Propietario de propiedad (PropertyPerson) ──────────────────────────
  ownership_percentage: "Porcentaje de propiedad",
  is_principal_owner: "Propietario principal",
  ownership_start_date: "Fecha inicio de propiedad",
  ownership_end_date: "Fecha fin de propiedad",

  // ── Obligación de propiedad (PropertyObligation) ───────────────────────
  obligation_type_id: "Tipo de obligación",
  amount: "Valor",
  total: "Total",
  frequency_type_id: "Frecuencia",

  // ── Área de propiedad (PropertyArea) ───────────────────────────────────
  area_type_id: "Tipo de área",
  area_value: "Valor del área",
  area_unit_id: "Unidad de área",

  // ── Precio de propiedad (PropertyPrice) ────────────────────────────────
  price_type_id: "Tipo de precio",
  price_min: "Precio mínimo",
  price_max: "Precio máximo",
  price: "Precio",

  // ── Canal de publicación (PublishChannel) ──────────────────────────────
  channel_id: "Canal",
  external_link: "Enlace externo",
  published_at: "Fecha de publicación",
  unpublished_at: "Fecha de despublicación",
  channel_specific_data: "Datos del canal",

  // ── Dirección (Address) ────────────────────────────────────────────────
  name: "Nombre",
  address: "Dirección",
  city_id: "Ciudad",
  department_id: "Departamento",
  country_id: "País",
  zip_code: "Código postal",
  sector: "Sector",
  complement: "Complemento",
  via_type_id: "Tipo de vía",
  via_number: "Número de vía",
  letra1_id: "Letra 1",
  orientation1_id: "Orientación 1",
  number2: "Número 2",
  letra2_id: "Letra 2",
  orientation2_id: "Orientación 2",
  number3: "Número 3",

  // ── Contacto (Contact) ─────────────────────────────────────────────────
  phone: "Teléfono",
  mobile: "Celular",
  email: "Correo electrónico",

  // ── Persona (Person) ───────────────────────────────────────────────────
  person_id: "Persona",
  user_id: "Usuario asociado",
  fiscal_profile_id: "Perfil fiscal",
  first_name: "Nombre",
  last_name: "Apellido",
  full_name: "Nombre completo",
  company_name: "Nombre de empresa",
  document_type_id: "Tipo de documento",
  document_number: "Número de documento",
  dv: "DV",
  document_from_id: "Expedido en",
  organization_type_id: "Tipo de organización",
  birth_date: "Fecha de nacimiento",
  gender_type_id: "Género",

  // ── Empresa / Sucursal (Company) ───────────────────────────────────────
  company_id: "Empresa",
  tradename: "Nombre comercial",
  nit: "NIT",
  legal_representative_id: "Representante legal",
  person_attendant_id: "Persona de contacto",
  parent_company_id: "Empresa matriz",
  branch_code: "Código de sucursal",
  uses_branches: "Habilita sucursales",

  // ── Perfil fiscal (FiscalProfile) ─────────────────────────────────────
  tax_regime: "Régimen tributario",
  responsible_for_vat_type_id: "Responsable de IVA",
  vat_withholding: "Retención de IVA (%)",
  income_tax_withholding: "Retención de renta (%)",
  ica_withholding: "Retención de ICA (%)",
  rental_fee: "Honorarios de arrendamiento (%)",

  // ── Actividad económica (EconomicActivity) ─────────────────────────────
  economic_activity_type_id: "Actividad económica",

  // ── Responsabilidad fiscal (TaxeType) ──────────────────────────────────
  taxe_type_id: "Responsabilidad fiscal",

  // ── Cuenta bancaria (AccountBank) ──────────────────────────────────────
  account_type_id: "Tipo de cuenta",
  bank_id: "Banco",
  account_number: "Número de cuenta",

  // ── Usuario (User) ─────────────────────────────────────────────────────
  password: "Contraseña",
  remember_token: "Token de sesión",
  email_verified_at: "Correo verificado en",
  tenant_id: "Tenant",
  status_type_id: "Estado del usuario",

  // ── Rol (Role / Spatie) ────────────────────────────────────────────────
  guard_name: "Guard",

  // ── Configuración del sitio inmobiliario (RealstateSiteSetting) ────────
  template_set: "Plantilla del sitio",
  theme: "Tema de colores",
  pages: "Páginas del sitio",
  backup_template_set: "Plantilla de respaldo",
  backup_theme: "Tema de respaldo",
  backup_pages: "Páginas de respaldo",

  // ── Configuración del sitio central (CentralSiteSetting) ───────────────
  template: "Plantilla",
  primary_color: "Color primario",
  secondary_color: "Color secundario",
  logo_url: "URL del logotipo",
  favicon_url: "URL del favicon",
  site_name: "Nombre del sitio",
  site_description: "Descripción del sitio",
  contact_email: "Correo de contacto",
  contact_phone: "Teléfono de contacto",
  whatsapp: "WhatsApp",
  facebook_url: "Facebook",
  instagram_url: "Instagram",
  twitter_url: "Twitter",
  youtube_url: "YouTube",
  tiktok_url: "TikTok",
  linkedin_url: "LinkedIn",
  google_analytics_id: "Google Analytics ID",
  meta_pixel_id: "Meta Pixel ID",
  address_office: "Dirección de oficina",

  // ── Plan ───────────────────────────────────────────────────────────────
  plan_id: "Plan",
  max_properties: "Máx. propiedades",
  max_users: "Máx. usuarios",
  price_monthly: "Precio mensual",
  price_annual: "Precio anual",
  features: "Características",
  is_public: "Público",

  // ── Lookup ─────────────────────────────────────────────────────────────
  category: "Categoría",
  alias: "Alias",
  value: "Valor",
  icon: "Ícono",
  lang: "Idioma",
  lookup_id: "Desplegable",

  // ── Contrato (Rent) ────────────────────────────────────────────────────
  status: "Estado",
  contract_number: "Número de contrato",
  contract_type_id: "Tipo de contrato",
  start_date: "Fecha de inicio",
  end_date: "Fecha de fin",
  duration: "Duración (meses)",
  destination: "Destino del inmueble",
  activity: "Actividad comercial",
  period: "Fecha de período",
  canon: "Canon",
  iva: "IVA",
  administration_included: "Administración incluida",
  is_ph: "Propiedad horizontal",
  interest_rate: "Tasa de mora (%)",
  increment_type_id: "Tipo de incremento",
  adjustment_date: "Fecha de ajuste",
  is_insured: "Asegurado",
  consignment_account: "Cuenta de consignación",
  payment_bank_id: "Banco de pago",
  commissions: "Comisiones",
  signed_city: "Ciudad de firma",
  signed_at: "Fecha de firma",
  additional_clauses: "Cláusulas adicionales",
  internal_notes: "Notas internas",
  limit_dates_id: "Fechas límite",

  // ── Arrendatario / Codeudor (RentTenantCodebtor) ──────────────────────
  rent_id: "Contrato",
  tenant_id: "Arrendatario",
  codebtor_id: "Codeudor",
  percentage: "Porcentaje",

  // ── Obligación del contrato (RentObligation) ──────────────────────────
  expiration_date: "Fecha de vencimiento",
  description: "Descripción",

  // ── Cargo (Liability) ─────────────────────────────────────────────────
  liability_type_id: "Tipo de cargo",
  fee: "Valor del cargo",

  // ── Plantilla de informe (ReportTemplate) ─────────────────────────────
  columns: "Columnas",
  is_default: "Predeterminada",

  // ── Documento (Document) ───────────────────────────────────────────────
  documentable_type: "Tipo de entidad",
  documentable_id: "Entidad relacionada",
  document_category_id: "Categoría del documento",
  number: "Número",
  template_key: "Clave de plantilla",
  content: "Contenido",
  file_name: "Nombre del archivo",
  file_path: "Ruta del archivo",
  file_extension: "Extensión",
  mime_type: "Tipo MIME",
  file_size: "Tamaño (bytes)",
  document_date: "Fecha del documento",
  expiry_date: "Fecha de vencimiento",
  generated_at: "Generado el",
  notes: "Notas",
  created_by: "Creado por",
  parent_document_id: "Documento origen",
  is_verified: "Verificado",

  // ── Campos morph (Contact / Address / AccountBank) ─────────────────────
  contactable_type: "Tipo de entidad (contacto)",
  contactable_id: "Entidad (contacto)",
  addressable_type: "Tipo de entidad (dirección)",
  addressable_id: "Entidad (dirección)",
  accountable_type: "Tipo de entidad (cuenta)",
  accountable_id: "Entidad (cuenta)",
};

/**
 * Retorna la etiqueta legible de un campo o lo formatea si no está mapeado.
 */
export function labelField(key: string): string {
  return (
    AUDIT_FIELD_LABELS[key] ??
    key
      .replace(/_id$/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
