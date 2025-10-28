import RolePermissionService from '@/services/RolePermissionService'
import AlertaService from '@/services/AlertService'
import LoadingService from '@/services/LoadingService'
import type { IParamsTable } from '~/interfaces/IParamsTable'

export function usePermissions() {
    const allPermissions = ref([])
    const total = ref(0)

    /**
     * Carga permisos desde el backend.
     * Si no se pasan params, por defecto traerá los primeros 100.
     */
    const loadPermissions = async (params?: IParamsTable, withLoading = true) => {
        const query = params || { page: 1, perPage: 999 };
        if (withLoading) LoadingService.show();
        RolePermissionService.getPermissions(query)
            .then((response) => {
                allPermissions.value = response.data.data;
                total.value = response.data.total ? response.data.total : 0;
            })
            .catch((error) => {
                AlertaService.showError('Ha ocurrido un error', error);
            })
            .finally(() => {
                if (withLoading) LoadingService.hide();

            });
    };

    return {
        allPermissions,
        loadPermissions,
        total,
    }
}
