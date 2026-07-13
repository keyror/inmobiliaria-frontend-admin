import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as Yup from "yup";

const rentTenantsSchema = Yup.object({
  rent_tenants: Yup.array()
    .of(
      Yup.object({
        tenant_id: Yup.string().required("Arrendatario obligatorio"),
        codebtor_id: Yup.string().nullable().notRequired(),
        percentage: Yup.number().nullable().notRequired(),
      }),
    )
    .min(1, "Debe haber al menos un arrendatario")
    .required(),
});

export const useRentTenantsForm = () => {
  return useForm({
    validationSchema: toTypedSchema(rentTenantsSchema),
    initialValues: {
      rent_tenants: [{ tenant_id: "", codebtor_id: null, percentage: null }],
    },
  });
};
