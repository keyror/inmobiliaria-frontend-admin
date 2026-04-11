export const useFormErrorDistributor = (
    refs: Record<string, Ref<any>>,
    tabMap: Record<string, string>,
    switchTab: (tab: string) => void
) => {
    const distributeErrors = (errors: Record<string, string>): void => {
        const errorsByRef = new Map<Ref<any>, Record<string, string>>()

        for (const [field, message] of Object.entries(errors)) {
            const prefix = field.split('.')[0]
            const ref = refs[prefix]

            if (ref) {
                if (!errorsByRef.has(ref)) {
                    errorsByRef.set(ref, {})
                }

                const parts = field.split('.')
                const isArrayField = !isNaN(Number(parts[1]))
                const cleanField = isArrayField ? field : parts.slice(1).join('.')

                errorsByRef.get(ref)![cleanField] = message
            }
        }

        let firstTabWithError: string | null = null

        for (const [ref, refErrors] of errorsByRef) {
            ref.value?.setBackendErrors?.(refErrors)

            if (!firstTabWithError) {
                const match = Object.keys(refs).find(k => refs[k] === ref)
                if (match) firstTabWithError = tabMap[match]
            }
        }

        if (firstTabWithError) switchTab(firstTabWithError)
    }

    return { distributeErrors }
}
