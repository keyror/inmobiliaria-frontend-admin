import * as yup from "yup";

export const addressFormSchema = yup.object({
  addresses: yup
    .array()
    .of(
      yup.object({
        address: yup.string().required("La dirección es obligatoria"),

        via_type_id: yup.string().required("Seleccione el tipo de vía"),
        via_number: yup.string().required("Ingrese el número de vía"),
        number2: yup.string().required("Ingrese el número de cruce"),
        number3: yup.string().required("Ingrese el número de placa"),

        country_id: yup.string().required("Seleccione el país"),
        department_id: yup.string().required("Seleccione el departamento"),

        city_id: yup
          .string()
          .nullable()
          .when("department_id", {
            is: (val: string) => !!val && val.trim() !== "",
            then: (schema) => schema.required("Seleccione la ciudad"),
            otherwise: (schema) => schema.notRequired(),
          }),

        letra1_id: yup.string().nullable().notRequired(),
        orientation1_id: yup.string().nullable().notRequired(),
        letra2_id: yup.string().nullable().notRequired(),
        orientation2_id: yup.string().nullable().notRequired(),

        complement: yup.string().nullable().notRequired(),
        zip_code: yup.string().nullable().notRequired(),
        sector: yup.string().nullable().notRequired(),
        stratum_id: yup.string().nullable().notRequired(),

        is_principal: yup.boolean().nullable().default(false),
      }),
    )
    .min(1, "Debe agregar al menos una dirección")
    .test(
      "one-principal",
      "Debe seleccionar una dirección principal",
      (addresses) => addresses?.some((a) => a?.is_principal) ?? false,
    ),
});
