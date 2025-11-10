/**
 * Typography system for Keep++
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text variants
  variants: {
    // Headings
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.375,
      letterSpacing: 'normal',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.375,
      letterSpacing: 'normal',
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },

    // Body text
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },

    // Labels
    label: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.375,
      letterSpacing: '0.025em',
    },

    // Captions
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.375,
      letterSpacing: 'normal',
    },

    // Buttons
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },

    // Code
    code: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
  },
} as const;

export type TypographyVariant = keyof typeof typography.variants;
