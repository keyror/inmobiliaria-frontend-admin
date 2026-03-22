export const fiscalProfileSchema = {

    economic_activities: [
        { required: true, message: "Campo obligatorio" },
    ],

    responsible_for_vat_type_id: [
        { required: true, message: "Campo obligatorio" },
    ],

    taxe_types: [
        { required: true, message: "Campo obligatorio" },
    ],

    vat_withholding: [
        { nullable: true },
        { min: 0, message: "El valor mínimo permitido es 0%" },
        { max: 100, message: "El valor máximo permitido es 100%" },
    ],

    income_tax_withholding: [
        { nullable: true },
        { min: 0, message: "El valor mínimo permitido es 0%" },
        { max: 100, message: "El valor máximo permitido es 100%" },
    ],

    ica_withholding: [
        { nullable: true },
        { min: 0, message: "El valor mínimo permitido es 0%" },
        { max: 100, message: "El valor máximo permitido es 100%" },
    ],

    rental_fee: [
        { nullable: true },
        { min: 0, message: "El valor mínimo permitido es 0" },
    ],
};
