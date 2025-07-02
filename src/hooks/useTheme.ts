/**
 * Theme Management Hook - Updated for New Theme System
 *
 * Provides a simple interface for managing themes throughout the application.
 * Handles theme switching, persistence, and provides current theme information.
 *
 * Now uses the new simplified theme system with lazy loading and FOUC prevention.
 */

import { useState, useEffect, useCallback } from "react";
import {
  type ColorTheme,
  DEFAULT_THEME_ID,
  AVAILABLE_THEME_IDS,
  getAllThemeMetadata,
  loadTheme,
  applyTheme,
  getStoredTheme,
} from "@/themes";

interface UseThemeReturn {
  // Current theme information
  currentTheme: ColorTheme | null;
  currentThemeId: string;

  // Available themes
  availableThemes: Array<{ id: string; name: string; description: string }>;

  // Theme switching
  setTheme: (themeId: string) => Promise<boolean>;
  cycleTheme: () => Promise<void>; // Cycles through all available themes

  // Theme utilities
  isTheme: (themeId: string) => boolean;
  getThemeConfig: (themeId?: string) => Promise<ColorTheme | null>;

  // Loading state
  isLoading: boolean;
}

/**
 * Custom hook for theme management
 */
export function useTheme(): UseThemeReturn {
  const [currentThemeId, setCurrentThemeId] =
    useState<string>(DEFAULT_THEME_ID);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableThemes] = useState(getAllThemeMetadata());

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = async () => {
      setIsLoading(true);

      try {
        const storedTheme = getStoredTheme();
        const themeToApply = AVAILABLE_THEME_IDS.includes(storedTheme)
          ? storedTheme
          : DEFAULT_THEME_ID;

        setCurrentThemeId(themeToApply);

        // Apply theme and load theme data
        const success = await applyTheme(themeToApply);
        if (success) {
          const themeData = await loadTheme(themeToApply);
          setCurrentTheme(themeData);
        }
      } catch (error) {
        console.error("Failed to initialize theme:", error);
        // Fallback to default theme
        setCurrentThemeId(DEFAULT_THEME_ID);
        await applyTheme(DEFAULT_THEME_ID);
        const defaultTheme = await loadTheme(DEFAULT_THEME_ID);
        setCurrentTheme(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Set theme function
  const setTheme = useCallback(
    async (themeId: string): Promise<boolean> => {
      if (!AVAILABLE_THEME_IDS.includes(themeId)) {
        console.warn(`Invalid theme ID: ${themeId}`);
        return false;
      }

      if (themeId === currentThemeId) {
        return true; // Already using this theme
      }

      setIsLoading(true);

      try {
        const success = await applyTheme(themeId);
        if (success) {
          const themeData = await loadTheme(themeId);
          setCurrentThemeId(themeId);
          setCurrentTheme(themeData);
          return true;
        }
        return false;
      } catch (error) {
        console.error(`Failed to set theme ${themeId}:`, error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentThemeId],
  );

  // Cycle through themes
  const cycleTheme = useCallback(async (): Promise<void> => {
    const currentIndex = AVAILABLE_THEME_IDS.indexOf(currentThemeId);
    const nextIndex = (currentIndex + 1) % AVAILABLE_THEME_IDS.length;
    const nextThemeId = AVAILABLE_THEME_IDS[nextIndex];

    if (nextThemeId) {
      await setTheme(nextThemeId);
    }
  }, [currentThemeId, setTheme]);

  // Check if current theme matches given ID
  const isTheme = useCallback(
    (themeId: string): boolean => {
      return currentThemeId === themeId;
    },
    [currentThemeId],
  );

  // Get theme configuration
  const getThemeConfig = useCallback(
    async (themeId?: string): Promise<ColorTheme | null> => {
      const id = themeId ?? currentThemeId;
      return await loadTheme(id);
    },
    [currentThemeId],
  );

  return {
    currentTheme,
    currentThemeId,
    availableThemes,
    setTheme,
    cycleTheme,
    isTheme,
    getThemeConfig,
    isLoading,
  };
}
