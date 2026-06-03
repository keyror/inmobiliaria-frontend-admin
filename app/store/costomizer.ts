interface color {
  primary: string;
  secondary: string;
}
export const usecustomizerStore = defineStore("customizer", () => {
  const property = ref();
  function setcolor(color: color) {
    document.documentElement.style.setProperty(
      "--theme-default3",
      color.primary,
    );
    document.documentElement.style.setProperty(
      "--theme-default4",
      color.secondary,
    );
    document.documentElement.style.setProperty(
      "--theme-default6",
      color.primary,
    );
    document.documentElement.style.setProperty(
      "--theme-default7",
      color.secondary,
    );
    document.documentElement.style.setProperty(
      "--theme-default8",
      color.primary,
    );
    document.documentElement.style.setProperty(
      "--theme-default9",
      color.secondary,
    );
  }
  return {
    setcolor,
    property,
  };
});
