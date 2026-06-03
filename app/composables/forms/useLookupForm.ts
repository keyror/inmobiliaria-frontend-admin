import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { lookupSchema } from "~/schemas/lookupSchema";

import type { ILookup } from "~/interfaces/ILookup";

export const getLookupInitialValues = (
  initialData?: Partial<ILookup> | null,
) => ({
  category: initialData?.category ?? "",
  name: initialData?.name ?? "",
  alias: initialData?.alias ?? "",
  value: initialData?.value ?? null,
  code: initialData?.code ?? "",
  is_active: initialData?.is_active ?? true,
  lang: initialData?.lang ?? "ES",
  icon: initialData?.icon ?? "",
});

export const useLookupForm = (initialData?: Partial<ILookup> | null) => {
  return useForm({
    validationSchema: toTypedSchema(lookupSchema),
    initialValues: getLookupInitialValues(initialData),
  });
};
