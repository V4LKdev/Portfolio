/**
 * Video Controls Hook
 *
 * Custom hook for accessing video playback state and controls throughout the application.
 * Must be used within AppProviders context.
 *
 * @returns Video state and control actions
 * @throws Error if used outside AppProviders
 *
 * @example
 * ```tsx
 * const { isPaused, togglePlayback } = useVideoControls();
 * ```
 */
import { useContext } from "react";
import { VideoControlContext } from "../contexts/VideoControlContext";

export const useVideoControls = () => {
  const context = useContext(VideoControlContext);

  if (!context) {
    throw new Error(
      "useVideoControls must be used within AppProviders. " +
        "Make sure your component is wrapped with <AppProviders>.",
    );
  }

  return context;
};
