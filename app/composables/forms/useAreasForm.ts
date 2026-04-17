import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { areasFormSchema } from "~/schemas/property/areasSchema";

export const useAreasForm = () => {
  return useForm({
    validationSchema: toTypedSchema(areasFormSchema),
    initialValues: {
      areas: [
        {
          area_type_id: "",
          area_value: 0,
          area_unit_id: "",
        },
      ],
    },
  });
};
