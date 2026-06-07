import { DEFAULT_REALSTATE_THEME } from "~/constants/RealstateTemplates";

import type { RealstateTheme } from "~/constants/RealstateTemplates";

const companyThemeCookieKey = "company-theme";
const companyThemeCookieMaxAge = 60 * 60 * 24 * 30;
const companyThemeCacheVersion = 1;

type CompanyThemeColorKey = keyof RealstateTheme;

const companyThemeColorVariables: Array<[string, CompanyThemeColorKey]> = [
  ["--theme-default3", "primary"],
  ["--theme-default4", "secondary"],
  ["--theme-default6", "primary"],
  ["--theme-default7", "secondary"],
  ["--theme-default8", "primary"],
  ["--theme-default9", "secondary"],
  ["--theme-default10", "accent"],
];

export interface CompanyThemeCache {
  version: number;
  theme: {
    colors: RealstateTheme;
  };
}

export function readCompanyThemeCache(): CompanyThemeCache | null {
  return readCompanyThemeCookie();
}

export function writeCompanyThemeCache(theme: RealstateTheme) {
  if (!import.meta.client) return;

  const nextTheme = buildCompanyThemeCache(theme);
  const currentTheme = readCompanyThemeCache();

  if (currentTheme && isSameCompanyTheme(currentTheme, nextTheme)) return;

  writeCompanyThemeCookie(nextTheme);
}

export function buildCompanyThemeCache(
  theme: RealstateTheme,
): CompanyThemeCache {
  return {
    version: companyThemeCacheVersion,
    theme: {
      colors: normalizeCompanyThemeColors(theme),
    },
  };
}

export function applyCompanyThemeColors(colors: Partial<RealstateTheme>) {
  if (!import.meta.client) return;

  Object.entries(getCompanyThemeCssVariables(colors)).forEach(
    ([variable, value]) => {
      document.documentElement.style.setProperty(variable, value);
    },
  );
}

export function buildCompanyThemeStyle(colors: Partial<RealstateTheme>) {
  return Object.entries(getCompanyThemeCssVariables(colors))
    .map(([variable, value]) => `${variable}: ${value}`)
    .join("; ");
}

export function getCompanyThemeCssVariables(colors: Partial<RealstateTheme>) {
  const normalizedColors = normalizeCompanyThemeColors(colors);

  return {
    ...Object.fromEntries(
      companyThemeColorVariables.map(([variable, colorKey]) => [
        variable,
        normalizedColors[colorKey],
      ]),
    ),
    "--theme-gradient-text": getReadableTextColor(normalizedColors.secondary),
  };
}

export function normalizeCompanyThemeColors(
  colors?: Partial<RealstateTheme> | null,
): RealstateTheme {
  const primary = sanitizeHexColor(
    colors?.primary,
    DEFAULT_REALSTATE_THEME.primary,
  );
  const secondary = sanitizeHexColor(
    colors?.secondary,
    DEFAULT_REALSTATE_THEME.secondary,
  );

  return {
    primary,
    secondary,
    accent: sanitizeHexColor(colors?.accent, primary),
  };
}

function readCompanyThemeCookie(): CompanyThemeCache | null {
  if (import.meta.client) {
    const rawCookie = readClientCookie(companyThemeCookieKey);
    const parsedCookie = parseCompanyThemeCache(rawCookie);

    if (!parsedCookie && rawCookie) {
      removeCompanyThemeCookie();
    }

    return parsedCookie;
  }

  const cookie = useCookie<string | null>(companyThemeCookieKey);
  const parsedCookie = parseCompanyThemeCache(cookie.value);

  if (!parsedCookie && cookie.value) {
    cookie.value = null;
  }

  return parsedCookie;
}

function writeCompanyThemeCookie(theme: CompanyThemeCache) {
  if (!import.meta.client) return;

  const serializedTheme = encodeURIComponent(JSON.stringify(theme));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${companyThemeCookieKey}=${serializedTheme}; Path=/; Max-Age=${companyThemeCookieMaxAge}; SameSite=Lax${secure}`;
}

function removeCompanyThemeCookie() {
  if (!import.meta.client) return;

  document.cookie = `${companyThemeCookieKey}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function readClientCookie(name: string): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.slice(name.length + 1));
}

function parseCompanyThemeCache(rawCache: unknown): CompanyThemeCache | null {
  if (!rawCache) return null;

  try {
    const parsedCache =
      typeof rawCache === "string"
        ? (JSON.parse(rawCache) as Partial<CompanyThemeCache>)
        : (rawCache as Partial<CompanyThemeCache>);

    return normalizeCompanyThemeCache(parsedCache);
  } catch {
    return null;
  }
}

function normalizeCompanyThemeCache(
  cache: Partial<CompanyThemeCache>,
): CompanyThemeCache | null {
  if (
    !cache.theme?.colors?.primary ||
    !cache.theme.colors.secondary ||
    !isHexColor(cache.theme.colors.primary) ||
    !isHexColor(cache.theme.colors.secondary)
  ) {
    return null;
  }

  return {
    version:
      cache.version === companyThemeCacheVersion ? companyThemeCacheVersion : 1,
    theme: {
      colors: normalizeCompanyThemeColors(cache.theme.colors),
    },
  };
}

function sanitizeHexColor(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;

  const color = value.trim();

  return isHexColor(color) ? color : fallback;
}

function isHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

function getReadableTextColor(backgroundColor: string): string {
  const hex = backgroundColor.replace("#", "");

  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return "#ffffff";
  }

  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? "#1c2d3a" : "#ffffff";
}

function isSameCompanyTheme(
  currentTheme: CompanyThemeCache,
  nextTheme: CompanyThemeCache,
) {
  return (
    currentTheme.version === nextTheme.version &&
    currentTheme.theme.colors.primary === nextTheme.theme.colors.primary &&
    currentTheme.theme.colors.secondary === nextTheme.theme.colors.secondary &&
    currentTheme.theme.colors.accent === nextTheme.theme.colors.accent
  );
}
