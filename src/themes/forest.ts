/**
 * Forest Emerald Theme
 *
 * A natural, calming green theme inspired by forest environments.
 * Primary: Rich emerald for interactive elements
 * Secondary: Deep forest green for backgrounds and depth
 */

import type { ColorTheme } from "./types";

export const forestTheme: ColorTheme = {
  id: "forest",
  name: "Forest Emerald",
  description:
    "Natural, calming green theme inspired by lush forest environments",

  colors: {
    // Primary: Rich emerald swatch
    primary: {
      main: "rgb(34 197 94)", // Green-500
      light: "rgb(74 222 128)", // Green-400
      dark: "rgb(21 128 61)", // Green-700
      foreground: "rgb(255 255 255)", // White
    },

    // Secondary: Deep forest swatch
    secondary: {
      main: "rgb(22 78 99)", // Cyan-800 (dark teal)
      light: "rgb(30 58 138)", // Blue-800 (dark blue-green)
      dark: "rgb(12 74 110)", // Sky-900 (very dark teal)
      foreground: "rgb(240 253 244)", // Green-50
    },

    // Neutral colors
    neutral: {
      background: "rgb(1 20 25)", // Very dark teal
      foreground: "rgb(240 253 244)", // Green-50
      muted: "rgb(156 163 175)", // Gray-400
      border: "rgb(30 58 138)", // Blue-800
    },

    // Semantic colors
    semantic: {
      success: "rgb(34 197 94)", // Green-500
      warning: "rgb(245 158 11)", // Amber-500
      error: "rgb(239 68 68)", // Red-500
      info: "rgb(59 130 246)", // Blue-500
    },
  },

  // Game-style effects
  effects: {
    menuGlow: "rgba(34, 197, 94, 0.6)",
    titleGlow: "rgba(34, 197, 94, 0.5)",
    atmosphericGlow: "rgba(34, 197, 94, 0.2)",
    videoOverlay:
      "linear-gradient(45deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%)",
  },
};

export default forestTheme;
