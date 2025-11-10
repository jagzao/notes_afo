/**
 * Main theme configuration for Keep++
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows, zIndex, breakpoints, transitions, layout } from './spacing';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  zIndex: typeof zIndex;
  breakpoints: typeof breakpoints;
  transitions: typeof transitions;
  layout: typeof layout;
}

export const createTheme = (mode: ThemeMode = 'light'): Theme => {
  return {
    mode,
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    zIndex,
    breakpoints,
    transitions,
    layout,
  };
};

// Default themes
export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

// Helper functions
export const getThemeColor = (theme: Theme, path: string): string => {
  const keys = path.split('.');
  let value: any = theme.colors;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) break;
  }

  return value || '';
};

export const getSpacing = (theme: Theme, ...values: Array<keyof typeof spacing>): string => {
  return values.map((v) => theme.spacing[v]).join(' ');
};
