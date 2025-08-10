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
import { audioEngine } from "../../lib/audioEngine";

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

  // Sync preference changes after onboarding completes and on window focus/visibility
  useEffect(() => {
    const syncFromCookies = () => {
      const autoplayEnabled = UserPreferences.getVideoAutoplayEnabled();
      const muted = UserPreferences.getGlobalAudioMuted();
      setIsPaused(!autoplayEnabled);
      setIsManuallyPaused(!autoplayEnabled);
      setIsMuted(muted);
    };

    const handleOnboardingComplete = () => {
      // Apply cookie values immediately
      syncFromCookies();
      // If user enabled SFX during onboarding, unlock audio right away
      try {
        const muted = UserPreferences.getGlobalAudioMuted();
        if (!muted) {
          unlockAudio();
        }
      } catch {
        // ignore
      }
    };

    const handleFocus = () => syncFromCookies();
    const handleVisibility = () => {
      if (!document.hidden) syncFromCookies();
    };

    window.addEventListener("onboardingComplete", handleOnboardingComplete);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener(
        "onboardingComplete",
        handleOnboardingComplete,
      );
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
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

  // Audio unlock state: true once AudioContext has been successfully resumed (via MEI or user gesture)
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);

  // Attempt to unlock audio (resume AudioContext) and fade in the master gain
  const unlockAudio = useCallback(async () => {
    try {
      await audioEngine.unlock(800);
      setAudioUnlocked(true);
    } catch {
      // Ignore; remains locked until a valid gesture
    }
  }, []);

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

    // Always keep video muted until audio is unlocked to avoid autoplay errors
    const shouldBeMuted = isMuted || !audioUnlocked;
  const targetVolume = 0.3; // desired background video volume when unmuted

    // If transitioning from muted to unmuted, apply a small volume ramp to target
    const applyVolumeRamp = () => {
      try {
        const start = performance.now();
        const durationMs = 600;
        const to = targetVolume;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          video.volume = to * t;
          if (t < 1) requestAnimationFrame(step);
        };
        // Always start from 0 to avoid blast
        video.volume = 0;
        requestAnimationFrame(step);
      } catch {
        // Non-fatal
      }
    };

    const wasMuted = video.muted;
    video.muted = shouldBeMuted;
    if (!shouldBeMuted && wasMuted) {
  // Ensure starting at 0 before ramp
  video.volume = 0;
      applyVolumeRamp();
    }

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
  }, [isPaused, isMuted, audioUnlocked]);

  // Keep AudioEngine master gain in sync with global mute and unlock state
  useEffect(() => {
    // If globally muted or still locked, keep master at 0; otherwise at 0.3
    const desired = !isMuted && audioUnlocked ? 0.3 : 0;
    try {
      audioEngine.setMasterVolume(desired);
    } catch {
      // Ignore if engine not available yet
    }
  }, [isMuted, audioUnlocked]);

  // Optimistic MEI-based unlock attempt on mount if preference is unmuted
  useEffect(() => {
    if (!isMuted) {
      // Try once; browsers that disallow will keep context suspended without throwing
      unlockAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  audioUnlocked,
      togglePlayback,
      toggleMute,
      setManualPause,
  unlockAudio,
      lastVideoTime: lastVideoTimeRef.current,
      setLastVideoTime: (t: number) => {
        lastVideoTimeRef.current = t;
      },
    }),
    [
      isPaused,
      isMuted,
      isManuallyPaused,
  audioUnlocked,
      togglePlayback,
      toggleMute,
      setManualPause,
  unlockAudio,
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
