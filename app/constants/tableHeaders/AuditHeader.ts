import type { Header } from "vue3-easy-data-table";

export const auditHeader: Header[] = [
  { text: "Módulo", value: "module_label", sortable: false },
  { text: "Acción", value: "event", sortable: false },
  { text: "Registro", value: "subject_type", sortable: false },
  { text: "Usuario", value: "causer_email", sortable: false },
  { text: "Fecha", value: "created_at", sortable: false },
  { text: "Acciones", value: "actions", sortable: false },
];
