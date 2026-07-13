import type { Header } from "vue3-easy-data-table";

export const rentsHeader: Header[] = [
  { text: "N° Contrato", value: "contract_number", sortable: true },
  { text: "Propiedad", value: "property", sortable: false },
  { text: "Tipo", value: "contract_type.name", sortable: false },
  { text: "Canon", value: "canon", sortable: true },
  { text: "Inicio", value: "start_date", sortable: true },
  { text: "Fin", value: "end_date", sortable: true },
  { text: "Estado", value: "status", sortable: true },
  { text: "Acciones", value: "actions", sortable: false },
];
