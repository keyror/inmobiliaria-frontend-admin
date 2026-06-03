interface color {
  primary: string;
  secondary: string;
}

const getReadableTextColor = (backgroundColor: string): string => {
  const hex = backgroundColor.replace("#", "");

  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return "#ffffff";
  }

  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? "#1c2d3a" : "#ffffff";
};

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
    document.documentElement.style.setProperty(
      "--theme-gradient-text",
      getReadableTextColor(color.secondary),
    );
  }
  return {
    setcolor,
    property,
  };
});
