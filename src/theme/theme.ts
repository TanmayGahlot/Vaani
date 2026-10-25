/**
 * Vaani Design System
 * Dark theme with glassmorphic aesthetics
 */

export const colors = {
  /** Near black background */
  background: '#0A0A0F',
  /** Dark blue-gray surface */
  surface: '#1A1A2E',
  /** Glassmorphic surface overlay */
  surfaceGlass: 'rgba(255,255,255,0.06)',
  /** Lighter glassmorphic surface */
  surfaceGlassLight: 'rgba(255,255,255,0.1)',
  /** Vibrant purple primary */
  primary: '#6C63FF',
  /** Lighter purple variant */
  primaryLight: '#8B83FF',
  /** Cyan accent */
  accent: '#00D9FF',
  /** Success green */
  success: '#4CAF50',
  /** Warning orange */
  warning: '#FF9800',
  /** Error red */
  error: '#F44336',
  /** Primary text */
  text: '#FFFFFF',
  /** Secondary text */
  textSecondary: '#9E9E9E',
  /** Muted text */
  textMuted: '#616161',
  /** Border color */
  border: 'rgba(255,255,255,0.08)',
} as const;

export const typography = {
  h1: { fontSize: 32 },
  h2: { fontSize: 24 },
  h3: { fontSize: 20 },
  title: { fontSize: 20 },
  subtitle: { fontSize: 18 },
  body: { fontSize: 16 },
  caption: { fontSize: 12 },
  small: { fontSize: 10 },
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    title: 20,
    subtitle: 18,
    body: 16,
    caption: 12,
    small: 10,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof spacing;
export type ThemeBorderRadius = typeof borderRadius;
export type ThemeTypography = typeof typography;
