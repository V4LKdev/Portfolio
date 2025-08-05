/**
 * App.tsx
 *
 * Root application component that sets up routing, error boundaries, and global providers.
 * This component establishes the application's foundation with:
 * - React Query for server state management
 * - React Router for client-side routing
 * - Error boundary for graceful error handling
 * - Toast notifications for user feedback
 * - Configurable route transitions (full animation vs reduced motion)
 */

import { Toaster } from "@/components/ui/feedback";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import React, { useState } from "react";
import ErrorBoundary from "@/components/errors/ErrorBoundary";
import AppProviders from "@/components/core/AppProviders";
import { FadeRoutes } from "@/components/transitions";
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

  // State for reduced motion accessibility setting (will be moved to cookies later)
  const [reduceMotion, setReduceMotion] = useState(false);

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

  console.log("🔄 App render - showOnboarding:", showOnboarding, "reduceMotion:", reduceMotion);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <Toaster />
          
          {/* Test toggle for reduced motion (temporary - will move to settings later) */}
          <button
            style={{ 
              position: 'fixed', 
              top: 10, 
              left: 10, 
              zIndex: 9999, 
              background: reduceMotion ? '#2563eb' : '#222',
              color: 'white', 
              padding: '8px 12px', 
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'system-ui'
            }}
            onClick={() => setReduceMotion((v: boolean) => !v)}
            aria-pressed={reduceMotion}
            title="Toggle animation mode"
          >
            {reduceMotion ? 'Reduce Motion: ON' : 'Reduce Motion: OFF'}
          </button>

          <BrowserRouter>
            <FadeRoutes 
              showOnboarding={showOnboarding} 
              reduceMotion={reduceMotion} 
            />
          </BrowserRouter>
        </AppProviders>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
