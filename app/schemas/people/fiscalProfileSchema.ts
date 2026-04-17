import * as yup from "yup";

export const fiscalProfileSchema = yup.object({
  economic_activities: yup
    .array()
    .min(1, "Seleccione al menos una actividad económica")
    .required(),

  taxe_types: yup
    .array()
    .min(1, "Seleccione al menos una responsabilidad fiscal")
    .required(),

  responsible_for_vat_type_id: yup.string().required("Campo obligatorio"),

  vat_withholding: yup.string().nullable().notRequired(),

  income_tax_withholding: yup.string().nullable().notRequired(),

  ica_withholding: yup.string().nullable().notRequired(),

  rental_fee: yup.string().nullable().notRequired(),
});
