/**
 * VideoProvider
 *
 * Centralized state for background video playback behavior.
 * Responsibilities:
 * - Persist the user preference (videoEnabled) to cookies.
 * - Track pause reasons: document visibility and UI-driven overlays.
 * - Expose a mutable ref (lastVideoTime) so the player can resume from where it left off.
 *
 * Design notes:
 * - We do not directly control the <video> element here. Instead, consumers (LocalVideoBackground)
 *   subscribe to this context and drive the DOM element accordingly. This keeps DOM concerns out of context.
 * - UI pause (setUIPause) allows temporary pausing (e.g., when a modal/overlay is open) without toggling
 *   the persisted user preference.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserPreferences } from "../lib/cookies";
import { VideoContext, type VideoContextValue } from "./VideoContext";

// Context defined in VideoContext.ts

const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoEnabled, setVideoEnabled] = useState(() => UserPreferences.getVideoEnabled());
  const [isPausedByVisibility, setIsPausedByVisibility] = useState(false);
  const [isPausedByUI, setIsPausedByUI] = useState(false);
  const lastVideoTime = useRef(0);
  // Keep track of current visibility state to avoid redundant updates
  const lastVisibilityRef = useRef(document.visibilityState);

  const toggleVideo = useCallback(() => {
    setVideoEnabled((prev) => {
      const next = !prev;
      UserPreferences.setVideoEnabled(next);
      return next;
    });
  }, []);

  // Pause/resume when tab visibility changes
  useEffect(() => {
    const onVisibility = () => {
      const state = document.visibilityState;
      if (lastVisibilityRef.current === state) return;
      lastVisibilityRef.current = state;
      setIsPausedByVisibility(state !== "visible");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const setUIPause = useCallback((shouldPause: boolean) => {
    setIsPausedByUI(shouldPause);
  }, []);

  const value = useMemo<VideoContextValue>(
    () => ({ videoEnabled, toggleVideo, isPausedByVisibility, isPausedByUI, setUIPause, lastVideoTime }),
    [videoEnabled, toggleVideo, isPausedByVisibility, isPausedByUI, setUIPause]
  );

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};

export default VideoProvider;
