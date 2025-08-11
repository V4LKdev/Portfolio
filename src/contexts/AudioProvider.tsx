import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AudioContext, type AudioContextValue } from "./AudioContext";
import { UserPreferences } from "../lib/cookies";
import { audioEngine } from "../lib/audioEngine";

const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sfxEnabled, setSfxEnabled] = useState(() => UserPreferences.getSfxEnabled());
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const toggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev;
      UserPreferences.setSfxEnabled(next);
      return next;
    });
  }, []);

  const unlockAudio = useCallback(async () => {
    try {
      await audioEngine.unlock();
      setAudioUnlocked(true);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AudioContextValue>(
    () => ({ sfxEnabled, audioUnlocked, toggleSfx, unlockAudio }),
    [sfxEnabled, audioUnlocked, toggleSfx, unlockAudio]
  );

  // Unlock audio on the first genuine user interaction if SFX is enabled
  useEffect(() => {
    if (!sfxEnabled || audioUnlocked) return;

    let removed = false;

    const tryUnlock = () => {
      if (removed) return;
      if (!sfxEnabled || audioUnlocked) return;
      void unlockAudio();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // ignore pure modifier keys
      const mods = ["Meta", "Control", "Alt", "Shift"]; 
      if (mods.includes(e.key)) return;
      tryUnlock();
    };

    window.addEventListener("pointerdown", tryUnlock, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      removed = true;
      window.removeEventListener("pointerdown", tryUnlock as EventListener);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sfxEnabled, audioUnlocked, unlockAudio]);

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export default AudioProvider;
