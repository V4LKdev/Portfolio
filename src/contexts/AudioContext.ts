import { createContext, useContext } from "react";

export type AudioContextValue = {
  sfxEnabled: boolean;
  audioUnlocked: boolean;
  toggleSfx: () => void;
  unlockAudio: () => Promise<void>;
};

export const AudioContext = createContext<AudioContextValue | null>(null);

export const useAudioContext = (): AudioContextValue => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within <AudioProvider>");
  return ctx;
};
