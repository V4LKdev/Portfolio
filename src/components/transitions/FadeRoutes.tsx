/**
 * FadeRoutes.tsx
 *
 * Handles route transitions with configurable animation modes:
 * - Full mode: fade-to-black with loading spinner and hold duration
 * - Reduced motion mode: simple fade transition for accessibility
 */

import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Portfolio from '@/components/core/Portfolio';
import NotFound from '@/components/errors/NotFound';
import OnboardingPage from '@/pages/OnboardingPage';
import ExitPage from '@/pages/ExitPage';
import { CornerSpinner } from './CornerSpinner';
import { useTransitionState } from './useTransitionState';

interface FadeRoutesProps {
  showOnboarding: boolean;
  reduceMotion?: boolean;
}

export const FadeRoutes: React.FC<FadeRoutesProps> = ({ 
  showOnboarding, 
  reduceMotion = false 
}) => {
  const location = useLocation();
  const [displayedLocation, setDisplayedLocation] = useState(location);
  
  const {
    pageOpacity,
    overlayOpacity,
    showSpinner,
    handleLocationChange
  } = useTransitionState({
    location,
    displayedLocation,
    setDisplayedLocation,
    reduceMotion
  });

  // Detect route changes and trigger transitions
  React.useEffect(() => {
    if (location !== displayedLocation) {
      handleLocationChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <motion.div
        key="fade-content"
        initial={{ opacity: 1 }}
        animate={{ opacity: pageOpacity }}
        transition={{ 
          duration: reduceMotion ? 0.15 : 0.18, 
          ease: 'linear' 
        }}
        style={{ height: '100%' }}
      >
        <Routes location={displayedLocation}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route 
            path="/" 
            element={showOnboarding ? <Navigate to="/onboarding" replace /> : <Portfolio />} 
          />
          {/* Homepage section routes - redirect to onboarding if not completed */}
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
      
      {/* Black overlay for fade and loading (hidden in reduced motion mode) */}
      {!reduceMotion && (
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
      
      {/* Loading spinner (only shown in full animation mode) */}
      {!reduceMotion && showSpinner && <CornerSpinner />}
    </div>
  );
};
