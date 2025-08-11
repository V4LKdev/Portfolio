import React, { createContext, useContext } from "react";

export type VideoContextValue = {
  videoEnabled: boolean;
  toggleVideo: () => void;
  isPausedByVisibility: boolean;
  // New: temporary UI-driven pause flag (does not alter user preference)
  isPausedByUI: boolean;
  setUIPause: (shouldPause: boolean) => void;
  lastVideoTime: React.MutableRefObject<number>;
};

export const VideoContext = createContext<VideoContextValue | null>(null);

export const useVideoContext = (): VideoContextValue => {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideo must be used within <VideoProvider>");
  return ctx;
};
