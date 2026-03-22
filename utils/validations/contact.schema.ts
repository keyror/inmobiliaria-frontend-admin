export const contactSchema = {
    mobile: [
        { required: true, message: "Campo obligatorio" },
        { min: 10, message: "El número móvil debe tener al menos 10 dígitos" },
    ],

    email: [
        { required: true, message: "Campo obligatorio" },
        { email: true, message: "Debe ser un correo electrónico válido" },
    ],

    phone: [
        { nullable: true },
        { min: 7, message: "El teléfono fijo debe tener al menos 7 dígitos" },
    ],

    is_principal: [
        { nullable: true }
    ]
};
