import * as Yup from "yup";

export const publishChannelFormSchema = Yup.object({
  publish_channels: Yup.array()
    .of(
      Yup.object({
        channel_id: Yup.string().required("El canal es obligatorio"),

        external_link: Yup.string().nullable().notRequired(),

        status_id: Yup.string().required("El estado es obligatorio"),

        published_at: Yup.string().nullable().notRequired(),

        unpublished_at: Yup.string().nullable().notRequired(),
      }),
    )
    .min(1, "Debe agregar al menos un canal")
    .required("Debe agregar al menos un canal"),
});
