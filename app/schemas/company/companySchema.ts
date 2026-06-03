import * as Yup from "yup";

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const companySchema = Yup.object({
  company_name: Yup.string().required("Razón social obligatoria"),
  tradename: Yup.string().required("Nombre comercial obligatorio"),
  nit: Yup.string().required("NIT obligatorio"),
  logo_image_id: Yup.string().nullable().notRequired(),
  legal_representative_id: Yup.string().required(
    "Representante legal obligatorio",
  ),
  person_attendant_id: Yup.string().required("Persona encargada obligatoria"),
  theme: Yup.object({
    colors: Yup.object({
      primary: Yup.string()
        .matches(hexColorRegex, {
          message: "Color primario inválido",
          excludeEmptyString: true,
        })
        .nullable()
        .notRequired(),
      secondary: Yup.string()
        .matches(hexColorRegex, {
          message: "Color secundario inválido",
          excludeEmptyString: true,
        })
        .nullable()
        .notRequired(),
    })
      .nullable()
      .notRequired(),
  })
    .nullable()
    .notRequired(),
});
