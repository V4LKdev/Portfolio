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
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
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
            <Routes>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route 
                path="/" 
                element={showOnboarding ? <Navigate to="/onboarding" replace /> : <Portfolio />} 
              />
              <Route path="/exit" element={<ExitPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProviders>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
