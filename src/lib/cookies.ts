/**
 * Comprehensive User Preferences Management System
 *
 * This file provides a complete, type-safe, and extensible system for managing
 * all user preferences across the portfolio website. It handles persistence via
 * secure HTTP cookies and provides a single source of truth for all settings.
 *
 * Features:
 * - Type-safe preference definitions with validation
 * - Secure cookie management with proper flags (SameSite, Secure)
 * - Extensible architecture for easy addition of new preferences
 * - Single source of truth with centralized getter/setter APIs
 * - Default value management with explicit fallbacks
 * - Comprehensive error handling and validation
 * - Developer-friendly debugging and logging
 *
 * Security Note: HttpOnly flag is intentionally NOT used as these are client-side
 * preference cookies that need JavaScript access for UI state management.
 * These cookies contain no sensitive data (only UI preferences like theme, volume, etc.).
 *
 * Usage Examples:
 * ```typescript
 * // Get a preference with automatic type safety and default fallback
 * const isAutoplayEnabled = UserPreferences.getVideoAutoplayEnabled();
 *
 * // Set a preference with automatic validation and persistence
 * UserPreferences.setGlobalAudioMuted(true);
 *
 * // Check if a preference has been explicitly set by the user
 * const hasUserSetTheme = UserPreferences.hasUserSetTheme();
 * ```
 */

// ============================================================================
// PREFERENCE TYPE DEFINITIONS
// ============================================================================

/**
 * Complete definition of all user preferences with their types and metadata
 * Add new preferences here to automatically get type safety and validation
 */
export interface UserPreferenceDefinitions {
  // ---- Video & Media Preferences ----

  /** Whether video background should autoplay when user visits/returns to home section */
  videoAutoplayEnabled: boolean;

  /** Global site-wide audio mute setting (affects video sound + UI sound effects) */
  globalAudioMuted: boolean;

  // ---- Audio & Sound Preferences ----

  /** Volume level for UI sound effects (0.0 to 1.0) */
  soundEffectVolume: number;

  /** Volume level for background music (0.0 to 1.0) */
  backgroundMusicVolume: number;

  /** Whether background music should play automatically */
  backgroundMusicEnabled: boolean;

  // ---- UI & UX Preferences ----

  /** Selected theme identifier (e.g., 'warm', 'cool', 'cyberpunk') */
  selectedTheme: string;

  /** Whether to show onboarding/tutorial on first visit */
  showOnboarding: boolean;

  /** Whether to reduce motion for accessibility */
  reduceMotionEnabled: boolean;
}

/**
 * Default values for all preferences
 * These are used when no user preference has been set or when resetting to defaults
 */
export const DEFAULT_PREFERENCES: UserPreferenceDefinitions = {
  // Video defaults: Conservative approach - don't autoplay, start muted
  videoAutoplayEnabled: false,
  globalAudioMuted: true,

  // Audio defaults: Medium volume levels, background music off by default
  soundEffectVolume: 0.3,
  backgroundMusicVolume: 0.2,
  backgroundMusicEnabled: false,

  // UI defaults: Use default theme, show onboarding for new users
  selectedTheme: "cool", // Default to cool theme as specified in themes.ts
  showOnboarding: true,

  // Accessibility defaults: Standard settings, respect user's system preferences
  reduceMotionEnabled: false, // Will be auto-detected from system preferences
};

/**
 * Cookie names for each preference
 * Using descriptive, namespaced names to avoid conflicts
 */
export const PREFERENCE_COOKIE_NAMES: Record<
  keyof UserPreferenceDefinitions,
  string
> = {
  videoAutoplayEnabled: "portfolio-video-autoplay",
  globalAudioMuted: "portfolio-audio-muted",
  soundEffectVolume: "portfolio-sound-volume",
  backgroundMusicVolume: "portfolio-music-volume",
  backgroundMusicEnabled: "portfolio-music-enabled",
  selectedTheme: "portfolio-theme",
  showOnboarding: "portfolio-show-onboarding",
  reduceMotionEnabled: "portfolio-reduce-motion",
};

// ============================================================================
// LOW-LEVEL COOKIE UTILITIES
// ============================================================================

/**
 * Set a cookie with comprehensive security settings and error handling
 *
 * @param name - Cookie name
 * @param value - Cookie value (will be URL encoded for safety)
 * @param days - Expiration in days (default: 1 year)
 */
export const setCookie = (
  name: string,
  value: string,
  days: number = 365,
): void => {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    // Detect if we're in a secure context (HTTPS or localhost development)
    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // URL encode the value to handle special characters safely
    const encodedValue = encodeURIComponent(value);

    // Build comprehensive cookie string with security flags
    let cookieString = `${name}=${encodedValue};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

    // Add Secure flag for HTTPS environments (required for production)
    if (isSecure) {
      cookieString += ";Secure";
    }

    document.cookie = cookieString;
  } catch (error) {
    console.warn(`Failed to set cookie "${name}":`, error);
  }
};

/**
 * Get a cookie value with proper decoding and error handling
 *
 * @param name - Cookie name to retrieve
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  try {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const c = cookie.trim(); // Use trim() instead of manual while loop
      if (c.startsWith(nameEQ)) {
        const encodedValue = c.substring(nameEQ.length);
        // URL decode the value to handle special characters
        return decodeURIComponent(encodedValue);
      }
    }
    return null;
  } catch (error) {
    console.warn(`Failed to get cookie "${name}":`, error);
    return null;
  }
};

/**
 * Delete a cookie with proper security flags matching setCookie behavior
 *
 * @param name - Cookie name to delete
 */
export const deleteCookie = (name: string): void => {
  try {
    // Detect secure context using same logic as setCookie
    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // Build deletion cookie string with same security flags as setCookie
    let cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;

    // Add Secure flag for HTTPS environments
    if (isSecure) {
      cookieString += ";Secure";
    }

    document.cookie = cookieString;
  } catch (error) {
    console.warn(`Failed to delete cookie "${name}":`, error);
  }
};

// ============================================================================
// PREFERENCE VALUE SERIALIZATION & VALIDATION
// ============================================================================

/**
 * Serialize a preference value to a string for cookie storage
 * Handles different data types appropriately
 */
const serializePreferenceValue = (value: unknown): string => {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "string") {
    return value;
  }
  // For complex types, use JSON serialization
  return JSON.stringify(value);
};

/**
 * Deserialize a preference value from a cookie string
 * Includes type validation and error handling
 */
const deserializePreferenceValue = <T>(
  cookieValue: string | null,
  expectedType: "boolean" | "number" | "string",
  defaultValue: T,
): T => {
  if (cookieValue === null) {
    return defaultValue;
  }

  try {
    switch (expectedType) {
      case "boolean":
        return (cookieValue === "true") as T;

      case "number": {
        const parsed = parseFloat(cookieValue);
        return (isNaN(parsed) ? defaultValue : parsed) as T;
      }

      case "string":
        return cookieValue as T;

      default:
        // Fallback to JSON parsing for complex types
        return JSON.parse(cookieValue) as T;
    }
  } catch (error) {
    console.warn(
      `Failed to deserialize preference value "${cookieValue}":`,
      error,
    );
    return defaultValue;
  }
};

// ============================================================================
// MAIN USER PREFERENCES API
// ============================================================================

/**
 * Comprehensive User Preferences Management System
 *
 * This object provides the single source of truth for all user preferences.
 * It includes type-safe getters and setters for each preference, with automatic
 * validation, persistence, and default value handling.
 *
 * Architecture:
 * - Each preference has a dedicated getter and setter method
 * - All methods include comprehensive JSDoc documentation
 * - Type safety is enforced through TypeScript interfaces
 * - Default values are clearly defined and consistently applied
 * - Error handling prevents crashes from malformed cookie data
 */
export const UserPreferences = {
  // ---- Video & Media Preferences ----

  /**
   * Get whether video should autoplay when user visits/returns to home section
   * @returns true if video should autoplay, false otherwise
   */
  getVideoAutoplayEnabled: (): boolean => {
    const cookieValue = getCookie(PREFERENCE_COOKIE_NAMES.videoAutoplayEnabled);
    return deserializePreferenceValue(
      cookieValue,
      "boolean",
      DEFAULT_PREFERENCES.videoAutoplayEnabled,
    );
  },

  /**
   * Set whether video should autoplay when user visits/returns to home section
   * @param enabled - true to enable autoplay, false to disable
   */
  setVideoAutoplayEnabled: (enabled: boolean): void => {
    setCookie(
      PREFERENCE_COOKIE_NAMES.videoAutoplayEnabled,
      serializePreferenceValue(enabled),
    );
  },

  /**
   * Get global site-wide audio mute setting (affects video sound + UI sound effects)
   * @returns true if audio is muted globally, false otherwise
   */
  getGlobalAudioMuted: (): boolean => {
    const cookieValue = getCookie(PREFERENCE_COOKIE_NAMES.globalAudioMuted);
    return deserializePreferenceValue(
      cookieValue,
      "boolean",
      DEFAULT_PREFERENCES.globalAudioMuted,
    );
  },

  /**
   * Set global site-wide audio mute setting (affects video sound + UI sound effects)
   * @param muted - true to mute all audio, false to unmute
   */
  setGlobalAudioMuted: (muted: boolean): void => {
    setCookie(
      PREFERENCE_COOKIE_NAMES.globalAudioMuted,
      serializePreferenceValue(muted),
    );
  },

  // ---- Audio & Sound Preferences ----

  /**
   * Get volume level for UI sound effects
   * @returns Volume level between 0.0 (silent) and 1.0 (full volume)
   */
  getSoundEffectVolume: (): number => {
    const cookieValue = getCookie(PREFERENCE_COOKIE_NAMES.soundEffectVolume);
    const volume = deserializePreferenceValue(
      cookieValue,
      "number",
      DEFAULT_PREFERENCES.soundEffectVolume,
    );
    // Clamp volume to valid range
    return Math.max(0.0, Math.min(1.0, volume));
  },

  /**
   * Set volume level for UI sound effects
   * @param volume - Volume level between 0.0 (silent) and 1.0 (full volume)
   */
  setSoundEffectVolume: (volume: number): void => {
    // Clamp volume to valid range before saving
    const clampedVolume = Math.max(0.0, Math.min(1.0, volume));
    setCookie(
      PREFERENCE_COOKIE_NAMES.soundEffectVolume,
      serializePreferenceValue(clampedVolume),
    );
  },

  /**
   * Get volume level for background music
   * @returns Volume level between 0.0 (silent) and 1.0 (full volume)
   */
  getBackgroundMusicVolume: (): number => {
    const cookieValue = getCookie(
      PREFERENCE_COOKIE_NAMES.backgroundMusicVolume,
    );
    const volume = deserializePreferenceValue(
      cookieValue,
      "number",
      DEFAULT_PREFERENCES.backgroundMusicVolume,
    );
    // Clamp volume to valid range
    return Math.max(0.0, Math.min(1.0, volume));
  },

  /**
   * Set volume level for background music
   * @param volume - Volume level between 0.0 (silent) and 1.0 (full volume)
   */
  setBackgroundMusicVolume: (volume: number): void => {
    // Clamp volume to valid range before saving
    const clampedVolume = Math.max(0.0, Math.min(1.0, volume));
    setCookie(
      PREFERENCE_COOKIE_NAMES.backgroundMusicVolume,
      serializePreferenceValue(clampedVolume),
    );
  },

  /**
   * Get whether background music should play automatically
   * @returns true if background music is enabled, false otherwise
   */
  getBackgroundMusicEnabled: (): boolean => {
    const cookieValue = getCookie(
      PREFERENCE_COOKIE_NAMES.backgroundMusicEnabled,
    );
    return deserializePreferenceValue(
      cookieValue,
      "boolean",
      DEFAULT_PREFERENCES.backgroundMusicEnabled,
    );
  },

  /**
   * Set whether background music should play automatically
   * @param enabled - true to enable background music, false to disable
   */
  setBackgroundMusicEnabled: (enabled: boolean): void => {
    setCookie(
      PREFERENCE_COOKIE_NAMES.backgroundMusicEnabled,
      serializePreferenceValue(enabled),
    );
  },

  // ---- UI & UX Preferences ----

  /**
   * Get the selected theme identifier
   * @returns Theme ID (e.g., 'warm', 'cool', 'cyberpunk')
   */
  getSelectedTheme: (): string => {
    const cookieValue = getCookie(PREFERENCE_COOKIE_NAMES.selectedTheme);
    return deserializePreferenceValue(
      cookieValue,
      "string",
      DEFAULT_PREFERENCES.selectedTheme,
    );
  },

  /**
   * Set the selected theme identifier
   * @param themeId - Theme ID (e.g., 'warm', 'cool', 'cyberpunk')
   */
  setSelectedTheme: (themeId: string): void => {
    setCookie(
      PREFERENCE_COOKIE_NAMES.selectedTheme,
      serializePreferenceValue(themeId),
    );
  },

  /**
   * Get whether to show onboarding/tutorial on first visit
   * @returns true if onboarding should be shown, false otherwise
   */
  getShowOnboarding: (): boolean => {
    const cookieValue = getCookie(PREFERENCE_COOKIE_NAMES.showOnboarding);
    return deserializePreferenceValue(
      cookieValue,
      "boolean",
      DEFAULT_PREFERENCES.showOnboarding,
    );
  },

  /**
   * Set whether to show onboarding/tutorial on first visit
   * @param show - true to show onboarding, false to hide
   */
  setShowOnboarding: (show: boolean): void => {
    setCookie(
      PREFERENCE_COOKIE_NAMES.showOnboarding,
      serializePreferenceValue(show),
    );
  },

  // ---- Accessibility Preferences ----

  /**
   * Get whether reduced motion is enabled for accessibility
   * @returns true if motion should be reduced, false otherwise
   */
  getReduceMotionEnabled: (): boolean => {
    const cookieValue = getCookie(PREFERENCE_COOKIE_NAMES.reduceMotionEnabled);
    return deserializePreferenceValue(
      cookieValue,
      "boolean",
      DEFAULT_PREFERENCES.reduceMotionEnabled,
    );
  },

  /**
   * Set whether reduced motion is enabled for accessibility
   * @param enabled - true to reduce motion, false for normal motion
   */
  setReduceMotionEnabled: (enabled: boolean): void => {
    setCookie(
      PREFERENCE_COOKIE_NAMES.reduceMotionEnabled,
      serializePreferenceValue(enabled),
    );
  },

  // ---- Utility Methods ----

  /**
   * Check if a specific preference has been explicitly set by the user
   * @param preferenceKey - The preference to check
   * @returns true if user has set this preference, false if using default
   */
  hasUserSetPreference: <K extends keyof UserPreferenceDefinitions>(
    preferenceKey: K,
  ): boolean => {
    const cookieName = PREFERENCE_COOKIE_NAMES[preferenceKey];
    return getCookie(cookieName) !== null;
  },

  /**
   * Reset a specific preference to its default value
   * @param preferenceKey - The preference to reset
   */
  resetPreferenceToDefault: <K extends keyof UserPreferenceDefinitions>(
    preferenceKey: K,
  ): void => {
    const cookieName = PREFERENCE_COOKIE_NAMES[preferenceKey];
    deleteCookie(cookieName);
  },

  /**
   * Reset all preferences to their default values
   * Useful for "factory reset" functionality
   */
  resetAllPreferencesToDefaults: (): void => {
    Object.values(PREFERENCE_COOKIE_NAMES).forEach((cookieName) => {
      deleteCookie(cookieName);
    });
  },

  /**
   * Get all current preference values (useful for debugging or export)
   * @returns Object containing all current preference values
   */
  getAllPreferences: (): UserPreferenceDefinitions => {
    return {
      videoAutoplayEnabled: UserPreferences.getVideoAutoplayEnabled(),
      globalAudioMuted: UserPreferences.getGlobalAudioMuted(),
      soundEffectVolume: UserPreferences.getSoundEffectVolume(),
      backgroundMusicVolume: UserPreferences.getBackgroundMusicVolume(),
      backgroundMusicEnabled: UserPreferences.getBackgroundMusicEnabled(),
      selectedTheme: UserPreferences.getSelectedTheme(),
      showOnboarding: UserPreferences.getShowOnboarding(),
      reduceMotionEnabled: UserPreferences.getReduceMotionEnabled(),
    };
  },
} as const;

// ============================================================================
// LEGACY COMPATIBILITY LAYER (DEPRECATED)
// ============================================================================

/**
 * @deprecated Use UserPreferences.getVideoAutoplayEnabled() and UserPreferences.getGlobalAudioMuted() instead
 *
 * Legacy VideoPreferences object for backward compatibility
 * This will be removed in a future version - migrate to UserPreferences API
 */
export const VideoPreferences = {
  /** @deprecated Use UserPreferences.setGlobalAudioMuted() instead */
  setMuted: (isMuted: boolean): void => {
    console.warn(
      "VideoPreferences.setMuted is deprecated. Use UserPreferences.setGlobalAudioMuted() instead.",
    );
    UserPreferences.setGlobalAudioMuted(isMuted);
  },

  /** @deprecated Use UserPreferences.getGlobalAudioMuted() instead */
  getMuted: (): boolean => {
    console.warn(
      "VideoPreferences.getMuted is deprecated. Use UserPreferences.getGlobalAudioMuted() instead.",
    );
    return UserPreferences.getGlobalAudioMuted();
  },

  /** @deprecated Use UserPreferences.setVideoAutoplayEnabled() instead */
  setPaused: (isPaused: boolean): void => {
    console.warn(
      "VideoPreferences.setPaused is deprecated. Use UserPreferences.setVideoAutoplayEnabled() instead.",
    );
    // Note: isPaused is inverse of autoplay enabled
    UserPreferences.setVideoAutoplayEnabled(!isPaused);
  },

  /** @deprecated Use UserPreferences.getVideoAutoplayEnabled() instead */
  getPaused: (): boolean => {
    console.warn(
      "VideoPreferences.getPaused is deprecated. Use UserPreferences.getVideoAutoplayEnabled() instead.",
    );
    // Note: isPaused is inverse of autoplay enabled
    return !UserPreferences.getVideoAutoplayEnabled();
  },
} as const;
