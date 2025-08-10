/**
 * Audio Configuration Constants
 *
 * Centralized audio settings for UI sound effects.
 * All frequencies in Hz, durations in seconds, volumes normalized 0-1.
 */

export const AUDIO_CONFIG = {
  // Navigation hover sounds
  HOVER: {
  frequency: 920,
  duration: 0.08,
  volume: 0.032,
    waveform: "sine" as OscillatorType,
  },

  UNHOVER: {
  frequency: 780,
  duration: 0.065,
  volume: 0.024,
    waveform: "sine" as OscillatorType,
  },

  // Click interactions
  CLICK: {
    primary: {
      frequency: 660, // lower, softer attack
      duration: 0.05,
      volume: 0.07,
      waveform: "triangle" as OscillatorType,
    },
    secondary: {
      frequency: 880, // slight ascend for confirm feel
      duration: 0.05,
      volume: 0.06,
      delay: 40,
      waveform: "triangle" as OscillatorType,
    },
    glide: 0.012, // seconds to glide between click tones
  },

  // Feedback sounds
  FEEDBACK: {
    primary: {
      frequency: 660,
      duration: 0.085,
      volume: 0.075,
      waveform: "sine" as OscillatorType,
    },
    secondary: {
      frequency: 990,
      duration: 0.08,
      volume: 0.05,
      delay: 70,
      waveform: "sine" as OscillatorType,
    },
  },

  // Oscillator settings
  WAVEFORM: "sine" as OscillatorType,
  FADE_IN_DURATION: 0.008,
  MIN_VOLUME: 0.0007,
} as const;
