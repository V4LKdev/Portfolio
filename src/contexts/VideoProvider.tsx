import React from "react";
import { VideoControlContext } from "./VideoControlContext";
import { useVideoControls } from "../hooks/useVideoControls";

interface VideoProviderProps {
  readonly children: React.ReactNode;
}

/**
 * VideoProvider
 * Provides global video control state and actions to the app.
 * Handles video playback, mute, manual pause, and persistence via cookies.
 */
export function VideoProvider({ children }: VideoProviderProps) {
  const videoValue = useVideoControls();

  return (
    <VideoControlContext.Provider value={videoValue}>
      {children}
    </VideoControlContext.Provider>
  );
}

export default VideoProvider;
