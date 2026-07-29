export interface PublicSiteRoute {
  label: string;
  path: string;
  description: string;
}

export const PUBLIC_SITE_ROUTES: PublicSiteRoute[] = [
  {
    label: "Inicio",
    path: "/",
    description: "Página principal del sitio",
  },
  {
    label: "Propiedades",
    path: "/realstate/property",
    description: "Lista de todas las propiedades disponibles",
  },
  {
    label: "Propiedades en arriendo",
    path: "/realstate/property?search=Arriendo",
    description: "Lista de propiedades filtradas por arriendo",
  },
  {
    label: "Propiedades en venta",
    path: "/realstate/property?search=Venta",
    description: "Lista de propiedades filtradas por venta",
  },
  {
    label: "Servicios",
    path: "/realstate/services",
    description: "Página de servicios de la inmobiliaria",
  },
  {
    label: "Nosotros",
    path: "/realstate/about-us",
    description: "Página de quiénes somos",
  },
  {
    label: "Contacto",
    path: "/realstate/contact",
    description: "Página de contacto",
  },
];

export const CUSTOM_ROUTE_SENTINEL = "__custom__";
