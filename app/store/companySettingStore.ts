import { ref } from "vue";

import { defineStore } from "pinia";

export type TextCaseMode =
  | "none"
  | "upper"
  | "lower"
  | "capitalize"
  | "sentence"
  | null;

export const useCompanySettingStore = defineStore("company-setting", () => {
  const textCaseMode = ref<TextCaseMode>(null);

  function setTextCaseMode(mode: TextCaseMode) {
    textCaseMode.value = mode;
  }

  return {
    textCaseMode,
    setTextCaseMode,
  };
});
