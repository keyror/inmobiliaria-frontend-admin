import type { MaybeRef, Ref } from "vue";
import type { IAddress } from "~/interfaces/IAddress";
import type { ICompany } from "~/interfaces/ICompany";
import type { IContact } from "~/interfaces/IContact";
import CompanyService from "~/services/CompanyService";

type PropertyWithContactInfo = {
  addresses?: IAddress[];
  contacts?: IContact[];
};

type ApiRun = <T>(promise: Promise<T>) => Promise<T | null>;

export const usePropertyCompanyDefaults = (
  property: Ref<PropertyWithContactInfo | null | undefined>,
  isEditing: MaybeRef<boolean>,
  run: ApiRun,
) => {
  const currentCompany = ref<ICompany | null>(null);

  const hasItems = (items?: unknown[]) =>
    Array.isArray(items) && items.length > 0;

  const addressesData = computed(() => {
    if (hasItems(property.value?.addresses)) return property.value?.addresses;

    if (!unref(isEditing) && hasItems(currentCompany.value?.addresses)) {
      return currentCompany.value?.addresses;
    }

    return property.value?.addresses;
  });

  const contactsData = computed(() => {
    if (hasItems(property.value?.contacts)) return property.value?.contacts;

    if (!unref(isEditing) && hasItems(currentCompany.value?.contacts)) {
      return currentCompany.value?.contacts;
    }

    return property.value?.contacts;
  });

  const getCurrentCompanyDefaults = async () => {
    if (unref(isEditing)) return;

    const response = await run(CompanyService.getCurrentCompany());
    if (response) {
      currentCompany.value = response.data ?? null;
    }
  };

  return {
    currentCompany,
    addressesData,
    contactsData,
    getCurrentCompanyDefaults,
  };
};
