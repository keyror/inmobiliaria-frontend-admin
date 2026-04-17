import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { contactFormSchema } from "~/schemas/people/contactSchema";

export const useContactForm = () => {
  return useForm({
    validationSchema: toTypedSchema(contactFormSchema),
    initialValues: {
      contacts: [
        {
          phone: "",
          mobile: "",
          email: "",
          is_principal: true,
        },
      ],
    },
  });
};
