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
    [videoEnabled, toggleVideo, isPausedByVisibility, isPausedByUI]
  );

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};

export default VideoProvider;
