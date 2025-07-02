/**
 * Theme Application System
 *
 * Handles applying themes to the DOM, converting color themes to CSS custom properties,
 * and integrating with the UserPreferences system.
 */

import type { ColorTheme } from "./types";
import { BASE_THEME, baseThemeToCSSProperties } from "./base";
import { loadTheme, DEFAULT_THEME_ID, isValidThemeId } from "./registry";
import { UserPreferences } from "@/lib/cookies";

/**
 * Convert a color theme to CSS custom properties
 */
export function colorThemeToCSSProperties(
  theme: ColorTheme,
): Record<string, string> {
  const cssProps: Record<string, string> = {};

  // Primary colors
  cssProps["--theme-primary"] = theme.colors.primary.main;
  cssProps["--theme-primary-light"] = theme.colors.primary.light;
  cssProps["--theme-primary-dark"] = theme.colors.primary.dark;
  cssProps["--theme-primary-foreground"] = theme.colors.primary.foreground;

  // Secondary colors
  cssProps["--theme-secondary"] = theme.colors.secondary.main;
  cssProps["--theme-secondary-light"] = theme.colors.secondary.light;
  cssProps["--theme-secondary-dark"] = theme.colors.secondary.dark;
  cssProps["--theme-secondary-foreground"] = theme.colors.secondary.foreground;

  // Neutral colors
  cssProps["--theme-background"] = theme.colors.neutral.background;
  cssProps["--theme-foreground"] = theme.colors.neutral.foreground;
  cssProps["--theme-muted"] = theme.colors.neutral.muted;
  cssProps["--theme-border"] = theme.colors.neutral.border;

  // Semantic colors
  cssProps["--theme-success"] = theme.colors.semantic.success;
  cssProps["--theme-warning"] = theme.colors.semantic.warning;
  cssProps["--theme-error"] = theme.colors.semantic.error;
  cssProps["--theme-info"] = theme.colors.semantic.info;

  // Additional derived properties for common UI patterns
  cssProps["--theme-card-bg"] = `${theme.colors.secondary.main} / 0.5`;
  cssProps["--theme-card-border"] = `${theme.colors.primary.main} / 0.2`;
  cssProps["--theme-card-hover-bg"] = `${theme.colors.primary.main} / 0.1`;
  cssProps["--theme-card-hover-border"] = `${theme.colors.primary.main} / 0.4`;

  cssProps["--theme-button-bg"] = `${theme.colors.primary.main} / 0.2`;
  cssProps["--theme-button-border"] = `${theme.colors.primary.main} / 0.5`;
  cssProps["--theme-button-hover-bg"] = `${theme.colors.primary.main} / 0.3`;
  cssProps["--theme-button-hover-border"] =
    `${theme.colors.primary.main} / 0.8`;
  cssProps["--theme-button-text"] = theme.colors.neutral.foreground;

  // Panel styling - consistent dark backgrounds with primary-colored borders for all themes
  // For panels, always use a dark background regardless of theme to maintain UI consistency
  const panelBg = "rgba(30, 41, 59, 0.9)"; // Dark slate background for all themes

  cssProps["--theme-panel-bg"] = panelBg;
  cssProps["--theme-panel-border"] = theme.colors.primary.main; // Use full primary color for visibility
  cssProps["--theme-panel-text"] = "rgb(248 250 252)"; // Light text for dark panels
  cssProps["--theme-settings-panel-bg"] = panelBg;
  cssProps["--theme-settings-panel-border"] = theme.colors.primary.main; // Use full primary color for visibility

  cssProps["--theme-menu-text"] = `${theme.colors.neutral.foreground} / 0.9`;
  cssProps["--theme-menu-hover"] = theme.colors.primary.light;
  cssProps["--theme-menu-glow"] = theme.effects.menuGlow;

  cssProps["--theme-title"] = theme.colors.primary.light;
  cssProps["--theme-title-glow"] = theme.effects.titleGlow;

  cssProps["--theme-atmospheric-glow"] = theme.effects.atmosphericGlow;
  cssProps["--theme-video-overlay"] = theme.effects.videoOverlay;

  // UI element colors that work across all themes
  cssProps["--theme-subtitle"] = `${theme.colors.neutral.foreground} / 0.8`;
  cssProps["--theme-settings-icon"] = "rgb(248 250 252)"; // Always light for dark panels
  cssProps["--theme-social-icon"] = `${theme.colors.neutral.foreground} / 0.6`;
  cssProps["--theme-social-icon-hover"] = theme.colors.primary.light;
  cssProps["--theme-social-glow"] = theme.effects.menuGlow;

  // Network signal colors - use theme-aware colors instead of hardcoded values
  cssProps["--theme-signal-good"] = theme.colors.semantic.success;
  cssProps["--theme-signal-medium"] = theme.colors.semantic.warning;
  cssProps["--theme-signal-poor"] = theme.colors.semantic.error;
  cssProps["--theme-signal-inactive"] = `${theme.colors.neutral.muted} / 0.5`;

  // Special button colors for tertiary elements (quit/patchnotes)
  cssProps["--theme-quit-color"] = `${theme.colors.neutral.muted}`;
  cssProps["--theme-quit-hover"] = theme.colors.semantic.error;
  cssProps["--theme-patchnotes-color"] = `${theme.colors.neutral.muted}`;
  cssProps["--theme-patchnotes-hover"] = theme.colors.primary.main;

  // Build ID styling
  cssProps["--theme-build-id"] = theme.colors.neutral.muted;

  // Content-specific theme variables for sections and components
  cssProps["--theme-content-text"] = `${theme.colors.neutral.foreground} / 0.9`;
  cssProps["--theme-content-text-muted"] =
    `${theme.colors.neutral.foreground} / 0.7`;
  cssProps["--theme-content-text-subtle"] =
    `${theme.colors.neutral.foreground} / 0.6`;
  cssProps["--theme-heading-text"] = theme.colors.primary.light;

  // Interactive element styling
  cssProps["--theme-accent-color"] = theme.colors.primary.main;
  cssProps["--theme-back-button-text"] = theme.colors.primary.light;
  cssProps["--theme-back-button-hover"] = theme.colors.primary.main;

  return cssProps;
}

/**
 * Apply base theme properties to the DOM
 */
export function applyBaseTheme(): void {
  const root = document.documentElement;
  const cssProps = baseThemeToCSSProperties(BASE_THEME);

  Object.entries(cssProps).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Apply a color theme to the DOM
 */
export async function applyTheme(themeId: string): Promise<boolean> {
  // Validate theme ID
  if (!isValidThemeId(themeId)) {
    console.warn(`Invalid theme ID: ${themeId}`);
    return false;
  }

  try {
    // Load the theme
    const theme = await loadTheme(themeId);
    if (!theme) {
      console.error(`Failed to load theme: ${themeId}`);
      return false;
    }

    const root = document.documentElement;

    // Apply base theme first (if not already applied)
    applyBaseTheme();

    // Apply color theme
    const colorProps = colorThemeToCSSProperties(theme);
    Object.entries(colorProps).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Set data attribute for theme-specific CSS
    root.setAttribute("data-theme", themeId);

    // Save theme preference
    UserPreferences.setSelectedTheme(themeId);

    return true;
  } catch (error) {
    console.error(`Error applying theme ${themeId}:`, error);
    return false;
  }
}

/**
 * Get the currently stored theme preference
 */
export function getStoredTheme(): string {
  const storedTheme = UserPreferences.getSelectedTheme();
  return isValidThemeId(storedTheme) ? storedTheme : DEFAULT_THEME_ID;
}

/**
 * Initialize theme system - applies base theme and stored theme
 */
export async function initializeThemeSystem(): Promise<void> {
  // Apply base theme immediately
  applyBaseTheme();

  // Get and apply stored theme
  const themeId = getStoredTheme();
  await applyTheme(themeId);
}

/**
 * Generate FOUC prevention script
 * This should be inlined in the HTML head
 */
export function generateFOUCPreventionScript(): string {
  return `
    (function() {
      // Get theme from cookies immediately
      function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
          const c = cookie.trim();
          if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length);
          }
        }
        return null;
      }
      
      // Parse preferences and get theme
      try {
        const prefsStr = getCookie("portfolio-preferences");
        if (prefsStr) {
          const prefs = JSON.parse(decodeURIComponent(prefsStr));
          const themeId = prefs.selectedTheme || "${DEFAULT_THEME_ID}";
          
          // Set data attribute early
          document.documentElement.setAttribute("data-theme", themeId);
          
          // Apply critical CSS variables for the theme
          const themes = {
            moonlight: {
              primary: "rgb(59 130 246)",
              background: "rgb(2 6 23)",
              foreground: "rgb(248 250 252)"
            },
            daytime: {
              primary: "rgb(249 115 22)",
              background: "rgb(255 255 255)",
              foreground: "rgb(15 23 42)"
            },
            crimson: {
              primary: "rgb(220 38 38)",
              background: "rgb(0 0 0)",
              foreground: "rgb(255 255 255)"
            },
            forest: {
              primary: "rgb(34 197 94)",
              background: "rgb(1 20 25)",
              foreground: "rgb(240 253 244)"
            }
          };
          
          const theme = themes[themeId] || themes.${DEFAULT_THEME_ID};
          const root = document.documentElement;
          
          root.style.setProperty("--theme-primary", theme.primary);
          root.style.setProperty("--theme-background", theme.background);
          root.style.setProperty("--theme-foreground", theme.foreground);
        }
      } catch (e) {
        // Fallback to default theme
        document.documentElement.setAttribute("data-theme", "${DEFAULT_THEME_ID}");
      }
    })();
  `;
}
