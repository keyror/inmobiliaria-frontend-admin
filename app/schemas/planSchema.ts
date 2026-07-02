import * as yup from "yup";

export const planSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),

  description: yup.string().nullable().notRequired(),

  price: yup
    .number()
    .typeError("El precio debe ser un número")
    .required("El precio es obligatorio")
    .min(0, "El precio no puede ser negativo"),

  frequency_type_id: yup.string().nullable().notRequired(),

  discount: yup
    .number()
    .nullable()
    .min(0, "Mínimo 0%")
    .max(100, "Máximo 100%")
    .notRequired(),

  max_users: yup
    .number()
    .typeError("Debe ser un número")
    .required("Campo requerido")
    .min(1, "Mínimo 1"),

  max_properties: yup
    .number()
    .typeError("Debe ser un número")
    .required("Campo requerido")
    .min(1, "Mínimo 1"),

  max_images_per_property: yup
    .number()
    .typeError("Debe ser un número")
    .required("Campo requerido")
    .min(1, "Mínimo 1"),

  is_active: yup.boolean().required(),
});
