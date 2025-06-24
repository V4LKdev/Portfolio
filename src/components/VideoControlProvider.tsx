// VideoControlProvider.tsx
// Professional video state management with cookie persistence
// Separates video logic from main Portfolio component for better maintainability

import * as React from "react";
import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { VideoPreferences } from "../lib/cookies";

interface VideoState {
  isPaused: boolean;
  isMuted: boolean;
  isManuallyPaused: boolean;
}

interface VideoActions {
  togglePlayback: () => void;
  toggleMute: () => void;
  setManualPause: (paused: boolean) => void;
}

interface VideoControlContextType extends VideoState, VideoActions {}

export const VideoControlContext =
  createContext<VideoControlContextType | null>(null);

interface VideoControlProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Provides centralized video control state management
 * Features:
 * - Cookie-based preference persistence
 * - Manual pause tracking
 * - Media session integration
 * - Tab visibility handling
 */
export function VideoControlProvider({ children }: VideoControlProviderProps) {
  // --- Video State from Cookies ---
  const [isPaused, setIsPaused] = useState(() => VideoPreferences.getPaused());
  const [isMuted, setIsMuted] = useState(() => VideoPreferences.getMuted());
  const [isManuallyPaused, setIsManuallyPaused] = useState(() =>
    VideoPreferences.getPaused(),
  );

  // --- Video Control Actions ---
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
    setIsManuallyPaused(paused);
    VideoPreferences.setPaused(paused);
  }, []);

  // --- Media Session Integration ---
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

  // --- Keyboard Controls ---
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

  // --- Video Element Sync ---
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
  }, [isPaused, isMuted]);

  // --- Tab Visibility Resume Logic ---
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
  const value: VideoControlContextType = useMemo(
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

  return (
    <VideoControlContext.Provider value={value}>
      {children}
    </VideoControlContext.Provider>
  );
}
