export const person = {
    /*  vat_withholding: [
          { required: true, message: "Campo obligatorio" },
          { min: 0, message: "El valor mínimo permitido es 0%" },
          { max: 100, message: "El valor máximo permitido es 100%" },
          { between: [0, 100], message: "El valor debe estar entre 0% y 100%" }
      ],*/

    first_name: [
        { required: true, message: "Campo obligatorio"},
    ],

    last_name: [
        { required: true, message: "Campo obligatorio"},
    ],

    document_type_id: [
        { required: true, message: "Campo obligatorio"},
    ],

    document_number: [
        { required: true, message: "Campo obligatorio"},
    ],

    document_from: [
        { required: true, message: "Campo obligatorio"},
    ],

    organization_type_id: [
        { required: true, message: "Campo obligatorio"},
    ],

    birth_date: [
        { required: true, message: "Campo obligatorio"},
    ],

    gender_type_id: [
        { required: true, message: "Campo obligatorio"},
    ],

    document_from_id: [
        { required: true, message: "Campo obligatorio"},
    ],

};
