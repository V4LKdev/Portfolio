/**
 * AppProviders - Global context providers for motion, navigation, and video state
 */

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { UserPreferences } from "../../lib/cookies";
import {
  NavigationContext,
  type NavigationContextType,
} from "../../contexts/NavigationContext";
import { MotionContext } from "../../contexts/MotionContext";
import VideoProvider from "../../contexts/VideoProvider";
import AudioProvider from "../../contexts/AudioProvider";
import { type Project } from "../../content";
// Purge: remove audio engine and video coupling for this refactor branch

interface AppProvidersProps {
  readonly children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  // Accessibility: Reduce motion state, initialized from UserPreferences
  const [reduceMotion, setReduceMotion] = useState(() =>
    UserPreferences.getReduceMotion(),
  );

  // Listen for cookie changes and sync the context state
  useEffect(() => {
    const checkForCookieChanges = () => {
      const cookieValue = UserPreferences.getReduceMotion();
      if (cookieValue !== reduceMotion) {
        setReduceMotion(cookieValue);
      }
    };

    // Check for changes periodically (every 500ms)
    const interval = setInterval(checkForCookieChanges, 500);

    // Also check on window focus (when user comes back to tab)
    const handleFocus = () => checkForCookieChanges();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [reduceMotion]);

  // Toggle reduce motion and persist to cookies
  const toggleReduceMotion = useCallback(() => {
    setReduceMotion((prev) => {
      const newValue = !prev;
      UserPreferences.setReduceMotion(newValue);
      return newValue;
    });
  }, []);

  // Video/audio controls purged in this branch; no provider needed

  const motionValue = useMemo(
    () => ({
      reduceMotion,
      toggleReduceMotion,
    }),
    [reduceMotion, toggleReduceMotion],
  );

  const [currentSection, setCurrentSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Keep background video playback consistent across inner sections.
  // We no longer auto-pause when leaving Home; user preference controls playback.

  const handleMenuClick = useCallback(
    (sectionId: string, hierarchy?: string) => {
      const doNav = () => {
        setCurrentSection(sectionId);
        setSelectedProject(null);
        setIsMobileMenuOpen(false);
      };
      if (hierarchy === "primary" || hierarchy === "secondary") {
        setTimeout(doNav, 250);
      } else {
        doNav();
      }
    },
    [],
  );

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleBackClick = useCallback(() => {
    if (selectedProject) {
      setSelectedProject(null);
    } else {
      setCurrentSection("home");
    }
  }, [selectedProject]);

  const navigationValue = useMemo<NavigationContextType>(
    () => ({
      currentSection,
      selectedProject,
      projectFilter,
      isMobileMenuOpen,
      setCurrentSection,
      setSelectedProject,
      setProjectFilter,
      setIsMobileMenuOpen,
      handleMenuClick,
      handleProjectClick,
      handleBackClick,
    }),
    [
      currentSection,
      selectedProject,
      projectFilter,
      isMobileMenuOpen,
      handleMenuClick,
      handleProjectClick,
      handleBackClick,
    ],
  );

  return (
    <MotionContext.Provider value={motionValue}>
      <NavigationContext.Provider value={navigationValue}>
        <VideoProvider>
          <AudioProvider>{children}</AudioProvider>
        </VideoProvider>
      </NavigationContext.Provider>
    </MotionContext.Provider>
  );
}

export default AppProviders;
