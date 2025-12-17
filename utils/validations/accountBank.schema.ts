export const accountBankSchema = {
    bank_id: [
        { required: true, message: "Campo obligatorio" },
    ],

    account_type_id: [
        { required: true, message: "Campo obligatorio" },
    ],

    account_number: [
        { required: true, message: "Campo obligatorio" },
        { min: 5, message: "El número de cuenta debe tener al menos 5 caracteres" },
    ]
};
