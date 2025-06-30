// AppProviders.tsx
// Consolidated global providers for navigation and video state

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { VideoPreferences } from "../lib/cookies";
import {
  VideoControlContext,
  VideoControlContextType,
} from "../contexts/VideoControlContext";
import {
  NavigationContext,
  NavigationContextType,
} from "../contexts/NavigationContext";
import { type Project } from "../content";

// -------------------- AppProviders Component --------------------

interface AppProvidersProps {
  readonly children: React.ReactNode;
}

/**
 * AppProviders
 *
 * Consolidated global providers for navigation and video state management.
 * Provides all context needed for the portfolio application:
 *
 * Video Features:
 * - Cookie-based preference persistence (remembers user settings across sessions)
 * - Auto-pause when navigating away from home (for performance)
 * - Auto-resume when returning to home (respects user's manual pause intent)
 * - Tab visibility handling (auto-resumes when tab becomes visible)
 * - Media session integration (responds to hardware media keys)
 * - Keyboard controls (space bar, media keys)
 * - Video element synchronization
 *
 * Navigation Features:
 * - Section navigation (home, projects, about, skills, contact)
 * - Project detail navigation
 * - Mobile menu state management
 * - Project filtering
 *
 * @param children - Child components that need access to global state
 */
export function AppProviders({ children }: AppProvidersProps) {
  // --- Video State ---
  const [isPaused, setIsPaused] = useState(() => {
    const initial = VideoPreferences.getPaused();
    return initial;
  });
  const [isMuted, setIsMuted] = useState(() => VideoPreferences.getMuted());
  const [isManuallyPaused, setIsManuallyPaused] = useState(() => {
    const initial = VideoPreferences.getPaused();
    return initial;
  });
  const togglePlayback = useCallback(() => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    setIsManuallyPaused(newPausedState);
    VideoPreferences.setPaused(newPausedState);
  }, [isPaused]);

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    VideoPreferences.setMuted(newMutedState);
  }, [isMuted]);

  const setManualPause = useCallback((paused: boolean) => {
    setIsPaused(paused);
    setIsManuallyPaused(paused);
    VideoPreferences.setPaused(paused);
  }, []);

  // Media Session Integration
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => {
        if (isPaused) togglePlayback();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        if (!isPaused) togglePlayback();
      });
      return () => {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
      };
    }
  }, [isPaused, togglePlayback]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shouldHandleSpace =
        event.code === "Space" && event.target === document.body;
      const shouldHandleMediaKey =
        event.code === "MediaPlayPause" ||
        (event.code === "MediaPlay" && isPaused) ||
        (event.code === "MediaPause" && !isPaused);
      if (shouldHandleSpace || shouldHandleMediaKey) {
        event.preventDefault();
        togglePlayback();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, togglePlayback]);

  // Video Element Sync
  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) return;
    const handlePlay = () => {
      if (isPaused) {
        setIsPaused(false);
        setIsManuallyPaused(false);
      }
    };
    const handlePause = () => {
      if (!isPaused) {
        setIsPaused(true);
        setIsManuallyPaused(true);
      }
    };
    const handleVolumeChange = () => {
      if (video.muted !== isMuted) {
        setIsMuted(video.muted);
      }
    };
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [isPaused, isMuted]); // Tab Visibility Resume Logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const shouldBePaused = VideoPreferences.getPaused();
        setIsPaused(shouldBePaused);
        setIsManuallyPaused(shouldBePaused);
        if (!shouldBePaused) {
          const video = document.querySelector("video");
          if (video?.paused) {
            video.play().catch(() => {});
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const videoValue = useMemo<VideoControlContextType>(
    () => ({
      isPaused,
      isMuted,
      isManuallyPaused,
      togglePlayback,
      toggleMute,
      setManualPause,
    }),
    [
      isPaused,
      isMuted,
      isManuallyPaused,
      togglePlayback,
      toggleMute,
      setManualPause,
    ],
  );
  // --- Navigation State ---
  const [currentSection, setCurrentSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track the user's pause state before navigation to restore it later
  const [pauseStateBeforeNavigation, setPauseStateBeforeNavigation] =
    React.useState<boolean | null>(null);
  // Navigation Effects - Auto-pause when leaving home, auto-resume when returning
  useEffect(() => {
    if (currentSection !== "home") {
      // Store the current manual pause state before auto-pausing
      setPauseStateBeforeNavigation(isManuallyPaused);
      setIsPaused(true);
      // Note: We don't call setManualPause here because this is auto-pause, not user intent
    }
  }, [currentSection, isManuallyPaused]);

  // Auto-resume video when returning to home section, but respect manual pause intent
  useEffect(() => {
    if (currentSection === "home" && pauseStateBeforeNavigation !== null) {
      // Restore the user's original pause intent from before navigation
      setManualPause(pauseStateBeforeNavigation);
      setPauseStateBeforeNavigation(null);
    }
  }, [currentSection, pauseStateBeforeNavigation, setManualPause]);

  const handleMenuClick = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
    setSelectedProject(null);
    setIsMobileMenuOpen(false);
  }, []);

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

  // Debug: Track state changes
  useEffect(() => {
    // State tracking can be added here for development if needed
  }, [isPaused, isManuallyPaused, currentSection]);

  return (
    <VideoControlContext.Provider value={videoValue}>
      <NavigationContext.Provider value={navigationValue}>
        {children}
      </NavigationContext.Provider>
    </VideoControlContext.Provider>
  );
}
