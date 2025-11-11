/**
 * Color system for Keep++
 * Inspired by Google Keep with enhanced contrast for accessibility
 */

export const colors = {
  // Note colors (from @keep-plus-plus/types)
  note: {
    default: '#FFFFFF',
    coral: '#FAAFA8',
    peach: '#F39F76',
    sand: '#FFF8B8',
    mint: '#E2F6D3',
    sage: '#B4DDD3',
    fog: '#D4E4ED',
    storm: '#AECCDC',
    dusk: '#D3BFDB',
    blossom: '#F6E2DD',
    clay: '#E9E3D4',
    chalk: '#EFEFF1',
  },

  // Semantic colors - Red/Black theme
  primary: {
    50: '#FEE2E2',   // Very light red
    100: '#FECACA',  // Light red
    200: '#FCA5A5',  // Lighter red
    300: '#F87171',  // Light-medium red
    400: '#EF4444',  // Medium red
    500: '#DC2626',  // Base red (primary)
    600: '#B91C1C',  // Dark red
    700: '#991B1B',  // Darker red
    800: '#7F1D1D',  // Very dark red
    900: '#450A0A',  // Almost black red
  },

  secondary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  warning: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  // Neutral colors for light theme
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#E5E5E5',
    },
    surface: {
      primary: '#FFFFFF',
      secondary: '#FAFAFA',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#0A0A0A',      // Almost black
      secondary: '#404040',     // Dark gray
      tertiary: '#737373',      // Medium gray
      disabled: '#A3A3A3',      // Light gray
    },
    border: {
      primary: '#D4D4D4',
      secondary: '#E5E5E5',
      focus: '#DC2626',         // Red focus
    },
    divider: '#E5E5E5',
  },

  // Neutral colors for dark theme - Deep black with red accents
  dark: {
    background: {
      primary: '#0A0A0A',       // Almost pure black
      secondary: '#1A1A1A',     // Very dark gray
      tertiary: '#262626',      // Dark gray
    },
    surface: {
      primary: '#171717',       // Very dark gray
      secondary: '#262626',     // Dark gray
      elevated: '#2A2A2A',      // Elevated dark gray
    },
    text: {
      primary: '#FAFAFA',       // Almost white
      secondary: '#D4D4D4',     // Light gray
      tertiary: '#A3A3A3',      // Medium gray
      disabled: '#737373',      // Dark gray
    },
    border: {
      primary: '#404040',
      secondary: '#2A2A2A',
      focus: '#EF4444',         // Bright red focus
    },
    divider: '#2A2A2A',
  },

  // Common colors (theme-independent)
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  // Overlay colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.9)',
    medium: 'rgba(255, 255, 255, 0.5)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darker: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

export type ColorTheme = 'light' | 'dark';

export type NoteColor = keyof typeof colors.note;
