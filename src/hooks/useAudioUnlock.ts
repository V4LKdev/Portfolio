import { useEffect } from "react";
import { useVideoControls } from "./useVideoControls";

export function useAudioUnlock() {
  const { audioUnlocked, unlockAudio } = useVideoControls();

  useEffect(() => {
    if (audioUnlocked) return;
    const handler = () => unlockAudio?.();
    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("pointerdown", handler, opts);
    window.addEventListener("keydown", handler, opts);
    return () => {
      window.removeEventListener("pointerdown", handler, opts as any);
      window.removeEventListener("keydown", handler, opts as any);
    };
  }, [audioUnlocked, unlockAudio]);
}
