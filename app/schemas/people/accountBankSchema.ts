import * as yup from "yup";

export const accountBankFormSchema = yup.object({
  accounts: yup
    .array()
    .of(
      yup.object({
        bank_id: yup.string().required("Seleccione el banco"),

        account_type_id: yup.string().required("Seleccione el tipo de cuenta"),

        account_number: yup.string().required("Ingrese el número de cuenta"),

        is_principal: yup.boolean().default(false),
      }),
    )
    .min(1, "Debe agregar al menos una cuenta")
    .test(
      "one-principal",
      "Debe seleccionar una cuenta principal",
      (accounts) => accounts?.some((acc) => acc?.is_principal) ?? false,
    ),
});
