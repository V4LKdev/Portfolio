/**
 * Legacy Theme System - DEPRECATED
 * 
 * This file is deprecated and maintained only for backwards compatibility.
 * Please use the new theme system from @/themes instead.
 * 
 * New theme system features:
 * - Simplified two-color swatch approach
 * - Lazy-loaded individual theme files
 * - Better designer experience
 * - FOUC prevention
 * - Integration with UserPreferences
 */

// Re-export the new theme system for compatibility
export {
  type ColorTheme as ThemeConfig,
  DEFAULT_THEME_ID as DEFAULT_THEME,
  AVAILABLE_THEME_IDS,
  getAllThemeMetadata as getAvailableThemes,
  getThemeMetadata as getTheme,
  applyTheme,
  getStoredTheme,
} from '@/themes';

// Legacy compatibility exports
export const THEMES = {};

/**
 * @deprecated Use applyTheme from @/themes instead
 */
export function themeToCSSProperties(): Record<string, string> {
  console.warn('themeToCSSProperties is deprecated. Use the new theme system from @/themes');
  return {};
}
