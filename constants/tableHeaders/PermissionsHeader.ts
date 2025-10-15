import type {Header} from 'vue3-easy-data-table'

export const permissionsHeader: Header[] = [
    {text: "ID", value: "id", sortable: true},
    {text: "Nombre", value: "name", sortable: true},
    {text: "Guard", value: "guard_name", sortable: true},
    {text: "Fecha registro", value: "created_at", sortable: true},
    {text: "Acciones", value: "actions", sortable: false},
]
