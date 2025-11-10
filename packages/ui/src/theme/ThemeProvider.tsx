/**
 * Theme Provider for React apps
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Theme, ThemeMode } from './theme';
import { lightTheme, darkTheme } from './theme';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
  storageKey = 'keep-plus-plus-theme',
}) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    return defaultMode;
  });

  const theme = useMemo(() => {
    return mode === 'dark' ? darkTheme : lightTheme;
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newMode);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  // Update document class for global styles
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mode);
      root.setAttribute('data-theme', mode);
    }
  }, [mode]);

  const value: ThemeContextValue = {
    theme,
    mode,
    setMode,
    toggleMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
