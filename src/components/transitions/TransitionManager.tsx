/**
 * TransitionManager.tsx
 * 
 * Unified transition system that handles all route transitions with a single, robust component.
 * Uses a state machine approach to ensure smooth, properly-timed transitions.
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Location } from 'react-router-dom';
import { motion } from 'framer-motion';
import Portfolio from '../core/Portfolio';
import NotFound from '../errors/NotFound';
import OnboardingPage from '../../pages/OnboardingPage';
import ExitPage from '../../pages/ExitPage';
import { useMotion } from "../../hooks/useMotion";
import { CornerSpinner } from './CornerSpinner';

type TransitionType = 'page' | 'section' | 'none' | 'simple';

/**
 * Determines what type of transition should occur between two routes.
 * @param from - Previous location (null for initial render)
 * @param to - Current location
 * @returns Transition type and path information
 */
function getTransitionType(from: Location | null, to: Location): { type: TransitionType; fromPath: string; toPath: string } {
  if (!from) {
    return { type: 'none', fromPath: '', toPath: to.pathname };
  }

  const fromPath = from.pathname;
  const toPath = to.pathname;
  
  if (fromPath === toPath) {
    return { type: 'none', fromPath, toPath };
  }
  
  // Route categorization
  const portfolioSections = ['/', '/projects', '/about', '/skills', '/contact', '/additional'];
  const pageRoutes = ['/onboarding', '/exit'];
  
  const isFromPortfolio = portfolioSections.includes(fromPath);
  const isToPortfolio = portfolioSections.includes(toPath);
  const isFromPage = pageRoutes.includes(fromPath);
  const isToPage = pageRoutes.includes(toPath);
  
  // Page transitions for major navigation
  if (isFromPage || isToPage || (!isFromPortfolio || !isToPortfolio)) {
    return { type: 'page', fromPath, toPath };
  }
  
  // Section transitions within portfolio
  if (isFromPortfolio && isToPortfolio) {
    return { type: 'section', fromPath, toPath };
  }
  
  return { type: 'none', fromPath, toPath };
}

/**
 * Unified transition wrapper that handles all transition types with a single stable component.
 * Uses a state machine to control timing and ensure content swaps happen at the right moment.
 */
const AdaptiveTransition: React.FC<{ 
  transitionType: TransitionType;
  showOnboarding: boolean;
}> = ({ transitionType, showOnboarding }) => {
  const location = useLocation();
  // The location whose content is currently displayed - this controls what Routes renders
  const [displayedLocation, setDisplayedLocation] = useState(location);
  // The previous location, for transition type calculation
  const [prevLocation, setPrevLocation] = useState<Location | null>(null);
  // State machine: idle, fadeOut, loading, fadeIn
  const [transitionState, setTransitionState] = useState<'idle' | 'fadeOut' | 'loading' | 'fadeIn'>('idle');
  
  // Lock to prevent content swap until transition is ready
  const [allowContentSwap, setAllowContentSwap] = useState(true);

  // Calculate transition type for this route change
  const effectiveTransitionType = React.useMemo(() => {
    if (transitionType === 'simple') return 'simple';
    return getTransitionType(prevLocation, location).type;
  }, [transitionType, prevLocation, location]);

  // On route change, start transition
  useEffect(() => {
    if (location !== displayedLocation && allowContentSwap) {
      // Lock content swapping until transition completes
      setAllowContentSwap(false);
      setPrevLocation(displayedLocation);
      setTransitionState('fadeOut');
    }
  }, [location, displayedLocation, allowContentSwap]);

  /*
   * TRANSITION STATE MACHINE
   * 
   * Handles all three transition types with proper timing.
   * Key insight: Routes uses displayedLocation, so content only swaps when we update it.
   */
  useEffect(() => {
    // PAGE TRANSITION - fade out, loading spinner, fade in
    if (effectiveTransitionType === 'page') {
      if (transitionState === 'fadeOut') {
        const timer = setTimeout(() => {
          setTransitionState('loading');
        }, 180);
        return () => clearTimeout(timer);
      }
      
      if (transitionState === 'loading') {
        const timer = setTimeout(() => {
          // Content swap happens here - when user can't see the old content
          setDisplayedLocation(location);
          setTransitionState('fadeIn');
        }, 800);
        return () => clearTimeout(timer);
      }
      
      if (transitionState === 'fadeIn') {
        const timer = setTimeout(() => {
          setTransitionState('idle');
        }, 180);
        return () => clearTimeout(timer);
      }
    }
    
    // SIMPLE TRANSITION - reduced motion
    if (effectiveTransitionType === 'simple') {
      if (transitionState === 'fadeOut') {
        const timer = setTimeout(() => {
          setDisplayedLocation(location);
          setTransitionState('fadeIn');
        }, 300);
        return () => clearTimeout(timer);
      }
      
      if (transitionState === 'fadeIn') {
        const timer = setTimeout(() => {
          setTransitionState('idle');
        }, 300);
        return () => clearTimeout(timer);
      }
    }
    
    // SECTION TRANSITION - within portfolio sections
    if (effectiveTransitionType === 'section') {
      if (transitionState === 'fadeOut') {
        const timer = setTimeout(() => {
          setDisplayedLocation(location);
          setTransitionState('fadeIn');
        }, 300);
        return () => clearTimeout(timer);
      }
      
      if (transitionState === 'fadeIn') {
        const timer = setTimeout(() => {
          setTransitionState('idle');
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [transitionState, effectiveTransitionType, location, displayedLocation]);

  // ANIMATION VALUES - calculated from transition state
  const pageOpacity = React.useMemo(() => {
    if (effectiveTransitionType === 'page') {
      return (transitionState === 'idle' || transitionState === 'fadeIn') ? 1 : 0;
    }
    return transitionState === 'fadeOut' ? 0 : 1;
  }, [transitionState, effectiveTransitionType]);

  const overlayOpacity = React.useMemo(() => {
    if (effectiveTransitionType === 'page') {
      return (transitionState === 'fadeOut' || transitionState === 'loading' || transitionState === 'fadeIn') ? 1 : 0;
    }
    return 0;
  }, [transitionState, effectiveTransitionType]);

  const showSpinner = effectiveTransitionType === 'page' && transitionState === 'loading';

  // Re-enable content swap on idle
  useEffect(() => {
    if (transitionState === 'idle') {
      setAllowContentSwap(true);
    }
  }, [transitionState]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <motion.div
        animate={{ opacity: pageOpacity }}
        transition={{ duration: effectiveTransitionType === 'page' ? 0.18 : 0.3, ease: 'linear' }}
        style={{ height: '100%', width: '100%' }}
      >
        <div key={displayedLocation.pathname}>
          <Routes location={displayedLocation}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route 
              path="/" 
              element={showOnboarding ? <Navigate to="/onboarding" replace /> : <Portfolio />} 
            />
            <Route 
              path="/projects" 
              element={showOnboarding ? <Navigate to="/onboarding" replace /> : <Portfolio />} 
            />
            <Route 
              path="/about" 
              element={showOnboarding ? <Navigate to="/onboarding" replace /> : <Portfolio />} 
            />
            <Route 
              path="/skills" 
              element={showOnboarding ? <Navigate to="/onboarding" replace /> : <Portfolio />} 
            />
            <Route 
              path="/contact" 
              element={showOnboarding ? <Navigate to="/onboarding" replace /> : <Portfolio />} 
            />
            <Route 
              path="/additional" 
              element={showOnboarding ? <Navigate to="/onboarding" replace /> : <Portfolio />} 
            />
            <Route path="/exit" element={<ExitPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </motion.div>
      {/* Overlay for page transition */}
      {effectiveTransitionType === 'page' && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.18, ease: 'linear' }}
        />
      )}
      {/* Spinner for page transition */}
      {effectiveTransitionType === 'page' && showSpinner && <CornerSpinner />}
    </div>
  );
};

interface TransitionManagerProps {
  showOnboarding: boolean;
}

/**
 * Main transition manager - determines transition type and renders the unified transition system.
 */
export const TransitionManager: React.FC<TransitionManagerProps> = ({ showOnboarding }) => {
  const { reduceMotion } = useMotion();
  const location = useLocation();

  // Determine transition type for stable component selection
  const transitionInfo = getTransitionType(null, location);
  const transitionType = reduceMotion ? 'simple' : transitionInfo.type;
  
  return (
    <AdaptiveTransition transitionType={transitionType} showOnboarding={showOnboarding} />
  );
};
