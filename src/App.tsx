/**
 * App.tsx
 *
 * Root application component that sets up routing, error boundaries, and global providers.
 * This component establishes the application's foundation with:
 * - React Query for server state management
 * - React Router for client-side routing
 * - Error boundary for graceful error handling
 * - Toast notifications for user feedback
 * - Modern transition system with real-time reduce motion support
 */

import { Toaster } from "@/components/ui/feedback";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ErrorBoundary from "@/components/errors/ErrorBoundary";
import AppProviders from "@/components/core/AppProviders";
import { TransitionManager } from "@/components/transitions";
import { UserPreferences } from "@/lib/cookies";

// Initialize React Query client for server state management
const queryClient = new QueryClient();

/**
 * Main application component with routing setup
 *
 * @returns JSX element containing the entire application structure
 */
const App = () => {
  // State to track onboarding status - only read cookie once on mount
  const [showOnboarding, setShowOnboarding] = React.useState(() => {
    return UserPreferences.getShowOnboarding();
  });

  // Clean up old cookies on app initialization
  React.useEffect(() => {
    UserPreferences.cleanupOldCookies();
  }, []);

  // Listen for onboarding completion (we'll trigger this from the onboarding page)
  React.useEffect(() => {
    const handleOnboardingComplete = () => {
      setShowOnboarding(false);
    };

    // Listen for custom event
    window.addEventListener("onboardingComplete", handleOnboardingComplete);

    return () => {
      window.removeEventListener(
        "onboardingComplete",
        handleOnboardingComplete,
      );
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <Toaster />

          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <TransitionManager showOnboarding={showOnboarding} />
          </BrowserRouter>
        </AppProviders>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
