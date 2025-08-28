import type { Header } from 'vue3-easy-data-table'

export const tenantsHeader: Header[] = [
    { text: "Nombre", value: "name", sortable: true },
    { text: "Email", value: "email", sortable: true },
    { text: "Dominio", value: "domain", sortable: true },
    { text: "Plan", value: "plan", sortable: true },
    { text: "Estado", value: "status", sortable: true },
    { text: "DB", value: "tenancy_db_name", sortable: false},
    { text: "Fin de suscripción", value: "subscription_ends_at", sortable: true },
    { text: "Fecha registro", value: "created_at", sortable: true },
    { text: "Acciones", value: "actions", sortable: false },
]
