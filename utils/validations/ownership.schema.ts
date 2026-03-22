export const ownershipSchema = {
    person_id: [
        { required: true, message:  "Campo obligatorio" }
    ],

    ownership_percentage: [
        { required: true, message:  "Campo obligatorio" },
        { numeric: true, message: "Campo debe ser numérico" },
        { between: [0, 100], message: "Campo debe estar entre 1 y 100" }
    ],

    is_primary_owner: [
        { nullable: true } // no obligatorio
    ],

    ownership_start_date: [
        { nullable: true }
    ],

    ownership_end_date: [
        { nullable: true }
    ],

    status_id: [
        { required: true, message: "Campo obligatorio" }
    ]
};
