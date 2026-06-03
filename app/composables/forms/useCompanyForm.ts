import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { DEFAULT_COMPANY_THEME_COLORS } from "~/constants/CompanyTheme";
import { companySchema } from "~/schemas/company/companySchema";

import type { ICompany } from "~/interfaces/ICompany";

export const useCompanyForm = (initialData?: Partial<ICompany> | null) => {
  return useForm({
    validationSchema: toTypedSchema(companySchema),
    initialValues: {
      company_name: initialData?.company_name ?? "",
      tradename: initialData?.tradename ?? "",
      nit: initialData?.nit ?? "",
      logo_image_id: initialData?.logo_image_id ?? "",
      legal_representative_id: initialData?.legal_representative_id ?? "",
      person_attendant_id: initialData?.person_attendant_id ?? "",
      theme: {
        colors: {
          primary:
            initialData?.theme?.colors?.primary ??
            DEFAULT_COMPANY_THEME_COLORS.primary,
          secondary:
            initialData?.theme?.colors?.secondary ??
            DEFAULT_COMPANY_THEME_COLORS.secondary,
        },
      },
    },
  });
};
