'use client';

import { useEffect } from 'react';
import { THEME_KEY } from '@/lib/constants';
import type { ThemeMode } from '@/lib/types';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme, hydrated] = useLocalStorage<ThemeMode>(THEME_KEY, 'dark');

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme, hydrated]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme, hydrated };
}
