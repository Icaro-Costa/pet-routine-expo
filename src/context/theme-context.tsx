import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { themes, type ThemeColors, type ThemeMode } from '../theme';

const THEME_STORAGE_KEY = '@petroutine:theme';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  isReady: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateTheme() {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (isMounted && (savedMode === 'dark' || savedMode === 'light')) {
          setModeState(savedMode);
        }
      } catch {
        // Mantém o tema padrão quando o armazenamento está indisponível.
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    void hydrateTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const setTheme = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    void AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => undefined);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((currentMode) => {
      const nextMode = currentMode === 'dark' ? 'light' : 'dark';
      void AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => undefined);
      return nextMode;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: themes[mode],
      isDark: mode === 'dark',
      isReady,
      setTheme,
      toggleTheme,
    }),
    [isReady, mode, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider.');
  }

  return context;
}
