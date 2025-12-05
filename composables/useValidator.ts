import { reactive } from "vue";

const errors = reactive<{ [key: string]: string }>({});

export function useValidator() {

    // Definimos reglas base
    const rulesMap: any = {
        required: (value: any, msg?: string) =>
            value !== null && value !== undefined && value !== ""
                ? true
                : msg || "Campo obligatorio",

        min: (value: any, minValue: number, msg?: string) =>
            Number(value) >= minValue
                ? true
                : msg || `El mínimo permitido es ${minValue}`,

        max: (value: any, maxValue: number, msg?: string) =>
            Number(value) <= maxValue
                ? true
                : msg || `El máximo permitido es ${maxValue}`,

        minLength: (value: string, length: number, msg?: string) =>
            value?.length >= length
                ? true
                : msg || `Debe tener mínimo ${length} caracteres`,

        email: (value: string, msg?: string) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? true
                : msg || "Email inválido",

        maxLength: (value: string, length: number, msg?: string) =>
            value?.length <= length
                ? true
                : msg || `Debe tener máximo ${length} caracteres`,


        numeric: (value: any, msg?: string) =>
            /^[0-9]+$/.test(String(value))
                ? true
                : msg || "Solo se permiten números",


        between: (value: number, min: number, max: number, msg?: string) =>
            value >= min && value <= max
                ? true
                : msg || `Debe estar entre ${min} y ${max}`,

        regex: (value: any, pattern: RegExp, msg?: string) =>
            pattern.test(value)
                ? true
                : msg || "Formato inválido",


    };

    function normalizeRule(ruleObj: any) {
        // obtener nombre de la regla: required, min, max, etc.
        const ruleName = Object.keys(ruleObj).find(key => key !== "message");
        if (!ruleName) return null;

        const ruleValue = ruleObj[ruleName];
        const message = ruleObj.message;

        // { required: true, message }
        if (ruleValue === true) return [ruleName, message];

        // { required: "Mensaje personalizado" }
        if (typeof ruleValue === "string") return [ruleName, ruleValue];

        // { min: 0, message }
        if (typeof ruleValue === "number") return [ruleName, ruleValue, message];

        // { min: [0, "Mensaje"] }
        if (Array.isArray(ruleValue)) {
            return message
                ? [ruleName, ...ruleValue, message] // si hay mensaje → lo agrega al final
                : [ruleName, ...ruleValue];         // si no hay mensaje → funciona normal
        }

        return null;
    }

    function validateField(name: string, value: any, rules: any[]) {
        errors[name] = "";

        for (const ruleObj of rules) {
            const normalized = normalizeRule(ruleObj);
            if (!normalized) continue;

            const [ruleName, ...params] = normalized;
            const validator = rulesMap[ruleName];
            if (!validator) continue;

            // EXTRAEMOS EL MENSAJE PERSONALIZADO SI EXISTE
            let msg = undefined;

            // Si el último parámetro es string, es un mensaje custom
            if (typeof params[params.length - 1] === "string") {
                msg = params.pop(); // lo removemos y guardamos
            }

            const result = validator(value, ...params, msg);

            if (result !== true) {
                errors[name] = result;
                break;
            }
        }
    }


    function validateForm(form: any, schema: any) {
        let isValid = true;

        Object.keys(schema).forEach((field) => {
            validateField(field, form[field], schema[field]);
            if (errors[field]) isValid = false;
        });

        return isValid;
    }

    return {
        errors,
        validateField,
        validateForm,
    };
}
