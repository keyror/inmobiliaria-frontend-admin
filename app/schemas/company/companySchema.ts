import * as Yup from "yup";

export const companySchema = Yup.object({
  company_name: Yup.string().required("Razón social obligatoria"),
  tradename: Yup.string().required("Nombre comercial obligatorio"),
  nit: Yup.string().required("NIT obligatorio"),
  logo_image_id: Yup.string().nullable().notRequired(),
  legal_representative_id: Yup.string().required(
    "Representante legal obligatorio",
  ),
  person_attendant_id: Yup.string().required("Persona encargada obligatoria"),
});
