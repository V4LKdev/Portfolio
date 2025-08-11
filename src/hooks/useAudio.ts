/**
 * useAudio
 *
 * Thin hook to access AudioContext (SFX preference and unlock state).
 * Prefer this over importing the context directly.
 */
import { useAudioContext } from "../contexts/AudioContext";

export const useAudio = () => useAudioContext();
