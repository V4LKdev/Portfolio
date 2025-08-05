/**
 * App.tsx
 *
 * Root application component that sets up routing, error boundaries, and global providers.
 * This component establishes the application's foundation with:
 * - React Query for server state management
 * - React Router for client-side routing
 * - Error boundary for graceful error handling
 * - Toast notifications for user feedback
 */

import { Toaster } from "@/components/ui/feedback";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Portfolio from "@/components/core/Portfolio";
import NotFound from "@/components/errors/NotFound";
import ErrorBoundary from "@/components/errors/ErrorBoundary";
import AppProviders from "@/components/core/AppProviders";
import OnboardingPage from "@/pages/OnboardingPage";
import ExitPage from "@/pages/ExitPage";
import { UserPreferences } from "@/lib/cookies";

// Initialize React Query client for server state management
const queryClient = new QueryClient();

/**
 * Main application component with routing setup
 *
 * @returns JSX element containing the entire application structure
 */

const App = () => {
  // State to track onboarding status reactively
  const [showOnboarding, setShowOnboarding] = React.useState(() => {
    const shouldShow = UserPreferences.getShowOnboarding();
    console.log("🔍 Initial showOnboarding:", shouldShow);
    return shouldShow;
  });

  // Clean up old cookies on app initialization
  React.useEffect(() => {
    UserPreferences.cleanupOldCookies();
  }, []);

  // Listen for onboarding completion (we'll trigger this from the onboarding page)
  React.useEffect(() => {
    const handleOnboardingComplete = () => {
      console.log("🎉 Onboarding complete event received!");
      setShowOnboarding(false);
    };

    // Listen for custom event
    window.addEventListener('onboardingComplete', handleOnboardingComplete);
    
    return () => {
      window.removeEventListener('onboardingComplete', handleOnboardingComplete);
    };
  }, []);

  console.log("🔄 App render - showOnboarding:", showOnboarding);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <Toaster />
          <BrowserRouter>
            <FadeRoutes showOnboarding={showOnboarding} />
          </BrowserRouter>
        </AppProviders>
      </QueryClientProvider>
    </ErrorBoundary>
 );
}


// FadeRoutes: handles route transitions with fade-to-black, spinner hold, and fade-in
const FadeRoutes: React.FC<{ showOnboarding: boolean }> = ({ showOnboarding }) => {
  const location = useLocation();
  const [transitionState, setTransitionState] = useState<'idle' | 'fadingOut' | 'loading' | 'fadingIn'>('idle');
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const [showSpinner, setShowSpinner] = useState(false);


  React.useEffect(() => {
    if (location !== displayedLocation) {
      setTransitionState('fadingOut');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Step 1: Fade out old page
  React.useEffect(() => {
    if (transitionState === 'fadingOut') {
      setTimeout(() => {
        setTransitionState('loading');
        setShowSpinner(true);
      }, 180); // fade out duration (snappy)
    }
  }, [transitionState]);

  // Step 2: Hold black with spinner
  React.useEffect(() => {
    if (transitionState === 'loading') {
      setTimeout(() => {
        setTransitionState('fadingIn');
        setDisplayedLocation(location);
        setShowSpinner(false);
      }, 800); // black hold duration (snappier)
    }
  }, [transitionState, location]);

  // Step 3: After fade in, return to idle
  React.useEffect(() => {
    if (transitionState === 'fadingIn') {
      setTimeout(() => {
        setTransitionState('idle');
      }, 180); // fade in duration (snappy)
    }
  }, [transitionState]);

  // Determine opacity for overlay
  let overlayOpacity = 0;
  if (transitionState === 'fadingOut') overlayOpacity = 1;
  if (transitionState === 'loading') overlayOpacity = 1;
  if (transitionState === 'fadingIn') overlayOpacity = 1;

  // Robust fade-out/fade-in: keep a stable key, animate out before location changes, then fade in new page
  const [pageOpacity, setPageOpacity] = useState(1);
  const [pendingLocation, setPendingLocation] = useState(null as null | typeof location);

  // Detect route change and start fade-out
  React.useEffect(() => {
    if (location !== displayedLocation) {
      setPendingLocation(location);
      setTransitionState('fadingOut');
      setPageOpacity(1);
      setTimeout(() => setPageOpacity(0), 10); // trigger fade-out
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // After fade-out, show spinner/black, then update location and fade in
  React.useEffect(() => {
    if (transitionState === 'fadingOut') {
      setTimeout(() => {
        setTransitionState('loading');
        setShowSpinner(true);
        setPageOpacity(0);
      }, 180); // fade out duration
    }
  }, [transitionState]);

  React.useEffect(() => {
    if (transitionState === 'loading' && pendingLocation) {
      setTimeout(() => {
        setTransitionState('fadingIn');
        setDisplayedLocation(pendingLocation);
        setShowSpinner(false);
        setPageOpacity(0);
        setTimeout(() => setPageOpacity(1), 10); // trigger fade-in
        setPendingLocation(null);
      }, 800); // black hold duration (snappier)
    }
  }, [transitionState, pendingLocation]);

  React.useEffect(() => {
    if (transitionState === 'fadingIn') {
      setTimeout(() => {
        setTransitionState('idle');
      }, 180); // fade in duration
    }
  }, [transitionState]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <motion.div
        key="fade-content"
        initial={{ opacity: 1 }}
        animate={{ opacity: pageOpacity }}
        transition={{ duration: 0.18, ease: 'linear' }}
        style={{ height: '100%' }}
      >
        <Routes location={displayedLocation}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route 
            path="/" 
            element={showOnboarding ? <Navigate to="/onboarding" replace /> : <Portfolio />} 
          />
          <Route path="/exit" element={<ExitPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
      {/* Black overlay for fade and loading */}
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
      {showSpinner && <CornerSpinner />}
    </div>
  );
};

// CornerSpinner: only the top arc is white, rest of the ring is transparent
const CornerSpinner = () => (
  <div
    style={{
      position: "fixed",
      right: 20,
      bottom: 20,
      zIndex: 1100,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    aria-label="Loading..."
  >
    <div
      style={{
        width: 28,
        height: 28,
        border: "3px solid transparent",
        borderTop: "3px solid #fff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        background: "transparent",
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default App;
