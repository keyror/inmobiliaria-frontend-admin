import { useCompanySettingStore } from "~/store/companySettingStore";

export function useTextCase() {
  const store = useCompanySettingStore();

  function transform(value: string): string {
    const mode = store.textCaseMode;
    if (!mode || mode === "none" || !value) return value;

    switch (mode) {
      case "upper":
        return value.toUpperCase();
      case "lower":
        return value.toLowerCase();
      case "capitalize":
        return value.replace(/\b\w/g, (c) => c.toUpperCase());
      case "sentence":
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      default:
        return value;
    }
  }

  return { transform };
}
