import * as Yup from "yup";

export const areasFormSchema = Yup.object({
  areas: Yup.array()
    .of(
      Yup.object({
        area_type_id: Yup.string().required("Seleccione el tipo de área"),

        area_value: Yup.number()
          .typeError("Debe ser un número")
          .min(1, "El valor debe ser mayor a 0")
          .required("El valor es obligatorio"),

        area_unit_id: Yup.string().required("Seleccione la unidad"),
      }),
    )
    .min(1, "Debe agregar al menos un área")
    .required("Debe agregar al menos un área"),
});
