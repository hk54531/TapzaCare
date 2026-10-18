export type BackgroundConfig =
  | { kind: 'color'; value: string }
  | { kind: 'gradient'; value: string }
  | { kind: 'image'; value: string };

export type TabConfig = {
  id: string;
  label: string;
  icon: string;
  screen: 'home' | 'bookings' | 'prescriptions' | 'profile';
};

export type SectionConfig = {
  id: string;
  type: string;
  background: BackgroundConfig;
  title: string;
  items: unknown[];
};

export type LayoutConfig = {
  version: number;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    festival: {
      name: string;
      greeting: string;
      bannerImageUrl: string;
    };
  };
  tabs: TabConfig[];
  sections: SectionConfig[];
};

export type AppTheme = LayoutConfig['theme'] & {
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    small: number;
    body: number;
    subtitle: number;
    title: number;
    heading: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
};
