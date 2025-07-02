/**
 * Modern Theme System - Main Export
 *
 * A simplified, designer-friendly theme system with:
 * - Two-color swatch approach (primary + secondary)
 * - Lazy-loaded individual theme files
 * - FOUC prevention
 * - Integration with UserPreferences system
 * - Extensible base theme for shared properties
 */

// Core types
export type { ColorTheme, ThemeConfig, ThemeLoader } from "./types";

// Base theme configuration
export { BASE_THEME, baseThemeToCSSProperties } from "./base";

// Theme registry and loading
export {
  THEME_REGISTRY,
  AVAILABLE_THEME_IDS,
  DEFAULT_THEME_ID,
  THEME_METADATA,
  loadTheme,
  preloadTheme,
  preloadAllThemes,
  getThemeMetadata,
  getAllThemeMetadata,
  isValidThemeId,
} from "./registry";

// Theme application and utilities
export {
  colorThemeToCSSProperties,
  applyBaseTheme,
  applyTheme,
  getStoredTheme,
  initializeThemeSystem,
  generateFOUCPreventionScript,
} from "./utils";

// Individual theme exports (for direct access if needed)
export { default as moonlightTheme } from "./moonlight";
export { default as daytimeTheme } from "./daytime";
export { default as crimsonTheme } from "./crimson";
export { default as forestTheme } from "./forest";
