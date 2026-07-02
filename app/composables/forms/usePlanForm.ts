import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { planSchema } from "~/schemas/planSchema";

const defaultValues = {
  name: "",
  description: null,
  price: 0,
  frequency_type_id: null,
  discount: null,
  max_users: 3,
  max_properties: 30,
  max_images_per_property: 10,
  is_active: true,
};

export const usePlanForms = () => {
  const usePlanCreateForm = () => {
    return useForm({
      validationSchema: toTypedSchema(planSchema),
      initialValues: defaultValues,
    });
  };

  const usePlanUpdateForm = () => {
    return useForm({
      validationSchema: toTypedSchema(planSchema),
      initialValues: defaultValues,
    });
  };

  return { usePlanCreateForm, usePlanUpdateForm };
};
