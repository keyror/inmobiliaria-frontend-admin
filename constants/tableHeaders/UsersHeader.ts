import type { Header } from 'vue3-easy-data-table'

export const usersHeader: Header[] = [
    { text: "Nombre completo", value: "full_name", sortable: true },
    { text: "Email", value: "user.email", sortable: true },
    { text: "Tipo Doc", value: "document_type.alias", sortable: true },
    { text: "Nro Doc", value: "document_number", sortable: true },
    { text: "Fecha registro", value: "created_at", sortable: true },
    { text: "Acciones", value: "actions", sortable: false },
]
