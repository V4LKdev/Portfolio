/**
 * Spacing Configuration Constants
 *
 * Centralized spacing values for consistent layout and responsive design.
 * Uses CSS clamp() for fluid scaling between viewport sizes.
 */

export const SPACING_CONFIG = {
  // Navigation menu item spacing
  NAVIGATION: {
    PRIMARY: "mb-[clamp(2rem,4vh,5rem)]", // Primary section: 32px-80px based on viewport
    SECONDARY: "mb-[clamp(1.5rem,3vh,3rem)]", // Secondary: 24px-48px
    TERTIARY: "mb-[clamp(1.25rem,2.5vh,2.5rem)]", // Tertiary: 20px-40px
    QUIT: "mb-[clamp(0.5rem,1vh,1rem)]", // Small consistent space
    PATCHNOTES: "mt-[clamp(2rem,4vh,5rem)] mb-[clamp(0.5rem,1vh,1rem)]", // Large space before, small after
  },

  // Header spacing
  HEADER: {
    PADDING_TOP: "pt-14 md:pt-20",
    PADDING_BOTTOM: "pb-[clamp(1.5rem,3vh,5rem)]",
    PADDING_X: "px-8 md:px-12",
  },

  // Component spacing
  COMPONENT: {
    CONTAINER_PADDING: "p-8",
    MIN_HEIGHT: "min-h-[600px]",
    BUTTON_PADDING: "px-6 py-4",
    FILTER_PADDING: "px-6 py-3",
    ICON_SPACING: "space-x-2",
  },

  // Effect dimensions
  EFFECTS: {
    UNDERLINE_HEIGHT: "h-0.5",
    BORDER_WIDTH: "border-2",
    ICON_GAP: "gap-3",
    ICON_MARGIN: "mr-1",
    QUIT_MARGIN_TOP: "mt-2",
  },
} as const;

export type NavigationSpacing = keyof typeof SPACING_CONFIG.NAVIGATION;
export type HeaderSpacing = keyof typeof SPACING_CONFIG.HEADER;
export type ComponentSpacing = keyof typeof SPACING_CONFIG.COMPONENT;
export type EffectSpacing = keyof typeof SPACING_CONFIG.EFFECTS;
