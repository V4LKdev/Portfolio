/**
 * Crimson Fire Theme
 * 
 * A bold, passionate red theme for those who prefer intensity.
 * Primary: Deep red for interactive elements
 * Secondary: Dark charcoal for backgrounds and contrast
 */

import type { ColorTheme } from './types';

export const crimsonTheme: ColorTheme = {
  id: 'crimson',
  name: 'Crimson Fire',
  description: 'Bold, passionate red theme with intense energy and strong contrast',
  
  colors: {
    // Primary: Deep red swatch
    primary: {
      main: 'rgb(220 38 38)',       // Red-600
      light: 'rgb(248 113 113)',    // Red-400
      dark: 'rgb(185 28 28)',       // Red-700
      foreground: 'rgb(255 255 255)', // White
    },
    
    // Secondary: Dark charcoal swatch
    secondary: {
      main: 'rgb(38 38 38)',        // Neutral-800
      light: 'rgb(64 64 64)',       // Neutral-700
      dark: 'rgb(23 23 23)',        // Neutral-900
      foreground: 'rgb(245 245 245)', // Neutral-100
    },
    
    // Neutral colors
    neutral: {
      background: 'rgb(0 0 0)',     // Black
      foreground: 'rgb(255 255 255)', // White
      muted: 'rgb(163 163 163)',     // Neutral-400
      border: 'rgb(64 64 64)',       // Neutral-700
    },
    
    // Semantic colors
    semantic: {
      success: 'rgb(34 197 94)',     // Green-500
      warning: 'rgb(245 158 11)',    // Amber-500
      error: 'rgb(239 68 68)',       // Red-500
      info: 'rgb(59 130 246)',       // Blue-500
    },
  },

  // Game-style effects
  effects: {
    menuGlow: 'rgba(248, 113, 113, 0.6)',
    titleGlow: 'rgba(248, 113, 113, 0.5)',
    atmosphericGlow: 'rgba(248, 113, 113, 0.2)',
    videoOverlay: 'linear-gradient(45deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%)',
  },
};

export default crimsonTheme;
