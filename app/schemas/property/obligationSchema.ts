import * as Yup from "yup";

export const obligationFormSchema = Yup.object({
  obligations: Yup.array()
    .of(
      Yup.object({
        obligation_type_id: Yup.string().required(
          "Tipo de obligación obligatorio",
        ),

        amount: Yup.number()
          .typeError("El monto debe ser un número")
          .min(1, "El monto debe ser mayor a 0")
          .required("El monto es obligatorio"),

        total: Yup.number()
          .typeError("El total debe ser un número")
          .min(1, "El total debe ser mayor a 0")
          .required("El total es obligatorio"),

        frequency_type_id: Yup.string().required("Frecuencia obligatoria"),

        expiration_date: Yup.string().nullable().notRequired(),

        status_id: Yup.string().required("Estado obligatorio"),

        description: Yup.string().nullable().notRequired(),
      }),
    )
    .min(1, "Debe agregar al menos una obligación")
    .required("Debe agregar al menos una obligación"),
});
