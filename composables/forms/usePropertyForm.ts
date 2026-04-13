import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { propertySchema } from '~/schemas/property/propertySchema'

export const usePropertyForm = (initialData?: any) => {
    return useForm({
        validationSchema: toTypedSchema(propertySchema),
        initialValues: {
            title: initialData?.title ?? '',
            code: initialData?.code ?? '',
            cadastral_number: initialData?.cadastral_number ?? '',
            status_property_id: initialData?.status_property_id ?? '',
            status_id: initialData?.status_id ?? '',
            offer_type_id: initialData?.offer_type_id ?? '',
            property_type_id: initialData?.property_type_id ?? '',
            social_strata: initialData?.social_strata ?? '',
            year_built: initialData?.year_built ?? '',
            rooms: initialData?.rooms ?? '',
            bedrooms: initialData?.bedrooms ?? '',
            bathrooms: initialData?.bathrooms ?? '',
            garage_type_id: initialData?.garage_type_id ?? '',
            garage_spots: initialData?.garage_spots ?? '',
            description: initialData?.description ?? '',
            features: initialData?.features ?? [],
            url_google_map: initialData?.url_google_map ?? '',
            latitude: initialData?.latitude ?? '',
            longitude: initialData?.longitude ?? '',

            // nested
            price: {
                price_type_id: initialData?.price?.price_type_id ?? '',
                price_min: initialData?.price?.price_min ?? '',
                price_max: initialData?.price?.price_max ?? '',
                price: initialData?.price?.price ?? '',
                currency: initialData?.price?.currency ?? '',
            },

            images: initialData?.images ?? []
        }
    })
}
