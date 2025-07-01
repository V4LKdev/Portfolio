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
}

// Add setMuted to context type for onboarding overlay direct control
export interface VideoControlContextType extends VideoState, VideoActions {
  setMuted: (muted: boolean) => void;
}

export const VideoControlContext =
  createContext<VideoControlContextType | null>(null);
