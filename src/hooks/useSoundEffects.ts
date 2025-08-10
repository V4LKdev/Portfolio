/**
 * useSoundEffects.ts
 *
 * Hook for managing button sound effects with Web Audio API fallback
 * Integrates with global mute setting from VideoControlContext
 */

import { useCallback, useRef } from "react";
import { useVideoControls } from "./useVideoControls";
import { AUDIO_CONFIG } from "../config/audio";

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
  config: SoundEffectsConfig = {},
): UseSoundEffectsReturn {
  const {
    enabled = true, // Enable by default, but respect global mute
  } = config;

  // Get global mute state from video controls
  const { isMuted } = useVideoControls();

  // Sound effects are enabled when both local enabled is true AND global audio is not muted
  const effectivelyEnabled = enabled && !isMuted;

  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    audioContextRef.current ??= new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (
      frequency: number,
      duration: number,
      volume: number = 0.1,
      waveform?: OscillatorType,
      glideTo?: number,
      glideTime?: number,
    ) => {
      if (!effectivelyEnabled) return;

      try {
        const audioContext = getAudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime,
        );
        oscillator.type = waveform ?? AUDIO_CONFIG.WAVEFORM;

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume,
          audioContext.currentTime + AUDIO_CONFIG.FADE_IN_DURATION,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          AUDIO_CONFIG.MIN_VOLUME,
          audioContext.currentTime + duration,
        );

        if (typeof glideTo === "number" && glideTime && glideTime > 0) {
          oscillator.frequency.linearRampToValueAtTime(
            glideTo,
            audioContext.currentTime + glideTime,
          );
        }

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch {
        // Audio context may not be available in some browsers
      }
    },
    [effectivelyEnabled, getAudioContext],
  );

  const playHover = useCallback(() => {
    const { frequency, duration, volume, waveform } = AUDIO_CONFIG.HOVER as any;
    playTone(frequency, duration, volume, waveform);
  }, [playTone]);

  const playUnhover = useCallback(() => {
    const { frequency, duration, volume, waveform } = AUDIO_CONFIG.UNHOVER as any;
    playTone(frequency, duration, volume, waveform);
  }, [playTone]);

  const playClick = useCallback(() => {
    const { primary, secondary, glide } = AUDIO_CONFIG.CLICK as any;
    // Start with primary, glide toward secondary for polish
    playTone(
      primary.frequency,
      primary.duration,
      primary.volume,
      primary.waveform,
      secondary.frequency,
      glide,
    );
    setTimeout(() => {
      playTone(
        secondary.frequency,
        secondary.duration,
        secondary.volume,
        secondary.waveform,
      );
    }, secondary.delay);
  }, [playTone]);

  const playFeedback = useCallback(() => {
    const { primary, secondary } = AUDIO_CONFIG.FEEDBACK as any;
    playTone(primary.frequency, primary.duration, primary.volume, primary.waveform);
    setTimeout(() => {
      playTone(secondary.frequency, secondary.duration, secondary.volume, secondary.waveform);
    }, secondary.delay);
  }, [playTone]);

  return {
    playHover,
    playUnhover,
    playClick,
    playFeedback,
    isEnabled: effectivelyEnabled,
  };
}
