import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { addressFormSchema } from "~/schemas/people/addressSchema";

export const useAddressForm = () => {
  return useForm({
    validationSchema: toTypedSchema(addressFormSchema),
    initialValues: {
      addresses: [
        {
          address: "",
          via_type_id: "",
          via_number: "",
          number2: "",
          number3: "",
          country_id: "",
          department_id: "",
          city_id: "",
          letra1_id: "",
          orientation1_id: "",
          letra2_id: "",
          orientation2_id: "",
          complement: "",
          zip_code: "",
          sector: "",
          stratum_id: "",
          is_principal: true,
        },
      ],
    },
  });
};
