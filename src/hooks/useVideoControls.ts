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
