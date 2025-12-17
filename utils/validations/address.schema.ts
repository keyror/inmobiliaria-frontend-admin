export const addressSchema = {
    address: [
        { required: true, message: "Campo obligatorio" },
    ],

    country: [
        { required: true, message: "Campo obligatorio" },
    ],

    department: [
        { required: true, message: "Campo obligatorio" },
    ],

    city: [
        { required: true, message: "Campo obligatorio" },
    ]
};
