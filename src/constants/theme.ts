import { DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#6366f1',
  primaryVariant: '#4f46e5',
  secondary: '#ec4899',
  secondaryVariant: '#db2777',
  background: '#f8fafc',
  surface: '#ffffff',
  error: '#ef4444',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onBackground: '#1e293b',
  onSurface: '#1e293b',
  onError: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  gradient: ['#6366f1', '#8b5cf6', '#ec4899'],
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    onSurface: colors.onSurface,
    disabled: colors.textSecondary,
    placeholder: colors.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: colors.primary,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
  },
};