export const PropertySchema = {

    code: [
        { nullable: true },
        { minLength: 5, message: "Minimo 5 caracteres" }
    ],

    status_id: [
        { required: true, message: "Campo obligatorio" }
    ],

    status_property_id: [
        { required: true, message: "Campo obligatorio" }
    ],

    title: [
        { required: true, message: "Campo obligatorio" },
        { minLength: 5, message: "Minimo 5 caracteres" }
    ],

    offer_type_id: [
        { required: true, message: "Campo obligatorio" }
    ],

    property_type_id: [
        { required: true, message: "Campo obligatorio" }
    ],

    social_strata: [
        { required: true, message: "Campo obligatorio" }
    ],

    year_built: [
        { required: true, message: "Campo obligatorio" }
    ],

    rooms: [
        { required: true, message: "Campo obligatorio" }
    ],

    bedrooms: [
        { required: true, message: "Campo obligatorio" }
    ],

    bathrooms: [
        { required: true, message: "Campo obligatorio" }
    ],

    garage_type_id: [
        { required: true, message: "Campo obligatorio" }
    ],

    garage_spots: [
        { required: true, message: "Campo obligatorio" }
    ],

    cadastral_number: [
        { nullable: true },
    ],

    url_google_map: [
        { nullable: true },
    ],

    latitude: [
        { nullable: true },
        { numeric: true, message: "Debe ser un valor numérico" },
        { between: [-90, 90], message: "Debe estar entre -90 y 90" }
    ],

    longitude: [
        { nullable: true },
        { numeric: true, message: "Debe ser un valor numérico" },
        { between: [-180, 180], message: "Debe estar entre -180 y 180" }
    ],

    boundaries: [
        { nullable: true },
    ],

    description: [
        { nullable: true },
    ],
    features: [
        { nullable: true },
    ],
};
