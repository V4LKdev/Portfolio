/**
 * useSoundEffects.ts
 *
 * Hook for managing button sound effects with Web Audio API fallback
 * Integrates with global mute setting from VideoControlContext
 */

import { useCallback } from "react";

interface SoundEffectsConfig {
  enabled?: boolean; // Local override, respects global mute when true
}

interface UseSoundEffectsReturn {
  playHover: () => void;
  playUnhover: () => void;
  playClick: () => void;
  playFeedback: () => void;
  isEnabled: boolean;
}

export function useSoundEffects(
  _config: SoundEffectsConfig = {},
): UseSoundEffectsReturn {
  // Purged SFX implementation: return no-ops for now
  const noop = useCallback(() => {}, []);
  return {
    playHover: noop,
    playUnhover: noop,
    playClick: noop,
    playFeedback: noop,
    isEnabled: false,
  };
}
