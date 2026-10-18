import type { AppTheme, LayoutConfig } from '../types/config';
import { fallbackColors } from './colors';
import { radius, spacing } from './spacing';
import { typography } from './typography';

export function createTheme(config?: LayoutConfig): AppTheme {
  const colors = config?.theme ?? {
    ...fallbackColors,
    festival: {
      name: '',
      greeting: '',
      bannerImageUrl: '',
    },
  };

  return {
    ...colors,
    spacing: { ...spacing },
    typography: { ...typography },
    radius: { ...radius },
  };
}
