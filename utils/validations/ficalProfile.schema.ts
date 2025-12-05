export const fiscalProfileSchema = {
    vat_withholding: [
        { required: true, message: "La retención de IVA es obligatoria" },
        { min: 0, message: "El valor mínimo permitido es 0%" },
        { max: 100, message: "El valor máximo permitido es 100%" },
        { between: [0, 100], message: "El valor debe estar entre 0% y 100%" }
    ],
};
