import React, { useCallback, useMemo, useState } from "react";
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

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export default AudioProvider;
