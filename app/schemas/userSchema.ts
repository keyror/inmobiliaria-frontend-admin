import * as yup from "yup";

import { emailSchema, passwordSchema } from "@/schemas/commonSchema";

/**
 * Base schema
 */
const baseUserSchema = yup.object({
  email: emailSchema,

  status_type_id: yup.string().required("El estado es obligatorio"),

  roles: yup
    .array()
    .min(1, "Seleccione al menos un rol")
    .required("Seleccione al menos un rol"),
});

/**
 * CREATE
 */
export const userCreateSchema = baseUserSchema.shape({
  password: passwordSchema,

  password_confirmation: yup
    .string()
    .required("Confirme la contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
});

/**
 * UPDATE
 */
export const userUpdateSchema = baseUserSchema.shape({
  password: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .notRequired()
    .test(
      "password-valid",
      "La contraseña debe tener al menos 8 caracteres, letras y números",
      (value) => {
        if (!value) return true; // no se envía password → OK
        return passwordSchema.isValidSync(value);
      },
    ),

  password_confirmation: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .when("password", {
      is: (val: string | undefined) => !!val,
      then: (schema) =>
        schema
          .required("Confirme la contraseña")
          .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
      otherwise: (schema) => schema.notRequired(),
    }),
});
