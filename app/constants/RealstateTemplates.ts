export const REALSTATE_SITE_PAGES = [
  "home",
  "propertyList",
  "propertyDetail",
  "about",
  "services",
  "contact",
] as const;

export const REALSTATE_TEMPLATE_IDS = ["template1", "template2"] as const;

export type RealstateSitePageKey = (typeof REALSTATE_SITE_PAGES)[number];
export type RealstateTemplateSet = (typeof REALSTATE_TEMPLATE_IDS)[number];
export type RealstateTemplates = Record<
  RealstateSitePageKey,
  RealstateTemplateSet
>;

export const REALSTATE_TEMPLATE_SETS: Record<
  RealstateTemplateSet,
  RealstateTemplates
> = {
  template1: {
    home: "template1",
    propertyList: "template1",
    propertyDetail: "template1",
    about: "template1",
    services: "template1",
    contact: "template1",
  },
  template2: {
    home: "template2",
    propertyList: "template2",
    propertyDetail: "template2",
    about: "template2",
    services: "template2",
    contact: "template2",
  },
} as const;

export const REALSTATE_TEMPLATE_OPTIONS: {
  id: RealstateTemplateSet;
  label: string;
  description: string;
}[] = [
  {
    id: "template1",
    label: "Template 1",
    description: "Diseño base para el sitio público inmobiliario.",
  },
  {
    id: "template2",
    label: "Template 2",
    description: "Diseño alternativo para el sitio público inmobiliario.",
  },
];

export const REALSTATE_SITE_PAGE_OPTIONS: {
  id: RealstateSitePageKey;
  label: string;
  description: string;
}[] = [
  {
    id: "home",
    label: "Inicio",
    description: "Contenido principal de la página inicial.",
  },
  {
    id: "propertyList",
    label: "Listado de propiedades",
    description: "Textos del buscador y listado público de inmuebles.",
  },
  {
    id: "propertyDetail",
    label: "Detalle de propiedad",
    description: "Configuración de secciones del detalle de inmueble.",
  },
  {
    id: "about",
    label: "Nosotros",
    description: "Historia, misión, visión y razones para elegir la empresa.",
  },
  {
    id: "services",
    label: "Servicios",
    description: "Servicios prestados y servicios para propiedades.",
  },
  {
    id: "contact",
    label: "Contacto",
    description: "Contenido editable para la página de contacto.",
  },
];

export interface RealstateTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export const DEFAULT_REALSTATE_THEME: RealstateTheme = {
  primary: "#f35d43",
  secondary: "#f34451",
  accent: "#f35d43",
};

export const isHexThemeColor = (color?: string | null): color is string => {
  return /^#[0-9A-Fa-f]{6}$/.test(color ?? "");
};

export const normalizeRealstateTheme = (
  theme?: Partial<Record<keyof RealstateTheme, string | null>> | null,
): RealstateTheme => ({
  primary: isHexThemeColor(theme?.primary)
    ? theme.primary
    : DEFAULT_REALSTATE_THEME.primary,
  secondary: isHexThemeColor(theme?.secondary)
    ? theme.secondary
    : DEFAULT_REALSTATE_THEME.secondary,
  accent: isHexThemeColor(theme?.accent)
    ? theme.accent
    : DEFAULT_REALSTATE_THEME.accent,
});
