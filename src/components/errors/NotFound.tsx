/**
 * NotFound.tsx
 *
 * 404 error page component for handling unknown routes.
 * Provides a user-friendly message and navigation back to the home page.
 * Uses the application's theming system for consistent styling.
 */

import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSoundEffects } from "../../hooks/useSoundEffects";

/**
 * 404 Not Found page component
 *
 * Displayed when users navigate to routes that don't exist.
 * Includes analytics tracking and consistent styling with the main application.
 *
 * @returns JSX element for the 404 error page
 */
const NotFound = () => {
  const location = useLocation();
  const { playHover, playUnhover, playClick } = useSoundEffects();

  useEffect(() => {
    // Track navigation to non-existent routes for analytics
    // ...removed console.warn...
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          onClick={playClick}
          onMouseEnter={playHover}
          onMouseLeave={playUnhover}
          className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
