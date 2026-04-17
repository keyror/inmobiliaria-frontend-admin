import * as yup from "yup";

import { emailSchema, passwordSchema } from "~/schemas/commonSchema";

export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
  remember_me: yup.boolean().default(false),
});

export const resetPasswordSchema = yup.object({
  email: emailSchema,
  token: yup.string().required("Token requerido"),
  password: passwordSchema,
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirmación requerida"),
});

export const forgotPasswordSchema = yup.object({
  email: emailSchema,
});
