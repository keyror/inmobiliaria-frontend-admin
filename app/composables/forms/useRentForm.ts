import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { rentSchema } from "~/schemas/rent/rentSchema";

export const useRentForm = (initialData?: any) => {
  return useForm({
    validationSchema: toTypedSchema(rentSchema),
    initialValues: {
      property_id: initialData?.property_id ?? "",
      status: initialData?.status ?? "activo",
      contract_number: initialData?.contract_number ?? "",
      contract_type_id: initialData?.contract_type_id ?? "",
      start_date: initialData?.start_date ?? "",
      end_date: initialData?.end_date ?? "",
      duration: initialData?.duration ?? null,
      destination: initialData?.destination ?? "",
      activity: initialData?.activity ?? "",
      canon: initialData?.canon ?? null,
      iva: initialData?.iva ?? null,
      administration_included: initialData?.administration_included ?? false,
      is_ph: initialData?.is_ph ?? false,
      interest_rate: initialData?.interest_rate ?? null,
      increment_type_id: initialData?.increment_type_id ?? "",
      adjustment_date: initialData?.adjustment_date ?? "",
      is_insured: initialData?.is_insured ?? false,
      consignment_account: initialData?.consignment_account ?? "",
      payment_bank_id: initialData?.payment_bank_id ?? "",
      signed_city: initialData?.signed_city ?? "",
      signed_at: initialData?.signed_at ?? "",
      internal_notes: initialData?.internal_notes ?? "",
      additional_clauses: initialData?.additional_clauses ?? [],
    },
  });
};
