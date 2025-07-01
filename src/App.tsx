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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "@/components/core/Portfolio";
import NotFound from "@/components/errors/NotFound";
import ErrorBoundary from "@/components/errors/ErrorBoundary";
import ButtonDemoPage from "@/components/navigation/ButtonDemoPage";

// Initialize React Query client for server state management
const queryClient = new QueryClient();

/**
 * Main application component with routing setup
 *
 * @returns JSX element containing the entire application structure
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/button-demo" element={<ButtonDemoPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
