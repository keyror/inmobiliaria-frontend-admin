import type { Header } from 'vue3-easy-data-table'

export const propertiesHeader: Header[] = [
    { text: "Cod", value: "code", sortable: true },
    { text: "Num. Catastro", value: "cadastral_number", sortable: true },
    { text: "Estado", value: "status.name", sortable: true },
    { text: "Tipo", value: "property_type.name", sortable: false },
    { text: "Fecha registro", value: "created_at", sortable: true },
    { text: "Acciones", value: "actions", sortable: false },
]
