import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { roleSchema } from "~/schemas/authorizationSchema";

export const useRoleForm = () => {
  return useForm({
    validationSchema: toTypedSchema(roleSchema),
    initialValues: {
      name: "",
    },
  });
};
