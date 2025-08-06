import { createContext } from "react";

export interface MotionContextType {
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

export const MotionContext = createContext<MotionContextType | null>(null);
