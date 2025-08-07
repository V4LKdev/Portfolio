/**
 * FadeRoutes.tsx
 *
 * Route transition system that matches the old working implementation.
 * Features proper state machine with fade-to-black transitions and spinner.
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Portfolio from '@/components/core/Portfolio';
import NotFound from '@/components/errors/NotFound';
import OnboardingPage from '@/pages/OnboardingPage';
import ExitPage from '@/pages/ExitPage';
import { useMotion } from "../../hooks/useMotion";
import { PageTransition } from './PageTransition';
import { getTransitionType } from './TransitionManager';

interface FadeRoutesProps {
  showOnboarding: boolean;
}

type TransitionState = 'idle' | 'fadingOut' | 'loading' | 'fadingIn';

export const FadeRoutes: React.FC<FadeRoutesProps> = ({ showOnboarding }) => {
  const { reduceMotion } = useMotion();
  const location = useLocation();
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const [transitionState, setTransitionState] = useState<TransitionState>('idle');
  const [pendingLocation, setPendingLocation] = useState<typeof location | null>(null);
  const [pageOpacity, setPageOpacity] = useState(1);
  const [showSpinner, setShowSpinner] = useState(false);

  // Calculate overlay opacity based on state (like the old system)
  let overlayOpacity = 0;
  if (!reduceMotion) {
    if (transitionState === 'fadingOut') overlayOpacity = 1;
    if (transitionState === 'loading') overlayOpacity = 1;
    if (transitionState === 'fadingIn') overlayOpacity = 1;
  }

  // Handle location changes (trigger transitions)
  const handleLocationChange = () => {
    if (!displayedLocation) return;
    
    const transitionInfo = getTransitionType(displayedLocation, location);
    
    // Skip transition for section changes
    if (transitionInfo.type === 'none' || transitionInfo.type === 'section') {
      setDisplayedLocation(location);
      return;
    }
    
    // Start page transition
    setPendingLocation(location);
    setTransitionState('fadingOut');
    setPageOpacity(1);
    setTimeout(() => setPageOpacity(0), 10);
  };

  // State machine effect - handles fadingOut state
  useEffect(() => {
    if (transitionState !== 'fadingOut') return;
    
    const duration = reduceMotion ? 80 : 180;
    const timer = setTimeout(() => {
      if (reduceMotion) {
        // Skip loading state for reduced motion
        setTransitionState('fadingIn');
        setDisplayedLocation(pendingLocation!);
        setPageOpacity(0);
        setTimeout(() => setPageOpacity(1), 10);
        setPendingLocation(null);
      } else {
        // Go to loading state
        setTransitionState('loading');
        setShowSpinner(true);
        setPageOpacity(0);
      }
    }, duration);
    
    return () => clearTimeout(timer);
  }, [transitionState, reduceMotion, pendingLocation]);

  // State machine effect - handles loading state
  useEffect(() => {
    if (reduceMotion) return; // Skip loading state for reduced motion
    if (transitionState !== 'loading' || !pendingLocation) return;
    
    const timer = setTimeout(() => {
      setTransitionState('fadingIn');
      setDisplayedLocation(pendingLocation);
      setShowSpinner(false);
      setPageOpacity(0);
      setTimeout(() => setPageOpacity(1), 10);
      setPendingLocation(null);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [transitionState, pendingLocation, reduceMotion]);

  // State machine effect - handles fadingIn state
  useEffect(() => {
    if (transitionState !== 'fadingIn') return;
    
    const duration = reduceMotion ? 80 : 180;
    const timer = setTimeout(() => {
      setTransitionState('idle');
    }, duration);
    
    return () => clearTimeout(timer);
  }, [transitionState, reduceMotion]);

  // Detect route changes and trigger transitions
  useEffect(() => {
    if (location !== displayedLocation) {
      handleLocationChange();
    }
  }, [location.key]); // Use location.key like the old system

  return (
    <PageTransition
      reduceMotion={reduceMotion}
      pageOpacity={pageOpacity}
      overlayOpacity={overlayOpacity}
      showSpinner={showSpinner}
    >
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
    </PageTransition>
  );
};
