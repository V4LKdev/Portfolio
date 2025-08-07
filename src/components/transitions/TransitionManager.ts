/**
 * TransitionManager.tsx
 * 
 * Manages transition logic and determines which transition component to use.
 * Coordinates between route changes and motion preferences without closures.
 */

import { Location } from 'react-router-dom';

export type TransitionType = 'page' | 'section' | 'none';

export interface TransitionInfo {
  type: TransitionType;
  fromPath: string;
  toPath: string;
}

/**
 * Determines what type of transition should occur between two routes
 */
export function getTransitionType(from: Location | null, to: Location): TransitionInfo {
  // Handle null from location (initial render case)
  if (!from) {
    return {
      type: 'none',
      fromPath: '',
      toPath: to.pathname
    };
  }

  const fromPath = from.pathname;
  const toPath = to.pathname;
  
  // No transition if paths are the same
  if (fromPath === toPath) {
    return {
      type: 'none',
      fromPath,
      toPath
    };
  }
  
  // Define route categories
  const portfolioSections = ['/', '/projects', '/about', '/skills', '/contact', '/additional'];
  const pageRoutes = ['/onboarding', '/exit'];
  
  const isFromPortfolio = portfolioSections.includes(fromPath);
  const isToPortfolio = portfolioSections.includes(toPath);
  const isFromPage = pageRoutes.includes(fromPath);
  const isToPage = pageRoutes.includes(toPath);
  
  // Page transitions (major navigation)
  if (isFromPage || isToPage || (!isFromPortfolio || !isToPortfolio)) {
    return {
      type: 'page',
      fromPath,
      toPath
    };
  }
  
  // Section transitions (within portfolio)
  if (isFromPortfolio && isToPortfolio) {
    return {
      type: 'section', 
      fromPath,
      toPath
    };
  }
  
  // No transition needed
  return {
    type: 'none',
    fromPath,
    toPath
  };
}

/**
 * Utility to check if a route change requires any transition
 */
export function shouldTransition(from: Location, to: Location): boolean {
  const transitionInfo = getTransitionType(from, to);
  return transitionInfo.type !== 'none';
}
