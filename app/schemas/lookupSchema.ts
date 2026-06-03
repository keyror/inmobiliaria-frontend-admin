import * as yup from "yup";

export const lookupSchema = yup.object({
  category: yup
    .string()
    .required("La categoría es obligatoria")
    .max(255, "La categoría no puede superar 255 caracteres"),
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .max(255, "El nombre no puede superar 255 caracteres"),
  alias: yup
    .string()
    .nullable()
    .max(255, "El alias no puede superar 255 caracteres"),
  value: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? null : value,
    )
    .min(-999999.99, "El valor mínimo es -999999.99")
    .max(999999.99, "El valor máximo es 999999.99"),
  code: yup
    .string()
    .nullable()
    .max(255, "El código no puede superar 255 caracteres"),
  is_active: yup.boolean().nullable(),
  lang: yup
    .string()
    .nullable()
    .max(10, "El idioma no puede superar 10 caracteres"),
  icon: yup
    .string()
    .nullable()
    .max(255, "El ícono no puede superar 255 caracteres"),
});
