/**
 * AppProviders - Global context providers for video and navigation state management
 */

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { UserPreferences } from "../../lib/cookies";
import {
  VideoControlContext,
} from "../../contexts/VideoControlContext";
import {
  NavigationContext,
  type NavigationContextType,
} from "../../contexts/NavigationContext";
import { type Project } from "../../content";

interface AppProvidersProps {
  readonly children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const lastVideoTimeRef = useRef(0);
  
  const [isPaused, setIsPaused] = useState(() => {
    const autoplayEnabled = UserPreferences.getVideoAutoplayEnabled();
    return !autoplayEnabled;
  });

  const [isMuted, setIsMuted] = useState(() =>
    UserPreferences.getGlobalAudioMuted(),
  );

  const [isManuallyPaused, setIsManuallyPaused] = useState(() => {
    const autoplayEnabled = UserPreferences.getVideoAutoplayEnabled();
    return !autoplayEnabled;
  });

  const togglePlayback = useCallback(() => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    setIsManuallyPaused(newPausedState);
    UserPreferences.setVideoAutoplayEnabled(!newPausedState);
  }, [isPaused]);

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    UserPreferences.setGlobalAudioMuted(newMutedState);
  }, [isMuted]);

  const setManualPause = useCallback((paused: boolean) => {
    setIsPaused(paused);
    setIsManuallyPaused(paused);
    UserPreferences.setVideoAutoplayEnabled(!paused);
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
    return undefined;
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

  // Video Element Sync & Resume
  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) return;
    
    // Restore last playback time if available
    if (lastVideoTimeRef.current > 0) {
      video.currentTime = lastVideoTimeRef.current;
    }
    
    // Sync video element with our state
    video.muted = isMuted;
    
    // Handle play/pause sync
    if (isPaused && !video.paused) {
      video.pause();
    } else if (!isPaused && video.paused) {
      video.play().catch(() => {});
    }
    
    // Save current time on unmount
    const handleBeforeUnload = () => {
      lastVideoTimeRef.current = video.currentTime;
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Save current time on navigation away
      if (!video.paused) {
        lastVideoTimeRef.current = video.currentTime;
      }
    };
  }, [isPaused, isMuted]);

  // Tab Visibility Resume Logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Note: shouldBePaused is the inverse of autoplay enabled
        const autoplayEnabled = UserPreferences.getVideoAutoplayEnabled();
        const shouldBePaused = !autoplayEnabled;
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

  const videoValue = useMemo(
    () => ({
      isPaused,
      isMuted,
      isManuallyPaused,
      togglePlayback,
      toggleMute,
      setManualPause,
      lastVideoTime: lastVideoTimeRef.current,
      setLastVideoTime: (t: number) => {
        lastVideoTimeRef.current = t;
      },
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

  const handleMenuClick = useCallback((sectionId: string, hierarchy?: string) => {
    const doNav = () => {
      setCurrentSection(sectionId);
      setSelectedProject(null);
      setIsMobileMenuOpen(false);
    };
    if (hierarchy === "primary" || hierarchy === "secondary") {
      setTimeout(doNav, 250); // 250ms delay for primary/secondary
    } else {
      doNav();
    }
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
        {/* Provide lastVideoTimeRef to children via context if needed in the future */}
        {children}
      </NavigationContext.Provider>
    </VideoControlContext.Provider>
  );
}

export default AppProviders;
