import * as Yup from "yup";

export const rentSchema = Yup.object({
  property_id: Yup.string().required("Propiedad obligatoria"),
  status: Yup.string().required("Estado obligatorio"),
  contract_number: Yup.string().nullable().notRequired(),
  contract_type_id: Yup.string().required("Tipo de contrato obligatorio"),
  start_date: Yup.string().required("Fecha inicio obligatoria"),
  end_date: Yup.string().nullable().notRequired(),
  duration: Yup.number().integer("Duración debe ser en meses enteros").nullable().notRequired(),
  destination: Yup.string().nullable().notRequired(),
  activity: Yup.string().nullable().notRequired(),
  canon: Yup.number()
    .typeError("Canon debe ser un número")
    .required("Canon obligatorio")
    .positive("Canon debe ser positivo"),
  iva: Yup.number().min(0, "IVA no puede ser negativo").max(100, "IVA no puede superar 100%").nullable().notRequired(),
  administration_included: Yup.boolean().notRequired(),
  is_ph: Yup.boolean().notRequired(),
  interest_rate: Yup.number().min(0, "Interés no puede ser negativo").max(100, "Interés no puede superar 100%").nullable().notRequired(),
  increment_type_id: Yup.string().nullable().notRequired(),
  adjustment_date: Yup.string().nullable().notRequired(),
  is_insured: Yup.boolean().notRequired(),
  consignment_account: Yup.string().nullable().notRequired(),
  payment_bank_id: Yup.string().nullable().notRequired(),
  signed_city: Yup.string().nullable().notRequired(),
  signed_at: Yup.string().nullable().notRequired(),
  internal_notes: Yup.string().nullable().notRequired(),
  additional_clauses: Yup.array().of(Yup.string().nullable()).nullable().notRequired(),
});
