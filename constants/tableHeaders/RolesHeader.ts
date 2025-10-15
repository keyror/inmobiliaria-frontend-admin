import type { Header } from 'vue3-easy-data-table'
import { useI18n } from 'vue-i18n'

export const rolesHeader = (): Header[] => {
    const { t } = useI18n()

    return [
        { text: t('rol.header.id'), value: 'id', sortable: true },
        { text: t('rol.header.name'), value: 'name', sortable: true },
        { text: t('rol.header.guard'), value: 'guard_name', sortable: true },
        { text: t('rol.header.created_at'), value: 'created_at', sortable: true },
        { text: t('rol.header.actions'), value: 'actions', sortable: false }
    ]
}
