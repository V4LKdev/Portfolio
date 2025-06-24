import { useContext } from "react";
import { VideoControlContext } from "../components/VideoControlProvider";

export const useVideoControls = () => {
  const context = useContext(VideoControlContext);
  if (!context) {
    throw new Error(
      "useVideoControls must be used within VideoControlProvider",
    );
  }
  return context;
};
