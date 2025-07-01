/**
 * Base Theme Configuration
 * 
 * Contains all shared properties that apply across all themes.
 * This includes spacing, typography, borders, shadows, and other
 * non-color related design tokens.
 */

export interface BaseThemeConfig {
  // Typography
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  
  // Spacing
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  
  // Border radius
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  
  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
  };
  
  // Transitions
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  
  // Z-index layers
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    overlay: number;
    modal: number;
    tooltip: number;
  };
}

/**
 * Base theme configuration shared across all themes
 */
export const BASE_THEME: BaseThemeConfig = {
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem',  // 64px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgb(var(--theme-primary) / 0.5)',
  },
  
  transitions: {
    fast: 'all 0.15s ease-in-out',
    normal: 'all 0.3s ease-in-out',
    slow: 'all 0.5s ease-in-out',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    overlay: 1040,
    modal: 1050,
    tooltip: 1070,
  },
};

/**
 * Convert base theme to CSS custom properties
 */
export function baseThemeToCSSProperties(base: BaseThemeConfig): Record<string, string> {
  const cssProps: Record<string, string> = {};
  
  // Font sizes
  Object.entries(base.fontSizes).forEach(([key, value]) => {
    cssProps[`--font-size-${key}`] = value;
  });
  
  // Spacing
  Object.entries(base.spacing).forEach(([key, value]) => {
    cssProps[`--spacing-${key}`] = value;
  });
  
  // Border radius
  Object.entries(base.borderRadius).forEach(([key, value]) => {
    cssProps[`--border-radius-${key}`] = value;
  });
  
  // Shadows
  Object.entries(base.shadows).forEach(([key, value]) => {
    cssProps[`--shadow-${key}`] = value;
  });
  
  // Transitions
  Object.entries(base.transitions).forEach(([key, value]) => {
    cssProps[`--transition-${key}`] = value;
  });
  
  // Z-index
  Object.entries(base.zIndex).forEach(([key, value]) => {
    cssProps[`--z-index-${key}`] = value.toString();
  });
  
  return cssProps;
}
