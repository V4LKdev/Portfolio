/**
 * Animation Configuration Constants
 *
 * Centralized timing and easing values for consistent animations throughout the application.
 * All durations are in seconds, delays in milliseconds.
 */

export const ANIMATION_CONFIG = {
  // Navigation text animations
  FEEDBACK_DELAY: 100,
  INSTANT_REVEAL_DURATION: 0.16,
  FADE_DURATION: 0.15,
  MORPH_CHAR_OPACITY_DURATION: 0.06,
  CHAR_DELAY_MULTIPLIER: 0.025,

  // Button interactions
  SCALE_SPRING_STIFFNESS: 700,
  SCALE_SPRING_DAMPING: 20,
  BUTTON_SCALE_FACTOR: 1.08,

  // Hover effects
  UNDERLINE_DURATION: 0.15,
  FILL_EFFECT_DURATION: 0.2,
  COLOR_TRANSITION_DURATION: 0.1,

  // Icon animations
  ICON_ROTATION_DURATION: 0.5,
  ICON_SCALE_DURATION: 0.5,

  // Easing curves
  EASE_OUT: "easeOut",
  EASE_IN_OUT: "easeInOut",
  LINEAR: "linear",
} as const;

export type AnimationEasing =
  | typeof ANIMATION_CONFIG.EASE_OUT
  | typeof ANIMATION_CONFIG.EASE_IN_OUT
  | typeof ANIMATION_CONFIG.LINEAR;
