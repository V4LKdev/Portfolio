/**
 * useSoundEffects.ts
 *
 * Thin wrapper for SFX triggers. Currently a no-op; kept for future re-introduction of SFX.
 */

interface UseSoundEffectsReturn {
  playHover: () => void;
  playUnhover: () => void;
  playClick: () => void;
  playFeedback: (name?: string) => void;
  isEnabled: boolean;
}

export function useSoundEffects(
  _opts?: {
    category?: string;
  }
): UseSoundEffectsReturn {
  const noop = () => {};
  return {
    playHover: noop,
    playUnhover: noop,
    playClick: noop,
    playFeedback: noop,
    isEnabled: false,
  };
}
