/**
 * Video Control Context
 * Manages video playback state and controls across the application
 */

import { createContext } from "react";

// -------------------- Video Control Context --------------------

interface VideoState {
  isPaused: boolean;
  isMuted: boolean;
  isManuallyPaused: boolean;
}

interface VideoActions {
  togglePlayback: () => void;
  toggleMute: () => void;
  setManualPause: (paused: boolean) => void;
  lastVideoTime: number;
  setLastVideoTime: (t: number) => void;
}

export interface VideoControlContextType extends VideoState, VideoActions {}

export const VideoControlContext =
  createContext<VideoControlContextType | null>(null);
