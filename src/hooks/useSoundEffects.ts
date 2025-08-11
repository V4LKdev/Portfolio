/**
 * useSoundEffects
 *
 * Convenience hook exposing pre-named SFX triggers for UI events.
 * It respects the user's SFX preference and the unlock state, and avoids producing
 * any audio until both conditions are met. Internally delegates to audioEngine.
 */
import { useMemo } from "react";
import { audioEngine } from "../lib/audioEngine";
import { useAudio } from "./useAudio";

interface UseSoundEffectsReturn {
  playHover: () => void;
  playUnhover: () => void;
  playClick: () => void;
  playFeedback: (name?: "minor" | "major") => void;
  isEnabled: boolean;
  isUnlocked: boolean;
}

export function useSoundEffects(): UseSoundEffectsReturn {
  const { sfxEnabled, audioUnlocked } = useAudio();


  const api = useMemo<UseSoundEffectsReturn>(() => {
    const play = (name: Parameters<typeof audioEngine.play>[0]) => {
      if (sfxEnabled && audioUnlocked) {
        audioEngine.play(name);
      }
    };
    return {
      playHover: () => play("hover"),
      playUnhover: () => play("unhover"),
      playClick: () => play("click"),
      playFeedback: (name?: "minor" | "major") => play(name === "major" ? "major" : "minor"),
      isEnabled: sfxEnabled,
      isUnlocked: audioUnlocked,
    };
  }, [sfxEnabled, audioUnlocked]);

  return api;
}
