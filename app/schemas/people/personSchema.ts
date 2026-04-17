import * as yup from "yup";

export const personSchema = yup.object({
  first_name: yup.string().required("Nombres es obligatorio"),

  last_name: yup.string().required("Apellidos es obligatorio"),

  document_type_id: yup.string().required("Tipo documento obligatorio"),

  document_number: yup.string().required("Número obligatorio"),

  document_from_id: yup.string().required("Lugar de expedición obligatorio"),

  organization_type_id: yup.string().required("Tipo organización obligatorio"),

  birth_date: yup.string().required("Fecha nacimiento obligatoria"),

  gender_type_id: yup.string().required("Género obligatorio"),

  dv: yup.string().notRequired(),

  company_name: yup.string().nullable().notRequired(),
});
