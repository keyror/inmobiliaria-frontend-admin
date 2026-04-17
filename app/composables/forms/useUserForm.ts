import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { userCreateSchema, userUpdateSchema } from "~/schemas/userSchema";

export const useUserForms = () => {
  const useUserCreateForm = () => {
    return useForm({
      validationSchema: toTypedSchema(userCreateSchema),
      initialValues: {
        email: "",
        password: "",
        password_confirmation: "",
        status_type_id: "",
        roles: [],
      },
    });
  };

  const useUserUpdateForm = (initialData?: any) => {
    return useForm({
      validationSchema: toTypedSchema(userUpdateSchema),
      initialValues: {
        email: initialData?.email ?? "",
        password: "",
        password_confirmation: "",
        status_type_id: initialData?.status_type_id ?? "",
        roles: initialData?.roles ?? [],
      },
    });
  };

  return {
    useUserCreateForm,
    useUserUpdateForm,
  };
};
