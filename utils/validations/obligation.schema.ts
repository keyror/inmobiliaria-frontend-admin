export const obligationSchema = {
    obligation_type_id: [
        { required: true, message: "Campo obligatorio" },
    ],

    amount: [
        { required: true, message: "Campo obligatorio" },
    ],

    total: [
        { required: true, message: "Campo obligatorio" },
    ],

    frequency_type_id: [
        { required: true, message: "Campo obligatorio" },
    ],

    status_id: [
        { required: true, message: "Campo obligatorio" },
    ],
};
