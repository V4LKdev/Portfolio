/**
 * Theme Registry and Loader System
 *
 * Provides lazy loading for themes and centralized theme management.
 * Each theme is loaded only when needed to optimize bundle size.
 */

import type { ColorTheme, ThemeLoader } from "./types";

/**
 * Theme registry with lazy loaders
 */
export const THEME_REGISTRY: Record<string, ThemeLoader> = {
  moonlight: () => import("./moonlight").then((m) => m.default),
  daytime: () => import("./daytime").then((m) => m.default),
  crimson: () => import("./crimson").then((m) => m.default),
  forest: () => import("./forest").then((m) => m.default),
};

/**
 * Available theme IDs
 */
export const AVAILABLE_THEME_IDS = Object.keys(THEME_REGISTRY);

/**
 * Default theme ID
 */
export const DEFAULT_THEME_ID = "moonlight";

/**
 * Theme metadata for quick access without loading full themes
 */
export const THEME_METADATA = {
  moonlight: {
    id: "moonlight",
    name: "Moonlight Night",
    description:
      "Cool blue theme with modern aesthetics perfect for nighttime browsing",
  },
  daytime: {
    id: "daytime",
    name: "Sunny Daytime",
    description:
      "Bright, energetic theme perfect for daytime productivity and focus",
  },
  crimson: {
    id: "crimson",
    name: "Crimson Fire",
    description:
      "Bold, passionate red theme with intense energy and strong contrast",
  },
  forest: {
    id: "forest",
    name: "Forest Emerald",
    description:
      "Natural, calming green theme inspired by lush forest environments",
  },
} as const;

/**
 * Cache for loaded themes
 */
const themeCache = new Map<string, ColorTheme>();

/**
 * Load a theme by ID with caching
 */
export async function loadTheme(themeId: string): Promise<ColorTheme | null> {
  // Check cache first
  if (themeCache.has(themeId)) {
    return themeCache.get(themeId)!;
  }

  // Check if theme exists
  const loader = THEME_REGISTRY[themeId];
  if (!loader) {
    console.warn(`Theme "${themeId}" not found in registry`);
    return null;
  }

  try {
    // Load theme
    const theme = await loader();

    // Cache the loaded theme
    themeCache.set(themeId, theme);

    return theme;
  } catch (error) {
    console.error(`Failed to load theme "${themeId}":`, error);
    return null;
  }
}

/**
 * Preload a theme for faster switching
 */
export async function preloadTheme(themeId: string): Promise<void> {
  await loadTheme(themeId);
}

/**
 * Preload all themes for instant switching
 */
export async function preloadAllThemes(): Promise<void> {
  await Promise.all(AVAILABLE_THEME_IDS.map(preloadTheme));
}

/**
 * Get theme metadata without loading the full theme
 */
export function getThemeMetadata(themeId: string) {
  return THEME_METADATA[themeId as keyof typeof THEME_METADATA] || null;
}

/**
 * Get all theme metadata
 */
export function getAllThemeMetadata() {
  return Object.values(THEME_METADATA);
}

/**
 * Check if a theme ID is valid
 */
export function isValidThemeId(themeId: string): boolean {
  return AVAILABLE_THEME_IDS.includes(themeId);
}
