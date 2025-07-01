/**
 * Design Token System - Color Palette
 *
 * Centralized color definitions following design system principles.
 * All colors use modern RGB space-separated syntax for better browser support.
 */

export const COLOR_PALETTE = {
  // Amber theme colors
  amber: {
    100: "rgb(254 243 199)",
    200: "rgb(253 230 138)",
    400: "rgb(251 191 36)",
  },

  // Red colors for danger/exit states
  red: {
    500: "rgb(239 68 68)",
  },

  // Gray colors for neutral states
  gray: {
    400: "rgb(156 163 175)",
  },

  // Slate colors for cool theme
  slate: {
    50: "rgb(248 250 252)",
    400: "rgb(148 163 184)",
  },

  // Sky colors for cool theme accents
  sky: {
    300: "rgb(125 211 252)",
    500: "rgb(14 165 233)",
  },

  // Pure colors
  white: "rgb(255 255 255)",
  black: "rgb(0 0 0)",
} as const;

/**
 * Opacity modifiers for consistent transparency levels
 */
export const OPACITY = {
  90: "/ 0.9",
  95: "/ 0.95",
  80: "/ 0.8",
  60: "/ 0.6",
  50: "/ 0.5",
  10: "/ 0.1",
} as const;

type OpacityKey = keyof typeof OPACITY;

/**
 * Helper function to apply opacity to colors
 */
export const withOpacity = (color: string, opacity: OpacityKey): string => {
  return `${color} ${OPACITY[opacity]}`;
};
