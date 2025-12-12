/**
 * MMA Universe - Theme Provider & Context
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { theme as defaultTheme, Theme, colors } from './tokens';

// =============================================================================
// TYPES
// =============================================================================

type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

// =============================================================================
// LIGHT THEME OVERRIDE
// =============================================================================

const lightColors = {
  ...colors,
  primary: {
    ...colors.primary,
    dark: '#F5F5F7',
  },
  neutral: {
    100: '#FFFFFF',
    200: '#F0F0F2',
    300: '#E0E0E2',
    400: '#D0D0D2',
  },
  text: {
    primary: '#0B0B0D',
    secondary: '#4B5563',
    muted: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  effects: {
    ...colors.effects,
    glass: 'rgba(0, 0, 0, 0.04)',
    glassDark: 'rgba(255, 255, 255, 0.8)',
    overlay: 'rgba(255, 255, 255, 0.9)',
    overlayLight: 'rgba(255, 255, 255, 0.7)',
  },
} as const;

const lightTheme: Theme = {
  ...defaultTheme,
  colors: lightColors,
};

// =============================================================================
// CONTEXT
// =============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialMode = 'dark' 
}) => {
  const [mode, setModeState] = useState<ThemeMode>(initialMode);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const currentTheme = mode === 'dark' ? defaultTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, mode, toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook pour accès direct au theme
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};
