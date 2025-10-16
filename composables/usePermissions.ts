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
    const loadPermissions = (params?: IParamsTable) => {
        const query = params || { page: 1, perPage: 999 };

        LoadingService.show();
        RolePermissionService.getPermissions(query)
            .then((response) => {
                allPermissions.value = response.data.data;
                total.value = response.data.total ? response.data.total : 0;
                LoadingService.hide();
            })
            .catch((error) => {
                LoadingService.hide();
                AlertaService.showError('Ha ocurrido un error', error);
            });
    };

    return {
        allPermissions,
        loadPermissions,
        total,
    }
}
