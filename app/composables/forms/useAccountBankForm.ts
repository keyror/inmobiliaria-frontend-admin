import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { accountBankFormSchema } from "~/schemas/people/accountBankSchema";

export const useAccountBankForm = () => {
  return useForm({
    validationSchema: toTypedSchema(accountBankFormSchema),
    initialValues: {
      accounts: [
        {
          bank_id: "",
          account_type_id: "",
          account_number: "",
          is_principal: true,
        },
      ],
    },
  });
};
