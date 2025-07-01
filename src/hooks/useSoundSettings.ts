/**
 * useSoundSettings.ts
 *
 * Hook for managing sound preferences with cookie persistence
 * Provides a single source of truth for sound settings across the application
 */

import { useState, useCallback } from "react";
import { SoundPreferences } from "../lib/cookies";

interface UseSoundSettingsReturn {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
}

export function useSoundSettings(): UseSoundSettingsReturn {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return SoundPreferences.getEnabled();
  });

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    SoundPreferences.setEnabled(enabled);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled, setSoundEnabled]);

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
  };
}
