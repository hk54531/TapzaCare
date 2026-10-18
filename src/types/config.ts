export type ThemeTokens = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  success?: string;
  error?: string;
  warning?: string;
  border?: string;
  disabled?: string;
};

export type SectionType =
  | 'hero_banner'
  | 'category_chips'
  | 'quick_actions'
  | 'service_grid'
  | 'doctor_carousel'
  | 'offer_strip';

export type SectionItem = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  icon?: string;
  action?: string;
  [key: string]: unknown;
};

export type LayoutSection = {
  id: string;
  type: string;
  title?: string;
  background?: {
    kind: 'token' | 'solid' | 'gradient';
    value: string | string[];
  };
  items?: SectionItem[];
  enabled?: boolean;
  [key: string]: unknown;
};

export type TabConfig = {
  id: string;
  label: string;
  icon?: string;
};

export type FestivalMetadata = {
  enabled: boolean;
  name?: string;
  bannerText?: string;
  bannerImage?: string;
};

export type LayoutConfig = {
  version: string;
  theme: ThemeTokens;
  festival?: FestivalMetadata;
  tabs: TabConfig[];
  sections: LayoutSection[];
};
