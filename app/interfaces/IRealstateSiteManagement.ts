import type {
  RealstateSitePageKey,
  RealstateTheme,
  RealstateTemplateSet,
  RealstateTemplates,
} from "~/constants/RealstateTemplates";

export interface RealstateContentItem {
  title: string;
  description: string;
}

export interface RealstateAboutContent {
  history: string | null;
  mission: string | null;
  vision: string | null;
  why_choose_us: RealstateContentItem[];
  [key: string]: unknown;
}

export interface RealstateServicesContent {
  provided_services: RealstateContentItem[];
  property_services: RealstateContentItem[];
  [key: string]: unknown;
}

export interface RealstatePropertyListContent {
  title: string | null;
  subtitle: string | null;
  [key: string]: unknown;
}

export interface RealstatePropertyDetailContent {
  show_related_properties: boolean;
  contact_title: string | null;
  [key: string]: unknown;
}

export type RealstateSitePageContent =
  | Record<string, unknown>
  | RealstateAboutContent
  | RealstateServicesContent
  | RealstatePropertyListContent
  | RealstatePropertyDetailContent;

export interface RealstateSiteTemplateData {
  template_set: RealstateTemplateSet;
  theme: RealstateTheme;
  templates: RealstateTemplates;
}

export interface RealstateSiteTemplateResponse {
  status: boolean;
  message?: string[] | string;
  data: RealstateSiteTemplateData;
}

export interface RealstateSitePagesResponse {
  status: boolean;
  message?: string[] | string;
  data: {
    template_set: RealstateTemplateSet;
    theme: RealstateTheme;
    pages: RealstateSitePages;
  };
}

export interface RealstateSitePageResponse {
  status: boolean;
  message?: string[] | string;
  data: {
    page: RealstateSitePageKey;
    config: RealstateSitePage;
  };
}

export type RealstateSitePages = Record<
  RealstateSitePageKey,
  RealstateSitePage
>;

export interface RealstateSitePage {
  is_active: boolean;
  template: RealstateTemplateSet;
  content: RealstateSitePageContent;
}

export interface RealstateSiteTemplatePayload {
  template_set: RealstateTemplateSet;
  theme: RealstateTheme;
}

export interface RealstateSitePagePayload {
  is_active: boolean;
  content: RealstateSitePageContent;
}
