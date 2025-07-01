/**
 * Theme Type Definitions
 * 
 * Simplified theme system focusing on colors with a two-color swatch approach.
 * Each theme has a primary color (accent/interactive) and secondary color (backgrounds/cards).
 */

/**
 * Color theme configuration using two-color swatch system
 */
export interface ColorTheme {
  // Theme metadata
  id: string;
  name: string;
  description: string;
  
  // Two-color swatch system
  colors: {
    // Primary color (main accent, interactive elements, highlights)
    primary: {
      main: string;        // Main primary color
      light: string;       // Lighter variant for hover states
      dark: string;        // Darker variant for active states
      foreground: string;  // Text color on primary backgrounds
    };
    
    // Secondary color (backgrounds, cards, containers)
    secondary: {
      main: string;        // Main secondary color
      light: string;       // Lighter variant
      dark: string;        // Darker variant
      foreground: string;  // Text color on secondary backgrounds
    };
    
    // Neutral colors (derived but can be overridden)
    neutral: {
      background: string;   // Page background
      foreground: string;   // Main text color
      muted: string;        // Muted text color
      border: string;       // Border color
    };
    
    // Semantic colors (consistent across themes)
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };

  // Game-style effects (glows, overlays, etc.)
  effects: {
    menuGlow: string;
    titleGlow: string;
    atmosphericGlow: string;
    videoOverlay: string;
  };
}

/**
 * Complete theme configuration combining colors and base properties
 */
export interface ThemeConfig {
  colors: ColorTheme['colors'];
  id: string;
  name: string;
  description: string;
}

/**
 * Theme loader function type for lazy loading
 */
export type ThemeLoader = () => Promise<ColorTheme>;
