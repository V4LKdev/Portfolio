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
import { VideoControlContext } from "../../contexts/VideoControlContext";
import {
  NavigationContext,
  type NavigationContextType,
} from "../../contexts/NavigationContext";
import { MotionContext } from "../../contexts/MotionContext";
import { type Project } from "../../content";

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

  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) return;

    if (lastVideoTimeRef.current > 0) {
      video.currentTime = lastVideoTimeRef.current;
    }

    video.muted = isMuted;

    if (isPaused && !video.paused) {
      video.pause();
    } else if (!isPaused && video.paused) {
      video.play().catch(() => {});
    }

    const handleBeforeUnload = () => {
      lastVideoTimeRef.current = video.currentTime;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (!video.paused) {
        lastVideoTimeRef.current = video.currentTime;
      }
    };
  }, [isPaused, isMuted]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
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
      <VideoControlContext.Provider value={videoValue}>
        <NavigationContext.Provider value={navigationValue}>
          {children}
        </NavigationContext.Provider>
      </VideoControlContext.Provider>
    </MotionContext.Provider>
  );
}

export default AppProviders;
