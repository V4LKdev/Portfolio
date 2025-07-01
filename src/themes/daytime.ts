/**
 * Sunny Daytime Theme
 * 
 * A bright, energetic theme perfect for daytime productivity.
 * Primary: Warm orange for interactive elements
 * Secondary: Clean whites and light grays for backgrounds
 */

import type { ColorTheme } from './types';

export const daytimeTheme: ColorTheme = {
  id: 'daytime',
  name: 'Sunny Daytime',
  description: 'Bright, energetic theme perfect for daytime productivity and focus',
  
  colors: {
    // Primary: Warm orange swatch
    primary: {
      main: 'rgb(249 115 22)',      // Orange-500
      light: 'rgb(251 146 60)',     // Orange-400
      dark: 'rgb(234 88 12)',       // Orange-600
      foreground: 'rgb(255 255 255)', // White
    },
    
    // Secondary: Clean light swatch
    secondary: {
      main: 'rgb(248 250 252)',     // Slate-50
      light: 'rgb(255 255 255)',    // White
      dark: 'rgb(241 245 249)',     // Slate-100
      foreground: 'rgb(30 41 59)',  // Slate-800
    },
    
    // Neutral colors
    neutral: {
      background: 'rgb(255 255 255)', // White
      foreground: 'rgb(15 23 42)',    // Slate-900
      muted: 'rgb(100 116 139)',      // Slate-500
      border: 'rgb(226 232 240)',     // Slate-200
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
    menuGlow: 'rgba(251, 191, 36, 0.6)',
    titleGlow: 'rgba(251, 191, 36, 0.5)',
    atmosphericGlow: 'rgba(251, 191, 36, 0.2)',
    videoOverlay: 'linear-gradient(45deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%)',
  },
};

export default daytimeTheme;
