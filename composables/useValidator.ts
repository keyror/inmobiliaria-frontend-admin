import { reactive } from "vue";

const errors = reactive<{ [key: string]: string }>({});

export function useValidator() {

    // Definimos reglas base
    const rulesMap: any = {
        required: (value: any, msg?: string) => {

            if (typeof value === "boolean") {
                return value === true ? true : msg || "Campo obligatorio";
            }

            // strings, null, undefined
            if (value === null || value === undefined || value === "") {
                return msg || "Campo obligatorio";
            }

            // arrays vacíos
            if (Array.isArray(value) && value.length === 0) {
                return msg || "Campo obligatorio";
            }

            return true;
        },

        nullable: () => true,

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
            !isNaN(value) && value !== null && value !== ""
                ? true
                : msg || "Campo debe ser numérico",

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

        const isEmpty =
            value === null ||
            value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0);

        const hasNullable = rules.some(rule => rule.nullable === true);

        if (hasNullable && isEmpty) {
            return;
        }

        for (const ruleObj of rules) {
            const normalized = normalizeRule(ruleObj);
            if (!normalized) continue;

            const [ruleName, ...params] = normalized;

            const validator = rulesMap[ruleName];
            if (!validator) continue;

            let msg = undefined;

            if (typeof params[params.length - 1] === "string") {
                msg = params.pop();
            }

            const result = validator(value, ...params, msg);

            if (result !== true) {
                errors[name] = result;
                break;
            }
        }
    }

    /**
     * Valida un formulario simple (objeto)
     * @param form - Objeto con los datos del formulario
     * @param schema - Schema de validación
     * @returns true si el formulario es válido, false en caso contrario
     */
    function validateSimpleForm(form: any, schema: any) {
        let isValid = true;

        Object.keys(schema).forEach((field) => {
            validateField(field, form[field], schema[field]);
            if (errors[field]) isValid = false;
        });

        return isValid;
    }

    /**
     * Valida un array de objetos con campos dinámicos
     * @param items - Array de objetos a validar
     * @param schema - Schema de validación
     * @returns true si todos los items son válidos, false en caso contrario
     */
    function validateDynamicForm(items: any[], schema: any) {
        let allValid = true;

        items.forEach((item, index) => {
            // Validar cada campo del item con un nombre único
            Object.keys(schema).forEach((field) => {
                const fieldName = `${field}_${index}`;
                validateField(fieldName, item[field], schema[field]);

                if (errors[fieldName]) {
                    allValid = false;
                }
            });
        });

        return allValid;
    }

    /**
     * Valida un formulario (simple o dinámico)
     * Detecta automáticamente si es un array (dinámico) o un objeto (simple)
     * @param form - Objeto o array de objetos a validar
     * @param schema - Schema de validación
     * @param dinamicForm - dinamicForm
     * @returns true si el formulario es válido, false en caso contrario
     */
    function validateForm(form: any, schema: any, dinamicForm = false) {
        // Detectar automáticamente si es un array (dinámico) o un objeto (simple)
        if (Array.isArray(form) && dinamicForm) {
            return validateDynamicForm(form, schema);
        } else {
            return validateSimpleForm(form, schema);
        }
    }

    /**
     * Resetea solo los errores de campos dinámicos con un prefijo específico
     * @param prefix - Prefijo de los campos a resetear (ej: 'bank_id')
     */
    function resetDynamicErrors(prefix?: string) {
        if (prefix) {
            Object.keys(errors).forEach(key => {
                if (key.startsWith(prefix)) {
                    errors[key] = "";
                }
            });
        } else {
            resetErrors();
        }
    }

    /**
     * Limpia errores de un índice específico en campos dinámicos
     * @param index - Índice del item eliminado
     */
    function cleanErrorsByIndex(index: number) {
        Object.keys(errors).forEach(key => {
            if (key.endsWith(`_${index}`)) {
                delete errors[key];
            }
        });
    }

    function resetErrors() {
        Object.keys(errors).forEach(key => errors[key] = "");
    }

    return {
        errors,
        validateField,
        validateForm,
        resetErrors,
        resetDynamicErrors,
        cleanErrorsByIndex,
    };
}
