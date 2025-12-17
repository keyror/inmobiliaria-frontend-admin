export const contactSchema = {
    mobile: [
        { required: true, message: "Campo obligatorio" },
        { min: 10, message: "El número móvil debe tener al menos 10 dígitos" },
    ],

    email: [
        { required: true, message: "Campo obligatorio" },
        { email: true, message: "Debe ser un correo electrónico válido" },
    ]
};
