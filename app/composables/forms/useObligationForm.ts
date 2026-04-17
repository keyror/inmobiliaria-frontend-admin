import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { obligationFormSchema } from "~/schemas/property/obligationSchema";

export const useObligationForm = () => {
  return useForm({
    validationSchema: toTypedSchema(obligationFormSchema),
    initialValues: {
      obligations: [
        {
          obligation_type_id: "",
          amount: 0,
          total: 0,
          frequency_type_id: "",
          expiration_date: "",
          status_id: "",
          description: "",
        },
      ],
    },
  });
};
