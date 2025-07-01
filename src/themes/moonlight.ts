/**
 * Moonlight Night Theme
 * 
 * A cool, sophisticated blue theme perfect for nighttime browsing.
 * Primary: Cool blue for interactive elements
 * Secondary: Deep slate for backgrounds and containers
 */

import type { ColorTheme } from './types';

export const moonlightTheme: ColorTheme = {
  id: 'moonlight',
  name: 'Moonlight Night',
  description: 'Cool blue theme with modern aesthetics perfect for nighttime browsing',
  
  colors: {
    // Primary: Cool blue swatch
    primary: {
      main: 'rgb(59 130 246)',      // Blue-500
      light: 'rgb(125 211 252)',    // Sky-300  
      dark: 'rgb(37 99 235)',       // Blue-600
      foreground: 'rgb(248 250 252)', // Slate-50
    },
    
    // Secondary: Deep slate swatch
    secondary: {
      main: 'rgb(30 41 59)',        // Slate-800
      light: 'rgb(51 65 85)',       // Slate-700
      dark: 'rgb(15 23 42)',        // Slate-900
      foreground: 'rgb(226 232 240)', // Slate-200
    },
    
    // Neutral colors
    neutral: {
      background: 'rgb(2 6 23)',    // Very dark blue-gray
      foreground: 'rgb(248 250 252)', // Slate-50
      muted: 'rgb(148 163 184)',     // Slate-400
      border: 'rgb(51 65 85)',       // Slate-700
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
    menuGlow: 'rgba(14, 165, 233, 0.8)',
    titleGlow: 'rgba(14, 165, 233, 0.6)',
    atmosphericGlow: 'rgba(14, 165, 233, 0.15)',
    videoOverlay: 'linear-gradient(45deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%)',
  },
};

export default moonlightTheme;
