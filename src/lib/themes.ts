/**
 * Professional Theme System for Portfolio Website
 *
 * This file provides a comprehensive theming system that allows easy customization
 * of colors, styling, and visual properties across the entire website.
 *
 * Usage:
 * - Designers can easily modify theme colors in the THEMES object
 * - Supports unlimited themes (Day/Night, custom themes, seasonal themes, etc.)
 * - Automatic CSS variable generation and application
 * - Type-safe theme definitions
 */

// ============================================================================
// THEME TYPES & INTERFACES
// ============================================================================

export interface ThemeColors {
  // Core UI Colors
  background: string;
  foreground: string;

  // Interactive Elements
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;

  // Component Colors
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;

  // Form & Input Colors
  input: string;
  border: string;
  ring: string;

  // Semantic Colors
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;

  // Sidebar Specific Colors
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;

  // Game-specific styling (for menu items, effects, etc.)
  gameStyle: {
    menuTextColor: string;
    menuHoverColor: string;
    menuGlowColor: string;
    titleColor: string;
    titleGlowColor: string;
    buildIdColor: string;

    // Special button colors
    quitColor: string;
    quitHoverColor: string;
    patchnotesColor: string;
    patchnotesHoverColor: string;

    // Shadow and effect colors
    atmosphericGlow: string;
    videoOverlay: string;
  };

  // Custom CSS properties for advanced styling
  customProperties?: Record<string, string>;
}

// ============================================================================
// THEME DEFINITIONS
// ============================================================================

export const THEMES: Record<string, ThemeConfig> = {
  // Current warm/amber theme (game-style)
  warm: {
    id: "warm",
    name: "Game Warm",
    description: "Warm amber theme inspired by modern game UIs",
    colors: {
      background: "8 8% 8%",
      foreground: "45 15% 85%",

      primary: "45 85% 65%",
      primaryForeground: "12 10% 12%",
      secondary: "20 15% 20%",
      secondaryForeground: "45 15% 85%",
      accent: "45 85% 65%",
      accentForeground: "12 10% 12%",

      card: "12 10% 12%",
      cardForeground: "45 15% 85%",
      popover: "12 10% 12%",
      popoverForeground: "45 15% 85%",

      input: "20 15% 25%",
      border: "20 15% 25%",
      ring: "45 85% 65%",

      muted: "15 12% 15%",
      mutedForeground: "45 8% 55%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "210 40% 98%",

      sidebarBackground: "8 8% 8%",
      sidebarForeground: "45 15% 85%",
      sidebarPrimary: "45 85% 65%",
      sidebarPrimaryForeground: "12 10% 12%",
      sidebarAccent: "20 15% 20%",
      sidebarAccentForeground: "45 15% 85%",
      sidebarBorder: "20 15% 25%",
      sidebarRing: "45 85% 65%",
    },
    gameStyle: {
      menuTextColor: "rgb(253 230 138 / 0.9)", // amber-200/90
      menuHoverColor: "rgb(254 243 199)", // amber-100
      menuGlowColor: "rgba(251, 191, 36, 0.6)", // amber-400 with opacity
      titleColor: "rgb(254 243 199)", // amber-100
      titleGlowColor: "rgba(251, 191, 36, 0.5)", // amber-400 with opacity
      buildIdColor: "rgb(156 163 175)", // gray-400

      // Special button colors
      quitColor: "rgb(156 163 175)", // gray-400
      quitHoverColor: "rgb(239 68 68)", // red-500
      patchnotesColor: "rgb(156 163 175)", // gray-400
      patchnotesHoverColor: "rgb(251 191 36)", // amber-400

      atmosphericGlow: "rgba(251, 191, 36, 0.1)",
      videoOverlay:
        "linear-gradient(45deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%)", // neutral black overlay
    },
  },
  // Cool/blue theme (night mode) - Modern like Overwatch 2/Titanfall
  cool: {
    id: "cool",
    name: "Cyber Cool",
    description:
      "Cool blue theme with modern white text and cyberpunk aesthetics",
    colors: {
      background: "220 15% 6%",
      foreground: "210 20% 95%",

      primary: "200 100% 70%",
      primaryForeground: "220 15% 8%",
      secondary: "220 20% 15%",
      secondaryForeground: "210 20% 95%",
      accent: "200 100% 70%",
      accentForeground: "220 15% 8%",

      card: "220 20% 8%",
      cardForeground: "210 20% 95%",
      popover: "220 20% 8%",
      popoverForeground: "210 20% 95%",

      input: "220 20% 18%",
      border: "220 20% 22%",
      ring: "200 100% 70%",

      muted: "220 20% 12%",
      mutedForeground: "210 10% 70%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "210 40% 98%",

      sidebarBackground: "220 15% 6%",
      sidebarForeground: "210 20% 95%",
      sidebarPrimary: "200 100% 70%",
      sidebarPrimaryForeground: "220 15% 8%",
      sidebarAccent: "220 20% 15%",
      sidebarAccentForeground: "210 20% 95%",
      sidebarBorder: "220 20% 22%",
      sidebarRing: "200 100% 70%",
    },
    gameStyle: {
      menuTextColor: "rgb(248 250 252 / 0.95)", // slate-50/95 - bright white
      menuHoverColor: "rgb(125 211 252)", // sky-300 - bright blue
      menuGlowColor: "rgba(14, 165, 233, 0.8)", // sky-500 with strong glow
      titleColor: "rgb(255 255 255)", // pure white for title
      titleGlowColor: "rgba(14, 165, 233, 0.6)", // sky-500 with opacity
      buildIdColor: "rgb(148 163 184)", // slate-400

      // Special button colors
      quitColor: "rgb(148 163 184)", // slate-400
      quitHoverColor: "rgb(239 68 68)", // red-500
      patchnotesColor: "rgb(148 163 184)", // slate-400
      patchnotesHoverColor: "rgb(125 211 252)", // sky-300

      atmosphericGlow: "rgba(14, 165, 233, 0.15)", // stronger blue glow
      videoOverlay:
        "linear-gradient(45deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%)", // neutral black overlay
    },
  },
};

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Converts theme colors to CSS custom properties
 */
export function themeToCSSProperties(
  theme: ThemeConfig,
): Record<string, string> {
  const cssProps: Record<string, string> = {};

  // Standard color properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

    // Handle special cases for sidebar properties
    if (key.startsWith("sidebar")) {
      const sidebarKey = key.replace("sidebar", "").toLowerCase();
      cssProps[
        `--sidebar-${sidebarKey === "background" ? "background" : sidebarKey}`
      ] = value;
    } else {
      cssProps[`--${cssKey}`] = value;
    }
  });

  // Add any custom properties
  if (theme.customProperties) {
    Object.entries(theme.customProperties).forEach(([key, value]) => {
      cssProps[key] = value;
    });
  }

  return cssProps;
}

/**
 * Apply theme to document
 */
export function applyTheme(themeId: string): void {
  const theme = THEMES[themeId];
  if (!theme) {
    console.warn(`Theme "${themeId}" not found`);
    return;
  }

  const root = document.documentElement;
  const cssProps = themeToCSSProperties(theme);

  // Apply CSS custom properties
  Object.entries(cssProps).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  // Apply theme-specific game style properties
  root.style.setProperty("--theme-menu-text", theme.gameStyle.menuTextColor);
  root.style.setProperty("--theme-menu-hover", theme.gameStyle.menuHoverColor);
  root.style.setProperty("--theme-menu-glow", theme.gameStyle.menuGlowColor);
  root.style.setProperty("--theme-title", theme.gameStyle.titleColor);
  root.style.setProperty("--theme-title-glow", theme.gameStyle.titleGlowColor);
  root.style.setProperty("--theme-build-id", theme.gameStyle.buildIdColor);
  
  // Special button colors
  root.style.setProperty("--theme-quit-color", theme.gameStyle.quitColor);
  root.style.setProperty("--theme-quit-hover", theme.gameStyle.quitHoverColor);
  root.style.setProperty("--theme-patchnotes-color", theme.gameStyle.patchnotesColor);
  root.style.setProperty("--theme-patchnotes-hover", theme.gameStyle.patchnotesHoverColor);
  
  root.style.setProperty(
    "--theme-atmospheric-glow",
    theme.gameStyle.atmosphericGlow,
  );
  root.style.setProperty("--theme-video-overlay", theme.gameStyle.videoOverlay);
  // Additional UI element colors
  root.style.setProperty("--theme-subtitle", theme.gameStyle.menuTextColor);
  root.style.setProperty(
    "--theme-settings-icon",
    theme.gameStyle.menuTextColor,
  );
  root.style.setProperty("--theme-social-icon", theme.gameStyle.menuTextColor);
  root.style.setProperty(
    "--theme-social-icon-hover",
    theme.gameStyle.menuHoverColor,
  );
  root.style.setProperty("--theme-social-glow", theme.gameStyle.menuGlowColor);
  root.style.setProperty("--theme-panel-text", theme.gameStyle.menuTextColor);
  root.style.setProperty(
    "--theme-panel-border",
    theme.id === "cool" ? "rgb(59 130 246 / 0.3)" : "rgb(251 191 36 / 0.3)",
  );
  root.style.setProperty(
    "--theme-panel-bg",
    theme.id === "cool" ? "rgba(15, 23, 42, 0.8)" : "rgba(0, 0, 0, 0.8)",
  );
  root.style.setProperty(
    "--theme-settings-panel-border",
    theme.id === "cool" ? "rgb(59 130 246 / 0.3)" : "rgb(251 191 36 / 0.3)",
  );
  root.style.setProperty(
    "--theme-settings-panel-bg",
    theme.id === "cool" ? "rgba(15, 23, 42, 0.8)" : "rgba(0, 0, 0, 0.8)",
  );

  // Content-specific theme variables for sections and components
  root.style.setProperty("--theme-content-text", theme.gameStyle.menuTextColor);
  root.style.setProperty(
    "--theme-content-text-muted",
    theme.id === "cool" ? "rgb(226 232 240 / 0.7)" : "rgb(253 230 138 / 0.7)",
  );
  root.style.setProperty(
    "--theme-content-text-subtle",
    theme.id === "cool" ? "rgb(226 232 240 / 0.6)" : "rgb(253 230 138 / 0.6)",
  );
  root.style.setProperty(
    "--theme-heading-text",
    theme.gameStyle.menuHoverColor,
  );

  // Card and container styling
  root.style.setProperty(
    "--theme-card-bg",
    theme.id === "cool" ? "rgba(15, 23, 42, 0.5)" : "rgba(0, 0, 0, 0.5)",
  );
  root.style.setProperty(
    "--theme-card-border",
    theme.id === "cool" ? "rgb(59 130 246 / 0.2)" : "rgb(251 191 36 / 0.2)",
  );
  root.style.setProperty(
    "--theme-card-hover-bg",
    theme.id === "cool" ? "rgba(59, 130, 246, 0.1)" : "rgba(251, 191, 36, 0.1)",
  );
  root.style.setProperty(
    "--theme-card-hover-border",
    theme.id === "cool" ? "rgb(59 130 246 / 0.4)" : "rgb(251 191 36 / 0.4)",
  );

  // Button styling
  root.style.setProperty(
    "--theme-button-bg",
    theme.id === "cool" ? "rgba(59, 130, 246, 0.2)" : "rgba(251, 191, 36, 0.2)",
  );
  root.style.setProperty(
    "--theme-button-border",
    theme.id === "cool" ? "rgb(59 130 246 / 0.5)" : "rgb(251 191 36 / 0.5)",
  );
  root.style.setProperty(
    "--theme-button-hover-bg",
    theme.id === "cool" ? "rgba(59, 130, 246, 0.3)" : "rgba(251, 191, 36, 0.3)",
  );
  root.style.setProperty(
    "--theme-button-hover-border",
    theme.id === "cool" ? "rgb(59 130 246 / 0.8)" : "rgb(251 191 36 / 0.8)",
  );
  root.style.setProperty("--theme-button-text", theme.gameStyle.menuTextColor);

  // Interactive element styling
  root.style.setProperty(
    "--theme-accent-color",
    theme.id === "cool" ? "rgb(59 130 246)" : "rgb(251 191 36)",
  );
  root.style.setProperty(
    "--theme-back-button-text",
    theme.id === "cool" ? "rgb(125 211 252)" : "rgb(253 230 138)",
  );
  root.style.setProperty(
    "--theme-back-button-hover",
    theme.gameStyle.menuHoverColor,
  );
  // Update data attribute for theme-specific styles
  root.setAttribute("data-theme", themeId);

  // Store theme preference in cookie (365 days)
  document.cookie = `portfolio-theme=${themeId};expires=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get stored theme preference or default
 */
export function getStoredTheme(): string {
  // Check cookie for theme preference
  const nameEQ = "portfolio-theme=";
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    let c = cookie;
    while (c.startsWith(" ")) c = c.substring(1);
    if (c.startsWith(nameEQ)) {
      const value = c.substring(nameEQ.length);
      // Validate that the theme exists
      return THEMES[value] ? value : DEFAULT_THEME;
    }
  }

  return DEFAULT_THEME;
}

/**
 * Get all available themes
 */
export function getAvailableThemes(): ThemeConfig[] {
  return Object.values(THEMES);
}

/**
 * Get theme by ID
 */
export function getTheme(themeId: string): ThemeConfig | null {
  return THEMES[themeId] || null;
}

// ============================================================================
// DESIGNER CUSTOMIZATION HELPERS
// ============================================================================

/**
 * Helper for designers to quickly create new theme variants
 * Just modify the base theme colors and this will generate a complete theme
 */
export function createThemeVariant(
  baseThemeId: string,
  customizations: {
    id: string;
    name: string;
    description: string;
    colorOverrides?: Partial<ThemeColors>;
    gameStyleOverrides?: Partial<ThemeConfig["gameStyle"]>;
  },
): ThemeConfig {
  const baseTheme = THEMES[baseThemeId];
  if (!baseTheme) {
    throw new Error(`Base theme "${baseThemeId}" not found`);
  }

  return {
    ...baseTheme,
    id: customizations.id,
    name: customizations.name,
    description: customizations.description,
    colors: {
      ...baseTheme.colors,
      ...customizations.colorOverrides,
    },
    gameStyle: {
      ...baseTheme.gameStyle,
      ...customizations.gameStyleOverrides,
    },
  };
}

// ============================================================================
// EXPORT DEFAULT THEME
// ============================================================================

export const DEFAULT_THEME = "cool";
