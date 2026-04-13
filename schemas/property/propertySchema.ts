import { z } from 'zod'

export const propertySchema = z.object({
    title: z.string().min(1, 'Título obligatorio'),
    code: z.string().optional().nullable(),
    cadastral_number: z.string().optional().nullable(),

    status_property_id: z.string().min(1, 'Estado obligatorio'),
    status_id: z.string().min(1, 'Estado obligatorio'),
    offer_type_id: z.string().min(1, 'Tipo oferta obligatorio'),
    property_type_id: z.string().min(1, 'Tipo propiedad obligatorio'),

    social_strata: z.string().min(1, 'Estrato obligatorio'),
    year_built: z.string().min(1, 'Año obligatorio'),

    rooms: z.string().optional().nullable(),
    bedrooms: z.string().optional().nullable(),
    bathrooms: z.string().optional().nullable(),

    garage_type_id: z.string().optional().nullable(),
    garage_spots: z.string().optional().nullable(),

    description: z.string().optional().nullable(),

    features: z.array(z.string()).optional().nullable(),

    url_google_map: z.string().optional().nullable(),
    latitude: z.string().optional().nullable(),
    longitude: z.string().optional().nullable(),

    price: z.object({
        price_type_id: z.string().optional().nullable(),
        price_min: z.string().optional().nullable(),
        price_max: z.string().optional().nullable(),
        price: z.string().optional().nullable(),
        currency: z.string().optional().nullable(),
    }),

    images: z.array(z.any()).optional().nullable()
})
