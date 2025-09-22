export const colors = {
  primary: '#5927bcff',
  secondary: '#abb0d9ff',
  tertiary: '#865dde',
  background: '#070926ff',
  
// Derived colors for better UX
primaryLight: '#7b4bd6',
primaryDark: '#3e1a80',
secondaryLight: '#d4d8f0',
secondaryDark: '#8289c2',
tertiaryLight: '#a584e8',
tertiaryDark: '#6344b8',

// Text colors
textPrimary: '#ffffff',
textSecondary: '#abb0d9ff',
textMuted: '#8289c2',
textInverse: '#070926ff',

// UI colors
surface: '#1a0f3d',
surfaceLight: '#2a1f4d',
border: '#3e1a80',
borderLight: '#5927bcff',
  
  // Status colors
  success: '#4ade80',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Opacity variants
  overlay: 'rgba(26, 5, 16, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.3)',
} as const;

export const gradients = {
  primary: ['#7b4bd6', '#5927bcff', '#3e1a80'],
  secondary: ['#d4d8f0', '#abb0d9ff', '#8289c2'],
  tertiary: ['#a584e8', '#865dde', '#6344b8'],
  accent: ['#3bb166ff', '#2a5eb0ff', '#724fbdff'],
  sunset: ['#f59e0b', '#ef4444', '#5927bcff'],
  ocean: ['#3b82f6', '#5927bcff'],
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50,
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

export const theme = {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  shadows,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Gradients = typeof gradients;