import type { Header } from "vue3-easy-data-table";

export const lookupsHeader: Header[] = [
  { text: "Categoría", value: "category", sortable: true },
  { text: "Nombre", value: "name", sortable: true },
  { text: "Alias", value: "alias", sortable: true },
  { text: "Código", value: "code", sortable: true },
  { text: "Valor", value: "value", sortable: true },
  { text: "Idioma", value: "lang", sortable: true },
  { text: "Estado", value: "is_active", sortable: true },
  { text: "Acciones", value: "actions", sortable: false },
];
