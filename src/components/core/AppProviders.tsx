/**
 * AppProviders - Global context providers for motion, navigation, audio/video, and navigation state.
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
interface AppProvidersProps { children: React.ReactNode }

export function AppProviders({ children }: AppProvidersProps) {
    // Reduce motion preference (cookie-backed)
    const [reduceMotion, setReduceMotion] = useState<boolean>(() =>
      UserPreferences.getReduceMotion(),
    );

    const toggleReduceMotion = useCallback(() => {
      setReduceMotion((prev) => {
        const next = !prev;
        UserPreferences.setReduceMotion(next);
        return next;
      });
    }, []);

    // Poll + focus listener to keep in sync with external changes
    useEffect(() => {
      const tick = () => {
        const cookieValue = UserPreferences.getReduceMotion();
        if (cookieValue !== reduceMotion) setReduceMotion(cookieValue);
      };
      const interval = setInterval(tick, 500);
      window.addEventListener("focus", tick);
      return () => {
        clearInterval(interval);
        window.removeEventListener("focus", tick);
      };
    }, [reduceMotion]);

    const motionValue = useMemo(
      () => ({ reduceMotion, toggleReduceMotion }),
      [reduceMotion, toggleReduceMotion],
    );

    // Navigation state
    const [currentSection, setCurrentSection] = useState("home");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMenuClick = useCallback(
      (sectionId: string, hierarchy?: string) => {
        const doNav = () => {
          setCurrentSection(sectionId);
          setSelectedProject(null);
          setIsMobileMenuOpen(false);
        };
        if (hierarchy === "primary" || hierarchy === "secondary") {
          setTimeout(doNav, 250);
        } else doNav();
      },
      [],
    );

    const handleProjectClick = useCallback((project: Project) => {
      setSelectedProject(project);
    }, []);

    const handleBackClick = useCallback(() => {
      if (selectedProject) setSelectedProject(null);
      else setCurrentSection("home");
    }, [selectedProject]);

    const navigationValue = useMemo<NavigationContextType>(
      () => ({
        currentSection,
        selectedProject,
        isMobileMenuOpen,
        setCurrentSection,
        setSelectedProject,
        setIsMobileMenuOpen,
        handleMenuClick,
        handleProjectClick,
        handleBackClick,
      }),
      [
        currentSection,
        selectedProject,
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
