/**
 * AuthGuard.tsx
 *
 * Component to handle routing based on onboarding status
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Session storage key to track if user has passed welcome screen in this session
const SESSION_WELCOME_KEY = "portfolio_welcome_completed_session";

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user has passed welcome screen in this session
    const hasPassedWelcomeThisSession =
      sessionStorage.getItem(SESSION_WELCOME_KEY) === "true";

    // Logic to direct users based on session status
    if (
      !hasPassedWelcomeThisSession &&
      location.pathname !== "/welcome" &&
      location.pathname !== "/goodbye"
    ) {
      // Show welcome screen at the start of each new session
      navigate("/welcome");
    }

    setIsInitialized(true);
  }, [navigate, location.pathname]);

  // Don't render children until initial navigation is determined
  if (!isInitialized) return null;

  return <>{children}</>;
};

export default AuthGuard;
