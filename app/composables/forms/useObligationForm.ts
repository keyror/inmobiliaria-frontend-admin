import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { obligationFormSchema } from "~/schemas/property/obligationSchema";

export const useObligationForm = () => {
  return useForm({
    validationSchema: toTypedSchema(obligationFormSchema),
    initialValues: {
      obligations: [],
    },
  });
};
