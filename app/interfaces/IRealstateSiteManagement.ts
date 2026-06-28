import type {
  RealstateSitePageKey,
  RealstateTheme,
  RealstateTemplateSet,
  RealstateTemplates,
} from "~/constants/RealstateTemplates";

export interface RealstateContentItem {
  id?: string;
  icon?: string;
  title: string;
  description: string;
  link?: string;
  points?: string[];
}

export interface RealstateFeaturedIcon {
  name: string;
  icon: string;
  path: string;
}

export interface RealstateFeaturedSection {
  heading: string;
  type: string;
  icons: RealstateFeaturedIcon[];
}

export interface RealstateHeroContent {
  label: string | null;
  title: string | null;
  subtitle: string | null;
  description?: string | null;
  image?: string | null;
  button_text: string | null;
  button_link: string | null;
}

export interface RealstateHomeSlide {
  title: string;
  description: string;
  img: string;
  link: string;
  button_text: string;
}

export interface RealstateHomeContent {
  background_image_url: string | null;
  hero_slides: RealstateHomeSlide[];
  featured_sections: RealstateFeaturedSection[];
  [key: string]: unknown;
}

export interface RealstateEditableImage {
  url: string;
  alt?: string | null;
}

export interface RealstateAboutIntroContent {
  title: string | null;
  description: string | null;
  images: RealstateEditableImage[];
}

export interface RealstateAboutContent {
  banner_image_url: string | null;
  intro: RealstateAboutIntroContent;
  history: string | null;
  mission: string | null;
  vision: string | null;
  why_choose_us: RealstateContentItem[];
  [key: string]: unknown;
}

export interface RealstateServicesContent {
  banner_image_url: string | null;
  hero: RealstateHeroContent;
  provided_services: RealstateContentItem[];
  property_services: RealstateContentItem[];
  [key: string]: unknown;
}

export interface RealstatePropertyListContent {
  banner_image_url: string | null;
  title: string | null;
  subtitle: string | null;
  [key: string]: unknown;
}

export interface RealstatePropertyDetailContent {
  show_related_properties: boolean;
  contact_title: string | null;
  contact_description: string | null;
  related_title: string | null;
  gallery_fallback: string[];
  [key: string]: unknown;
}

export interface RealstateContactContent {
  banner_image_url: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  [key: string]: unknown;
}

export type RealstateSitePageContent =
  | Record<string, unknown>
  | RealstateHomeContent
  | RealstateAboutContent
  | RealstateServicesContent
  | RealstatePropertyListContent
  | RealstatePropertyDetailContent
  | RealstateContactContent;

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
