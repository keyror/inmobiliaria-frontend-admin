export const DEFAULT_COMPANY_THEME_COLORS = {
  primary: "#f35d43",
  secondary: "#f34451",
} as const;

export interface CompanyThemeColors {
  primary: string;
  secondary: string;
}

export const isHexThemeColor = (color?: string | null): color is string => {
  return /^#[0-9A-Fa-f]{6}$/.test(color ?? "");
};

export const normalizeCompanyThemeColors = (
  primary?: string | null,
  secondary?: string | null,
): CompanyThemeColors => ({
  primary: isHexThemeColor(primary)
    ? primary
    : DEFAULT_COMPANY_THEME_COLORS.primary,
  secondary: isHexThemeColor(secondary)
    ? secondary
    : DEFAULT_COMPANY_THEME_COLORS.secondary,
});
