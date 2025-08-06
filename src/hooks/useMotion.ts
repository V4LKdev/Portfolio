import { useContext } from "react";
import { MotionContext } from "../contexts/MotionContext";

export const useMotion = () => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error(
      "useMotion must be used within AppProviders. " +
        "Make sure your component is wrapped with <AppProviders>.",
    );
  }
  return context;
}
