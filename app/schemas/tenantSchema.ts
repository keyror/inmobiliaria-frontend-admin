import * as yup from "yup";

import { emailSchema } from "~/schemas/commonSchema";

export const tenantSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),

  email: emailSchema,

  domain: yup.string().required("El dominio es obligatorio"),

  plan_id: yup.string().required("El plan es obligatorio"),

  status_id: yup.string().required("El estado es obligatorio"),

  subscription_ends_at: yup
    .string()
    .nullable()
    .required("La fecha es obligatoria"),
});
