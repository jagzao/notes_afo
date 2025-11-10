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

  // Semantic colors
  primary: {
    50: '#FEF3E2',
    100: '#FDE1B8',
    200: '#FCCD8A',
    300: '#FBB95C',
    400: '#FAAA39',
    500: '#F99B16',
    600: '#F89313',
    700: '#F78910',
    800: '#F67F0C',
    900: '#F56D06',
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
      secondary: '#F8F9FA',
      tertiary: '#F1F3F4',
    },
    surface: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#202124',
      secondary: '#5F6368',
      tertiary: '#80868B',
      disabled: '#9AA0A6',
    },
    border: {
      primary: '#DADCE0',
      secondary: '#E8EAED',
      focus: '#1967D2',
    },
    divider: '#E8EAED',
  },

  // Neutral colors for dark theme
  dark: {
    background: {
      primary: '#202124',
      secondary: '#292A2D',
      tertiary: '#303134',
    },
    surface: {
      primary: '#292A2D',
      secondary: '#303134',
      elevated: '#3C4043',
    },
    text: {
      primary: '#E8EAED',
      secondary: '#9AA0A6',
      tertiary: '#80868B',
      disabled: '#5F6368',
    },
    border: {
      primary: '#5F6368',
      secondary: '#3C4043',
      focus: '#8AB4F8',
    },
    divider: '#3C4043',
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
