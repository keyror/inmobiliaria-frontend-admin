import { defineRule, configure } from 'vee-validate'

export default defineNuxtPlugin(() => {
    configure({
        validateOnInput: true,
        validateOnBlur: true,
        validateOnChange: true
    })
})
