import * as yup from "yup";

export const contactFormSchema = yup.object({
  contacts: yup
    .array()
    .of(
      yup.object({
        phone: yup.string().nullable().notRequired(),

        mobile: yup.string().required("El teléfono móvil es obligatorio"),

        email: yup
          .string()
          .required("El correo es obligatorio")
          .email("Correo no válido"),

        is_principal: yup.boolean().default(false),
      }),
    )
    .min(1, "Debe agregar al menos un contacto")
    .test(
      "one-principal",
      "Debe seleccionar un contacto principal",
      (contacts) => contacts?.some((c) => c?.is_principal) ?? false,
    ),
});
