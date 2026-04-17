import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { ownershipFormSchema } from "~/schemas/property/ownershipSchema";

export const useOwnershipForm = () => {
  return useForm({
    validationSchema: toTypedSchema(ownershipFormSchema),
    initialValues: {
      ownerships: [
        {
          person_id: "",
          ownership_percentage: 0,
          status_id: "",
          ownership_start_date: "",
          ownership_end_date: "",
          is_principal_owner: true,
        },
      ],
    },
  });
};
