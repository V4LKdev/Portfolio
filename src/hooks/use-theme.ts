/**
 * Theme Management Hook
 * 
 * Provides a simple interface for managing themes throughout the application.
 * Handles theme switching, persistence, and provides current theme information.
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  ThemeConfig, 
  applyTheme, 
  getStoredTheme, 
  getAvailableThemes, 
  getTheme,
  DEFAULT_THEME 
} from '@/lib/themes';

interface UseThemeReturn {
  // Current theme information
  currentTheme: ThemeConfig | null;
  currentThemeId: string;
  
  // Available themes
  availableThemes: ThemeConfig[];
  
  // Theme switching
  setTheme: (themeId: string) => void;
  toggleTheme: () => void; // Toggles between warm and cool
  
  // Theme utilities
  isTheme: (themeId: string) => boolean;
  getThemeConfig: (themeId?: string) => ThemeConfig | null;
}

/**
 * Custom hook for theme management
 */
export function useTheme(): UseThemeReturn {
  const [currentThemeId, setCurrentThemeId] = useState<string>(DEFAULT_THEME);
  const [availableThemes] = useState<ThemeConfig[]>(getAvailableThemes());
  
  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    const themeToApply = getTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
    
    setCurrentThemeId(themeToApply);
    applyTheme(themeToApply);
  }, []);
  
  // Get current theme config
  const currentTheme = getTheme(currentThemeId);
  
  // Set theme function
  const setTheme = useCallback((themeId: string) => {
    const theme = getTheme(themeId);
    if (!theme) {
      console.warn(`Theme "${themeId}" not found`);
      return;
    }
    
    setCurrentThemeId(themeId);
    applyTheme(themeId);
  }, []);
  
  // Toggle between warm and cool themes (main day/night toggle)
  const toggleTheme = useCallback(() => {
    const newTheme = currentThemeId === 'warm' ? 'cool' : 'warm';
    setTheme(newTheme);
  }, [currentThemeId, setTheme]);
  
  // Check if current theme matches given ID
  const isTheme = useCallback((themeId: string) => {
    return currentThemeId === themeId;
  }, [currentThemeId]);
  
  // Get theme config by ID (or current if no ID provided)
  const getThemeConfig = useCallback((themeId?: string) => {
    return getTheme(themeId || currentThemeId);
  }, [currentThemeId]);
  
  return {
    currentTheme,
    currentThemeId,
    availableThemes,
    setTheme,
    toggleTheme,
    isTheme,
    getThemeConfig,
  };
}

/**
 * Hook for accessing theme colors and styles in components
 * Useful for dynamic styling based on current theme
 */
export function useThemeStyles() {
  const { currentTheme } = useTheme();
  
  if (!currentTheme) {
    return null;
  }
  
  return {
    // Game-style colors for direct use in components
    gameStyle: currentTheme.gameStyle,
    
    // Helper functions for common styling patterns
    getMenuItemStyle: (isActive: boolean = false) => ({
      color: isActive ? currentTheme.gameStyle.menuHoverColor : currentTheme.gameStyle.menuTextColor,
      textShadow: isActive ? `0 0 20px ${currentTheme.gameStyle.menuGlowColor}` : 'none',
    }),
    
    getTitleStyle: () => ({
      color: currentTheme.gameStyle.titleColor,
      textShadow: `0 0 30px ${currentTheme.gameStyle.titleGlowColor}`,
    }),
    
    getBuildIdStyle: () => ({
      color: currentTheme.gameStyle.buildIdColor,
    }),
    
    getAtmosphericGlowStyle: () => ({
      boxShadow: `0 0 20px ${currentTheme.gameStyle.atmosphericGlow}, inset 0 0 20px rgba(0, 0, 0, 0.5)`,
    }),
  };
}
