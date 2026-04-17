import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";

import { publishChannelFormSchema } from "~/schemas/property/publishChannelSchema";

export const usePublishChannelForm = () => {
  return useForm({
    validationSchema: toTypedSchema(publishChannelFormSchema),
    initialValues: {
      publish_channels: [
        {
          channel_id: "",
          external_link: "",
          status_id: "",
          published_at: "",
          unpublished_at: "",
        },
      ],
    },
  });
};
