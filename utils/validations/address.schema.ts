export const addressSchema = {
    address: [
        { required: true, message: "Campo obligatorio" },
    ],

    country_id: [
        { required: true, message: "Campo obligatorio" },
    ],

    department_id: [
        { required: true, message: "Campo obligatorio" },
    ],

    city_id: [
        { required: true, message: "Campo obligatorio" },
    ],

    via_type_id: [
        { required: true, message: "Campo obligatorio" },
    ],

    via_number: [
        { required: true, message: "Campo obligatorio" },
    ],

    number2: [
        { required: true, message: "Campo obligatorio" },
    ],

    number3: [
        { required: true, message: "Campo obligatorio" },
    ],

    letra1_id: [
        { nullable: true }
    ],

    orientation1_id: [
        { nullable: true }
    ],

    letra2_id: [
        { nullable: true }
    ],

    orientation2_id: [
        { nullable: true }
    ],

    complement: [
        { nullable: true }
    ],

    zip_code: [
        { nullable: true }
    ],

    sector: [
        { nullable: true }
    ],

    stratum_id: [
        { nullable: true }
    ],

    is_principal: [
        { nullable: true }
    ],

};
