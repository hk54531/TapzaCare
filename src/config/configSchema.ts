import type {
  LayoutConfig,
  LayoutSection,
  ThemeTokens,
} from '../types/config';

const requiredThemeKeys: (keyof ThemeTokens)[] = [
  'primary',
  'secondary',
  'background',
  'surface',
  'textPrimary',
  'textSecondary',
  'accent',
];

const knownSectionTypes = new Set([
  'hero_banner',
  'category_chips',
  'quick_actions',
  'service_grid',
  'doctor_carousel',
  'offer_strip',
]);

export function isLayoutSection(value: unknown): value is LayoutSection {
  if (!value || typeof value !== 'object') return false;

  const section = value as Record<string, unknown>;
  return (
    typeof section.id === 'string' &&
    typeof section.type === 'string'
  );
}

export function isKnownSectionType(type: string): boolean {
  return knownSectionTypes.has(type);
}

export function validateConfig(value: unknown): value is LayoutConfig {
  if (!value || typeof value !== 'object') return false;

  const config = value as Record<string, unknown>;
  if (
    typeof config.version !== 'string' ||
    !config.theme ||
    typeof config.theme !== 'object' ||
    !Array.isArray(config.tabs) ||
    !Array.isArray(config.sections)
  ) {
    return false;
  }

  const theme = config.theme as Record<string, unknown>;
  if (
    !requiredThemeKeys.every(
      (key) => typeof theme[key] === 'string',
    )
  ) {
    return false;
  }

  if (!config.tabs.every((tab: unknown) => {
    if (!tab || typeof tab !== 'object') return false;
    const item = tab as Record<string, unknown>;
    return typeof item.id === 'string' && typeof item.label === 'string';
  })) {
    return false;
  }

  return config.sections.every(isLayoutSection);
}

export function getSupportedSections(
  sections: LayoutSection[],
): LayoutSection[] {
  return sections.filter((section) => isKnownSectionType(section.type));
}
