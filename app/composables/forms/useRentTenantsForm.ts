import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as Yup from "yup";

const rentTenantsSchema = Yup.object({
  rent_tenants: Yup.array()
    .of(
      Yup.object({
        tenant_id: Yup.string().required("Arrendatario obligatorio"),
      }),
    )
    .min(1, "Debe haber al menos un arrendatario")
    .required(),
  rent_codebtors: Yup.array()
    .of(
      Yup.object({
        codebtor_id: Yup.string().nullable().notRequired(),
      }),
    )
    .notRequired(),
});

export const useRentTenantsForm = () => {
  return useForm({
    validationSchema: toTypedSchema(rentTenantsSchema),
    initialValues: {
      rent_tenants: [{ tenant_id: "" }],
      rent_codebtors: [{ codebtor_id: null }] as any[],
    },
  });
};
