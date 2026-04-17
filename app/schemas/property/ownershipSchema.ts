import * as Yup from "yup";

export const ownershipFormSchema = Yup.object({
  ownerships: Yup.array()
    .of(
      Yup.object({
        person_id: Yup.string().required("La persona es obligatoria"),

        ownership_percentage: Yup.number()
          .typeError("Debe ser un número")
          .min(1, "Debe ser mayor a 0")
          .max(100, "No puede ser mayor a 100")
          .required("El porcentaje es obligatorio"),

        status_id: Yup.string().required("El estado es obligatorio"),

        ownership_start_date: Yup.string().nullable().notRequired(),

        ownership_end_date: Yup.string().nullable().notRequired(),

        is_principal_owner: Yup.boolean().required(),
      }),
    )
    .min(1, "Debe agregar al menos un propietario")
    .test(
      "has-principal-owner",
      "Debe seleccionar un propietario principal",
      (items) => items?.some((i) => i.is_principal_owner),
    )
    .test(
      "total-percentage-100",
      "El total de porcentaje debe ser 100%",
      (items) => {
        const total = (items || []).reduce(
          (sum, i) => sum + (Number(i.ownership_percentage) || 0),
          0,
        );
        return total === 100;
      },
    )
    .required("Debe agregar al menos un propietario"),
});
