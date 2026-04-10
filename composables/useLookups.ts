import LookupService from '~/services/LookupService'
import { useApiHandler } from '~/composables/useApiHandler'
import { Constants } from '~/constants/Constants'
import type { ILookupsResponse } from '~/interfaces/ILookup'
import type { IIndexLookupsRequest } from '~/interfaces/IIndexLookupsRequest'

export function useLookups(categories: string[]) {
    const { run } = useApiHandler()
    const lookups = ref<ILookupsResponse>({})

    const getLookups = async () => {
        const payload: IIndexLookupsRequest = { categories }
        const response = await run(LookupService.getLookups(payload))
        if (response) {
            lookups.value = response.data
        }
    }

    getLookups()

    return { lookups }
}
