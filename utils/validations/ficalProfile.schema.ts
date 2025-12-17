export const fiscalProfileSchema = {
  /*  vat_withholding: [
        { required: true, message: "Campo obligatorio" },
        { min: 0, message: "El valor mínimo permitido es 0%" },
        { max: 100, message: "El valor máximo permitido es 100%" },
        { between: [0, 100], message: "El valor debe estar entre 0% y 100%" }
    ],*/

    economic_activities: [
        { required: true, message: "Campo obligatorio"},
    ],

    responsible_for_vat_type_id: [
        { required: true, message: "Campo obligatorio"},
    ],

    taxe_types: [
        { required: true, message: "Campo obligatorio"},
    ]
};
