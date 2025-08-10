/**
 * useSoundEffects.ts
 *
 * Hook for managing button sound effects with Web Audio API fallback
 * Integrates with global mute setting from VideoControlContext
 */

import { useCallback } from "react";
import { useVideoControls } from "./useVideoControls";
import { AUDIO_CONFIG } from "../config/audio";
import { audioEngine } from "../lib/audioEngine";

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

  // Get global mute and audio unlock state from video controls
  const { isMuted, audioUnlocked } = useVideoControls();

  // SFX enabled only when local enabled, global not muted, and audio is unlocked by a gesture/MEI
  const effectivelyEnabled = enabled && !isMuted && !!audioUnlocked;

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
        // Use centralized audio engine so we share a single AudioContext and master gain
        const ctx = audioEngine.getContext();
        const master = audioEngine.getMasterGain();

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(master);

        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        oscillator.type = waveform ?? AUDIO_CONFIG.WAVEFORM;

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          volume,
          ctx.currentTime + AUDIO_CONFIG.FADE_IN_DURATION,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          AUDIO_CONFIG.MIN_VOLUME,
          ctx.currentTime + duration,
        );

        if (typeof glideTo === "number" && glideTime && glideTime > 0) {
          oscillator.frequency.linearRampToValueAtTime(
            glideTo,
            ctx.currentTime + glideTime,
          );
        }

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch {
        // Silently ignore if AudioContext is unavailable or locked
      }
    },
    [effectivelyEnabled],
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
