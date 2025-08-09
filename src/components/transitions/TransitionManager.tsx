
/**
 * TransitionManager.tsx
 *
 * Unified transition system for all route transitions (page and section) using a state machine.
 * Handles timing, content swapping, and animation overlays for a seamless navigation experience.
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

// Portfolio base sections where the shared background should remain visible
const PORTFOLIO_BASE_PATHS = [
  "/",
  "/projects",
  "/about",
  "/skills",
  "/contact",
  "/additional",
] as const;

function isPortfolioPath(pathname: string): boolean {
  // Root must match exactly
  if (pathname === "/") return true;
  // Any path that starts with a base section (e.g., "/projects" or "/projects/...")
  return PORTFOLIO_BASE_PATHS.some((base) => {
    if (base === "/") return false;
    return pathname === base || pathname.startsWith(base + "/");
  });
}

// Animation and transition timing constants
const PAGE_FADE_DURATION = 180; // ms
const PAGE_LOADING_DURATION = 900; // ms
const SECTION_FADE_DURATION = 280; // ms
const PAGE_FADE_DURATION_S = PAGE_FADE_DURATION / 1000; // seconds
const SECTION_FADE_DURATION_S = SECTION_FADE_DURATION / 1000; // seconds
const SECTION_ZOOM_SCALE = 1.04;
const SECTION_FADE_OPACITY = 0.15;
const VIGNETTE_OPACITY_OUT = 0.18;
const VIGNETTE_OPACITY_IN = 0.08;

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

  // Route categorization (portfolio vs. page routes)
  const pageRoutes = ["/onboarding", "/exit"];

  const isFromPortfolio = isPortfolioPath(fromPath);
  const isToPortfolio = isPortfolioPath(toPath);
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

  // State for transition management
  const [displayedLocation, setDisplayedLocation] = useState(location); // Controls what Routes renders
  const [prevLocation, setPrevLocation] = useState<Location | null>(null); // For transition type calculation
  const [transitionState, setTransitionState] = useState<
    "idle" | "fadeOut" | "loading" | "fadeIn"
  >("idle");
  const [allowContentSwap, setAllowContentSwap] = useState(true); // Prevents content swap until transition is ready

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

  // TRANSITION STATE MACHINE
  // Handles page and section transitions with proper timing.
  useEffect(() => {
    let cleanup: (() => void) | undefined = undefined;

    // PAGE TRANSITION - fade out, loading spinner, fade in
    if (effectiveTransitionType === "page") {
      if (transitionState === "fadeOut") {
        const timer = setTimeout(() => {
          setTransitionState("loading");
        }, PAGE_FADE_DURATION);
        cleanup = () => clearTimeout(timer);
      }
      if (transitionState === "loading") {
        const timer = setTimeout(() => {
          setDisplayedLocation(location);
          setTransitionState("fadeIn");
        }, PAGE_LOADING_DURATION);
        cleanup = () => clearTimeout(timer);
      }
      if (transitionState === "fadeIn") {
        const timer = setTimeout(() => {
          setTransitionState("idle");
        }, PAGE_FADE_DURATION);
        cleanup = () => clearTimeout(timer);
      }
    }
    // SECTION TRANSITION - fade out, swap, fade in
    if (effectiveTransitionType === "section") {
      if (transitionState === "fadeOut") {
        const timer = setTimeout(() => {
          setDisplayedLocation(location);
          setTransitionState("fadeIn");
        }, SECTION_FADE_DURATION);
        cleanup = () => clearTimeout(timer);
      }
      if (transitionState === "fadeIn") {
        const timer = setTimeout(() => {
          setTransitionState("idle");
        }, SECTION_FADE_DURATION);
        cleanup = () => clearTimeout(timer);
      }
    }
    return cleanup;
  }, [transitionState, effectiveTransitionType, location, displayedLocation]);

  // Animation values for content
  const pageOpacity = React.useMemo(() => {
    if (effectiveTransitionType === "page") {
      // For page transitions: visible during idle/fadeIn, hidden during fadeOut/loading
      return (transitionState === "idle" || transitionState === "fadeIn") ? 1 : 0;
    }
    if (effectiveTransitionType === "section") {
      // For section transitions: fade container out then back in
      return transitionState === "fadeOut" ? 0 : 1;
    }
    return 1;
  }, [transitionState, effectiveTransitionType]);

  // Section transition: zoom-in with opacity change
  const contentAnimate = React.useMemo(() => {
    if (effectiveTransitionType === "section") {
      const isFadingOut = transitionState === "fadeOut";
      return {
        opacity: isFadingOut ? SECTION_FADE_OPACITY : 1,
        scale: isFadingOut ? SECTION_ZOOM_SCALE : 1,
      } as const;
    }
    if (effectiveTransitionType === "page") {
      return { opacity: pageOpacity } as const;
    }
    return { opacity: 1 } as const;
  }, [effectiveTransitionType, transitionState, pageOpacity]);

  // Animation timing for framer-motion
  const contentTransition = React.useMemo(() => {
    if (effectiveTransitionType === "page") {
      return { duration: PAGE_FADE_DURATION_S, ease: "linear" } as const;
    }
    if (effectiveTransitionType === "section") {
      return { duration: SECTION_FADE_DURATION_S, ease: "easeInOut" } as const;
    }
    return { duration: 0, ease: "linear" } as const;
  }, [effectiveTransitionType]);

  // Overlay opacity for page transitions
  const overlayOpacity = React.useMemo(() => {
    if (effectiveTransitionType === "page") {
      if (transitionState === "fadeOut" || transitionState === "loading") return 1;
      if (transitionState === "fadeIn") return 0;
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

  // Section vignette overlay opacity
  const sectionVignetteOpacity = React.useMemo(() => {
    if (effectiveTransitionType !== "section") return 0;
    if (transitionState === "fadeOut") return VIGNETTE_OPACITY_OUT;
    if (transitionState === "fadeIn") return VIGNETTE_OPACITY_IN;
    return 0;
  }, [effectiveTransitionType, transitionState]);

  // Hide scrollbars during both fadeOut and fadeIn for section transitions
  const shouldHideOverflow =
    effectiveTransitionType === "section" && (transitionState === "fadeOut" || transitionState === "fadeIn");
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        ...(shouldHideOverflow ? { overflow: "hidden" } : {}),
      }}
    >
      {/* Persistent background for portfolio routes, rendered outside the fading layer */}
  {isPortfolioPath(displayedLocation.pathname) && (
        <BackgroundRoot />
      )}
      <motion.div
        animate={contentAnimate}
        transition={contentTransition}
        style={{ height: "100%", width: "100%" }}
      >
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
            {/* Support nested project routes like /projects/singleplayer */}
            <Route path="projects/*" element={<></>} />
            <Route path="about" element={<></>} />
            <Route path="skills" element={<></>} />
            <Route path="contact" element={<></>} />
            <Route path="additional" element={<></>} />
          </Route>
          <Route path="/exit" element={<ExitPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>

      {/* Subtle vignette overlay for section transitions only */}
    {effectiveTransitionType === "section" && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 900,
            background:
              "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)",
          }}
      animate={{ opacity: sectionVignetteOpacity }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
        />
      )}
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
