import { useApiHandler } from "~/composables/useApiHandler";
import { Constants } from "~/constants/Constants";
import LookupService from "~/services/LookupService";

import type { IIndexLookupsRequest } from "~/interfaces/IIndexLookupsRequest";
import type { ILookupsResponse } from "~/interfaces/ILookup";

export function useLookups(categories: string[]) {
  const { run } = useApiHandler();
  const lookups = ref<ILookupsResponse>({});

  const getLookups = async () => {
    const payload: IIndexLookupsRequest = { categories };
    const response = await run(LookupService.getLookups(payload));
    if (response) {
      lookups.value = response.data;
    }
  };

  getLookups();

  return { lookups };
}
