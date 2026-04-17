import * as Yup from "yup";

export const propertySchema = Yup.object({
  title: Yup.string().required("Título obligatorio"),

  code: Yup.string().nullable().notRequired(),
  cadastral_number: Yup.string().nullable().notRequired(),

  status_property_id: Yup.string().required("Estado obligatorio"),
  status_id: Yup.string().required("Estado obligatorio"),
  offer_type_id: Yup.string().required("Tipo oferta obligatorio"),
  property_type_id: Yup.string().required("Tipo propiedad obligatorio"),

  social_strata: Yup.string().required("Estrato obligatorio"),
  year_built: Yup.number()
    .typeError("Año inválido")
    .required("Año obligatorio"),

  rooms: Yup.string().nullable().notRequired(),
  bedrooms: Yup.string().nullable().notRequired(),
  bathrooms: Yup.string().nullable().notRequired(),

  garage_type_id: Yup.string().nullable().notRequired(),
  garage_spots: Yup.string().nullable().notRequired(),

  description: Yup.string().nullable().notRequired(),

  features: Yup.array().of(Yup.string()).nullable().notRequired(),

  url_google_map: Yup.string().nullable().notRequired(),
  latitude: Yup.string().nullable().notRequired(),
  longitude: Yup.string().nullable().notRequired(),

  price: Yup.object({
    price_type_id: Yup.string().nullable().notRequired(),
    price_min: Yup.string().nullable().notRequired(),
    price_max: Yup.string().nullable().notRequired(),
    price: Yup.string().nullable().notRequired(),
    currency: Yup.string().nullable().notRequired(),
  })
    .nullable()
    .notRequired(),

  images: Yup.array().of(Yup.mixed()).nullable().notRequired(),
});
