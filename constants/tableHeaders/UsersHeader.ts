import type { Header } from 'vue3-easy-data-table'

export const usersHeader: Header[] = [
    { text: "Email", value: "email", sortable: true },
    { text: "status", value: "status.name", sortable: true },
    { text: "Fecha registro", value: "created_at", sortable: true },
    { text: "Acciones", value: "actions", sortable: false },
]
