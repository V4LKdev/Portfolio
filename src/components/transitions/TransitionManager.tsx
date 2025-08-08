/**
 * TransitionManager.tsx
 *
 * Unified transition system that handles all route transitions with a single, robust component.
 * Uses a state machine approach to ensure smooth, properly-timed transitions.
 */

import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Location,
} from "react-router-dom";
import { motion } from "framer-motion";
import Portfolio from "../core/Portfolio";
import NotFound from "../errors/NotFound";
import OnboardingPage from "../../pages/OnboardingPage";
import ExitPage from "../../pages/ExitPage";
import { CornerSpinner } from "./CornerSpinner";
import BackgroundRoot from "../layout/BackgroundRoot";

type TransitionType = "page" | "section" | "none";

// Portfolio sections where the shared background should remain visible
const PORTFOLIO_SECTIONS = [
  "/",
  "/projects",
  "/about",
  "/skills",
  "/contact",
  "/additional",
];

/**
 * Determines what type of transition should occur between two routes.
 * @param from - Previous location (null for initial render)
 * @param to - Current location
 * @returns Transition type and path information
 */
function getTransitionType(
  from: Location | null,
  to: Location,
): { type: TransitionType; fromPath: string; toPath: string } {
  const fromPath = from?.pathname ?? "/";
  const toPath = to.pathname;

  if (fromPath === toPath) {
    return { type: "none", fromPath, toPath };
  }

  // Route categorization
  const portfolioSections = [
    "/",
    "/projects",
    "/about",
    "/skills",
    "/contact",
    "/additional",
  ];
  const pageRoutes = ["/onboarding", "/exit"];

  const isFromPortfolio = portfolioSections.includes(fromPath);
  const isToPortfolio = portfolioSections.includes(toPath);
  const isFromPage = pageRoutes.includes(fromPath);
  const isToPage = pageRoutes.includes(toPath);

  // Page transitions for major navigation
  if (isFromPage || isToPage || !isFromPortfolio || !isToPortfolio) {
    return { type: "page", fromPath, toPath };
  }

  // Section transitions within portfolio
  if (isFromPortfolio && isToPortfolio) {
    return { type: "section", fromPath, toPath };
  }

  // Fallback to a page transition for any other route changes
  return { type: "page", fromPath, toPath };
}

/**
 * Unified transition wrapper that handles all transition types with a single stable component.
 * Uses a state machine to control timing and ensure content swaps happen at the right moment.
 */
const AdaptiveTransition: React.FC<{
  showOnboarding: boolean;
}> = ({ showOnboarding }) => {
  const location = useLocation();

  // The location whose content is currently displayed - this controls what Routes renders
  const [displayedLocation, setDisplayedLocation] = useState(location);
  // The previous location, for transition type calculation
  const [prevLocation, setPrevLocation] = useState<Location | null>(null);
  // State machine: idle, fadeOut, loading, fadeIn
  const [transitionState, setTransitionState] = useState<
    "idle" | "fadeOut" | "loading" | "fadeIn"
  >("idle");

  // Lock to prevent content swap until transition is ready
  const [allowContentSwap, setAllowContentSwap] = useState(true);

  // Calculate transition type for this route change
  const effectiveTransitionType = React.useMemo(() => {
    return getTransitionType(prevLocation, location).type;
  }, [prevLocation, location]);

  // On route change, start transition
  useEffect(() => {
    if (location !== displayedLocation && allowContentSwap) {
      // Lock content swapping until transition completes
      setAllowContentSwap(false);
      setPrevLocation(displayedLocation);
      setTransitionState("fadeOut");
    }
  }, [location, displayedLocation, allowContentSwap]);

  /*
   * TRANSITION STATE MACHINE
   *
   * Handles page and section transition types with proper timing.
   * Key insight: Routes uses displayedLocation, so content only swaps when we update it.
   */
  useEffect(() => {
    let cleanup: (() => void) | undefined = undefined;

    // PAGE TRANSITION - fade out, loading spinner, fade in
    if (effectiveTransitionType === "page") {
      if (transitionState === "fadeOut") {
        const timer = setTimeout(() => {
          setTransitionState("loading");
        }, 180);
        cleanup = () => clearTimeout(timer);
      }

      if (transitionState === "loading") {
        const timer = setTimeout(() => {
          // Content swap happens here - when user can't see the old content
          setDisplayedLocation(location);
          setTransitionState("fadeIn");
        }, 800);
        cleanup = () => clearTimeout(timer);
      }

      if (transitionState === "fadeIn") {
        const timer = setTimeout(() => {
          setTransitionState("idle");
        }, 180);
        cleanup = () => clearTimeout(timer);
      }
    }

    // SECTION TRANSITION - within portfolio sections (simple fade-out/in)
    /**
     * SECTION TRANSITION DEVELOPER NOTE:
     * -----------------------------------
     * This block currently implements a "snap" (instant) transition between portfolio sections.
     * To implement a proper animated section transition (e.g., crossfade old and new) in the future,
     * replace this logic with a state machine similar to the page transition above. You will need to:
     *
     * 1. Define the desired animation timing (e.g., crossfade 200–300ms).
     * 2. Render BOTH layers temporarily:
     *    - OLD: bound to `displayedLocation` (outgoing)
     *    - NEW: bound to current `location` (incoming) in a transient overlay layer
     * 3. In 'fadeOut' (or 'animating') start the crossfade; at its midpoint, call setDisplayedLocation(location)
     *    so Routes swaps to the new content when users can't notice the swap.
     * 4. Complete with a 'fadeIn' and then set state to 'idle'.
     * 5. Respect the allowContentSwap lock to avoid race conditions.
     *
     * Example pseudocode:
     *   if (transitionState === 'fadeOut') {
     *     // Start crossfade here (outgoing opacity 1->0; incoming opacity 0->1)
     *     setTimeout(() => {
     *       setDisplayedLocation(location); // swap content near midpoint
     *       setTransitionState('fadeIn');
     *     }, ANIMATION_DURATION);
     *   }
     *   if (transitionState === 'fadeIn') {
     *     setTimeout(() => setTransitionState('idle'), ANIMATION_DURATION);
     *   }
     *
     * See the page transition logic above for a robust example.
     */
    if (effectiveTransitionType === "section") {
      if (transitionState === "fadeOut") {
        const timer = setTimeout(() => {
          setDisplayedLocation(location);
          setTransitionState("fadeIn");
        }, 140);
        cleanup = () => clearTimeout(timer);
      }
      if (transitionState === "fadeIn") {
        const timer = setTimeout(() => {
          setTransitionState("idle");
        }, 140);
        cleanup = () => clearTimeout(timer);
      }
    }
    return cleanup;
  }, [transitionState, effectiveTransitionType, location, displayedLocation]);

  // ANIMATION VALUES - calculated from transition state
  const pageOpacity = React.useMemo(() => {
    if (effectiveTransitionType === "page") {
      // For page transitions: visible during idle, hidden during fadeOut/loading, visible during fadeIn
      let pageOpacity: number;
      if (transitionState === "idle" || transitionState === "fadeIn") {
        pageOpacity = 1;
      } else {
        pageOpacity = 0;
      }

      return pageOpacity;
    }

    if (effectiveTransitionType === "section") {
      // For section transitions: fade container out then back in
      if (transitionState === "fadeOut") return 0;
      return 1;
    }

    // For 'none': keep visible
    return 1;
  }, [transitionState, effectiveTransitionType]);

  // Richer section animation: zoom-in with opacity change (no translate)
  const contentAnimate = React.useMemo(() => {
    if (effectiveTransitionType === "section") {
      const isFadingOut = transitionState === "fadeOut";
      return {
        opacity: isFadingOut ? 0.15 : 1,
        scale: isFadingOut ? 1.04 : 1,
      } as const;
    }
    if (effectiveTransitionType === "page") {
      return { opacity: pageOpacity } as const;
    }
    return { opacity: 1 } as const;
  }, [effectiveTransitionType, transitionState, pageOpacity]);

  const contentTransition = React.useMemo(() => {
    if (effectiveTransitionType === "page") {
      return { duration: 0.18, ease: "linear" } as const;
    }
    if (effectiveTransitionType === "section") {
      return { duration: 0.28, ease: "easeInOut" } as const;
    }
    return { duration: 0, ease: "linear" } as const;
  }, [effectiveTransitionType]);

  const overlayOpacity = React.useMemo(() => {
    if (effectiveTransitionType === "page") {
      // During fadeOut and loading keep overlay fully visible (1);
      // During fadeIn fade the overlay out to 0 to reveal content smoothly.
      if (transitionState === "fadeOut" || transitionState === "loading") {
        return 1;
      }
      if (transitionState === "fadeIn") {
        return 0;
      }
      return 0;
    }
    return 0;
  }, [transitionState, effectiveTransitionType]);

  const showSpinner =
    effectiveTransitionType === "page" && transitionState === "loading";

  // Re-enable content swap on idle
  useEffect(() => {
    if (transitionState === "idle") {
      setAllowContentSwap(true);
    }
  }, [transitionState]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {/* Persistent background for portfolio routes, rendered outside the fading layer */}
      {PORTFOLIO_SECTIONS.includes(displayedLocation.pathname) && (
        <BackgroundRoot />
      )}
      <motion.div
        animate={contentAnimate}
        transition={contentTransition}
        style={{ height: "100%", width: "100%" }}
      >
        <div>
          <Routes location={displayedLocation}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route
              path="/"
              element={
                showOnboarding ? (
                  <Navigate to="/onboarding" replace />
                ) : (
                  <Portfolio />
                )
              }
            >
              {/* Nested section routes ensure Portfolio stays mounted across section navigation */}
              <Route index element={<></>} />
              <Route path="projects" element={<></>} />
              <Route path="about" element={<></>} />
              <Route path="skills" element={<></>} />
              <Route path="contact" element={<></>} />
              <Route path="additional" element={<></>} />
            </Route>
            <Route path="/exit" element={<ExitPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </motion.div>
      {/* Overlay for page transition */}
      {effectiveTransitionType === "page" && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            pointerEvents: "none",
            zIndex: 1000,
          }}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.18, ease: "linear" }}
        />
      )}
      {/* Spinner for page transition */}
      {effectiveTransitionType === "page" && showSpinner && <CornerSpinner />}
    </div>
  );
};

interface TransitionManagerProps {
  showOnboarding: boolean;
}

/**
 * Main transition manager - determines transition type and renders the unified transition system.
 */
export const TransitionManager: React.FC<TransitionManagerProps> = ({
  showOnboarding,
}) => {
  return <AdaptiveTransition showOnboarding={showOnboarding} />;
};
