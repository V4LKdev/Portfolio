/**
 * VideoControlContext.tsx
 *
 * Context for managing the video playback state of the application.
 */

import { createContext } from "react";

interface VideoState {
  isPaused: boolean;
  isMuted: boolean;
  isManuallyPaused: boolean;
  audioUnlocked?: boolean;
}

interface VideoActions {
  togglePlayback: () => void;
  toggleMute: () => void;
  setManualPause: (paused: boolean) => void;
  unlockAudio?: () => void;
  lastVideoTime: number;
  setLastVideoTime: (t: number) => void;
}

export interface VideoControlContextType extends VideoState, VideoActions {}

export const VideoControlContext =
  createContext<VideoControlContextType | null>(null);
