import type { Header } from "vue3-easy-data-table";

export const plansHeader: Header[] = [
  { text: "Nombre", value: "name", sortable: true },
  { text: "Precio (COP)", value: "price", sortable: true },
  { text: "Usuarios máx.", value: "max_users", sortable: true },
  { text: "Propiedades máx.", value: "max_properties", sortable: true },
  { text: "Imgs/propiedad", value: "max_images_per_property", sortable: true },
  { text: "Activo", value: "is_active", sortable: true },
  { text: "Fecha registro", value: "created_at", sortable: true },
  { text: "Acciones", value: "actions", sortable: false },
];
