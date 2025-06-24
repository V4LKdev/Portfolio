/**
 * Video Controls Hook
 * 
 * Custom hook for accessing video playback state and controls throughout the application.
 * Must be used within a VideoControlProvider context.
 * 
 * @returns Video state and control actions
 * @throws Error if used outside VideoControlProvider
 * 
 * @example
 * ```tsx
 * const { isPaused, togglePlayback } = useVideoControls();
 * ```
 */
import { useContext } from "react";
import { VideoControlContext } from "../components/VideoControlProvider";

export const useVideoControls = () => {
  const context = useContext(VideoControlContext);
  
  if (!context) {
    throw new Error(
      "useVideoControls must be used within VideoControlProvider. " +
      "Make sure your component is wrapped with <VideoControlProvider>."
    );
  }
  
  return context;
};
