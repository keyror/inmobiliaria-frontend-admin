/**
 * Traducción de nombres de campos de BD a etiquetas legibles en español.
 * Cubre todos los modelos auditados del sistema.
 */
export const AUDIT_FIELD_LABELS: Record<string, string> = {
  // ── Campos comunes ──────────────────────────────────────────────────────
  id:                       "ID",
  created_at:               "Fecha de creación",
  updated_at:               "Última actualización",
  deleted_at:               "Fecha de eliminación",
  is_active:                "Activo",
  is_principal:             "Principal",
  status_id:                "Estado",
  sort_order:               "Orden",

  // ── Propiedad (Property) ────────────────────────────────────────────────
  code:                     "Código",
  status_property_id:       "Estado de la propiedad",
  title:                    "Título",
  offer_type_id:            "Tipo de oferta",
  property_type_id:         "Tipo de inmueble",
  stratum_id:               "Estrato",
  year_built:               "Año de construcción",
  rooms:                    "Habitaciones",
  bathrooms:                "Baños",
  garage_type_id:           "Tipo de garaje",
  garage_spots:             "Puestos de garaje",
  cadastral_number:         "Número catastral",
  url_google_map:           "URL Google Maps",
  latitude:                 "Latitud",
  longitude:                "Longitud",
  boundaries:               "Linderos",
  description:              "Descripción",
  is_featured:              "Destacado",
  property_id:              "Propiedad",

  // ── Característica de propiedad (PropertyFeature) ──────────────────────
  feature_type_id:          "Tipo de característica",
  feature_description:      "Descripción de la característica",

  // ── Propietario de propiedad (PropertyPerson) ──────────────────────────
  ownership_percentage:     "Porcentaje de propiedad",
  is_principal_owner:       "Propietario principal",
  ownership_start_date:     "Fecha inicio de propiedad",
  ownership_end_date:       "Fecha fin de propiedad",

  // ── Obligación de propiedad (PropertyObligation) ───────────────────────
  obligation_type_id:       "Tipo de obligación",
  amount:                   "Valor",
  total:                    "Total",
  frequency_type_id:        "Frecuencia",

  // ── Área de propiedad (PropertyArea) ───────────────────────────────────
  area_type_id:             "Tipo de área",
  area_value:               "Valor del área",
  area_unit_id:             "Unidad de área",

  // ── Precio de propiedad (PropertyPrice) ────────────────────────────────
  price_type_id:            "Tipo de precio",
  price_min:                "Precio mínimo",
  price_max:                "Precio máximo",
  price:                    "Precio",

  // ── Canal de publicación (PublishChannel) ──────────────────────────────
  channel_id:               "Canal",
  external_link:            "Enlace externo",
  published_at:             "Fecha de publicación",
  unpublished_at:           "Fecha de despublicación",
  channel_specific_data:    "Datos del canal",

  // ── Dirección (Address) ────────────────────────────────────────────────
  name:                     "Nombre",
  address:                  "Dirección",
  city_id:                  "Ciudad",
  department_id:            "Departamento",
  country_id:               "País",
  zip_code:                 "Código postal",
  sector:                   "Sector",
  complement:               "Complemento",
  via_type_id:              "Tipo de vía",
  via_number:               "Número de vía",
  letra1_id:                "Letra 1",
  orientation1_id:          "Orientación 1",
  number2:                  "Número 2",
  letra2_id:                "Letra 2",
  orientation2_id:          "Orientación 2",
  number3:                  "Número 3",

  // ── Contacto (Contact) ─────────────────────────────────────────────────
  phone:                    "Teléfono",
  mobile:                   "Celular",
  email:                    "Correo electrónico",

  // ── Persona (Person) ───────────────────────────────────────────────────
  person_id:                "Persona",
  user_id:                  "Usuario asociado",
  fiscal_profile_id:        "Perfil fiscal",
  first_name:               "Nombre",
  last_name:                "Apellido",
  full_name:                "Nombre completo",
  company_name:             "Nombre de empresa",
  document_type_id:         "Tipo de documento",
  document_number:          "Número de documento",
  dv:                       "DV",
  document_from_id:         "Expedido en",
  organization_type_id:     "Tipo de organización",
  birth_date:               "Fecha de nacimiento",
  gender_type_id:           "Género",

  // ── Empresa (Company) ──────────────────────────────────────────────────
  company_id:               "Empresa",
  tradename:                "Nombre comercial",
  nit:                      "NIT",
  legal_representative_id:  "Representante legal",
  person_attendant_id:      "Persona de contacto",

  // ── Cuenta bancaria (AccountBank) ──────────────────────────────────────
  account_type_id:          "Tipo de cuenta",
  bank_id:                  "Banco",
  account_number:           "Número de cuenta",

  // ── Usuario (User) ─────────────────────────────────────────────────────
  password:                 "Contraseña",
  remember_token:           "Token de sesión",
  email_verified_at:        "Correo verificado en",
  tenant_id:                "Tenant",

  // ── Rol (Role / Spatie) ────────────────────────────────────────────────
  guard_name:               "Guard",

  // ── Configuración del sitio (RealstateSiteSetting) ─────────────────────
  template:                 "Plantilla",
  primary_color:            "Color primario",
  secondary_color:          "Color secundario",
  logo_url:                 "URL del logotipo",
  favicon_url:              "URL del favicon",
  site_name:                "Nombre del sitio",
  site_description:         "Descripción del sitio",
  contact_email:            "Correo de contacto",
  contact_phone:            "Teléfono de contacto",
  whatsapp:                 "WhatsApp",
  facebook_url:             "Facebook",
  instagram_url:            "Instagram",
  twitter_url:              "Twitter",
  youtube_url:              "YouTube",
  tiktok_url:               "TikTok",
  linkedin_url:             "LinkedIn",
  google_analytics_id:      "Google Analytics ID",
  meta_pixel_id:            "Meta Pixel ID",
  address_office:           "Dirección de oficina",

  // ── Plan ───────────────────────────────────────────────────────────────
  plan_id:                  "Plan",
  max_properties:           "Máx. propiedades",
  max_users:                "Máx. usuarios",
  price_monthly:            "Precio mensual",
  price_annual:             "Precio anual",
  features:                 "Características",
  is_public:                "Público",

  // ── Lookup ─────────────────────────────────────────────────────────────
  category:                 "Categoría",
  alias:                    "Alias",
  value:                    "Valor",
  icon:                     "Ícono",
  lang:                     "Idioma",
  lookup_id:                "Desplegable",
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
