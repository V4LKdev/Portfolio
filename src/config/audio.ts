/**
 * Audio Configuration Constants
 *
 * Centralized audio settings for UI sound effects.
 * All frequencies in Hz, durations in seconds, volumes normalized 0-1.
 */

export const AUDIO_CONFIG = {
  // Navigation hover sounds
  HOVER: {
    frequency: 800,
    duration: 0.1,
    volume: 0.05,
  },

  UNHOVER: {
    frequency: 600,
    duration: 0.08,
    volume: 0.03,
  },

  // Click interactions
  CLICK: {
    primary: {
      frequency: 1000,
      duration: 0.05,
      volume: 0.08,
    },
    secondary: {
      frequency: 750,
      duration: 0.05,
      volume: 0.06,
      delay: 50,
    },
  },

  // Feedback sounds
  FEEDBACK: {
    primary: {
      frequency: 1200,
      duration: 0.1,
      volume: 0.07,
    },
    secondary: {
      frequency: 1600,
      duration: 0.1,
      volume: 0.05,
      delay: 100,
    },
  },

  // Oscillator settings
  WAVEFORM: "sine" as OscillatorType,
  FADE_IN_DURATION: 0.01,
  MIN_VOLUME: 0.001,
} as const;
