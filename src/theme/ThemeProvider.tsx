import React, {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';

import type { AppTheme, LayoutConfig } from '../types/config';
import { createTheme } from './theme';

type ThemeContextValue = {
  theme: AppTheme;
  config: LayoutConfig | null;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  config: LayoutConfig | null;
}>;

export function ThemeProvider({
  config,
  children,
}: ThemeProviderProps) {
  const value = useMemo(
    () => ({
      theme: createTheme(config ?? undefined),
      config,
    }),
    [config],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }

  return context;
}
