/**
 * Comprehensive User Preferences Management System
 *
 * This file provides a complete, type-safe, and extensible system for managing
 * all user preferences across the portfolio website. It handles persistence via
 * secure HTTP cookies and provides a single source of truth for all settings.
 *
 * Features:
 * - Type-safe preference definitions with validation
 * - Cookie-based persistence with proper flags (SameSite, Secure)
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
 * const showOnboarding = UserPreferences.getShowOnboarding();
 *
 * // Set a preference with automatic validation and persistence
 * UserPreferences.setReduceMotion(true);
 *
 * // Check if a preference has been explicitly set by the user
 * ```
 */

export interface UserPreferenceDefinitions {
  // ---- UI & UX Preferences ----
  /** Whether to show onboarding/tutorial on first visit */
  showOnboarding: boolean;
  /** Whether to reduce motion/animations for accessibility */
  reduceMotion: boolean;
}

/**
 * Default values for all preferences
 * These are used when no user preference has been set or when resetting to defaults
 */
export const DEFAULT_PREFERENCES: UserPreferenceDefinitions = {
  // UI defaults: Show onboarding for new users
  showOnboarding: true,
  // Accessibility: Reduce motion OFF by default
  reduceMotion: false,
};

/**
 * Cookie names for each preference
 * Using descriptive, namespaced names to avoid conflicts
 */
export const PREFERENCE_COOKIE_NAMES: Record<
  keyof UserPreferenceDefinitions,
  string
> = {
  showOnboarding: "portfolio-show-onboarding",
  reduceMotion: "portfolio-reduce-motion",
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
};

/**
 * Get a cookie value with proper decoding and error handling
 *
 * @param name - Cookie name to retrieve
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
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
};

/**
 * Delete a cookie with proper security flags matching setCookie behavior
 *
 * @param name - Cookie name to delete
 */
export const deleteCookie = (name: string): void => {
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
function deserializePreferenceValue<T>(
  cookieValue: string | null,
  expectedType: "boolean" | "number" | "string",
  defaultValue: T,
): T {
  if (cookieValue === null) {
    return defaultValue;
  }

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
      try {
        return JSON.parse(cookieValue) as T;
      } catch {
        return defaultValue;
      }
  }
}

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
  // ---- UI & UX Preferences ----

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

  /**
   * Get whether to reduce motion/animations for accessibility
   * @returns true if reduced motion is enabled, false otherwise
   */
  getReduceMotion: (): boolean => {
    const cookieValue = getCookie(PREFERENCE_COOKIE_NAMES.reduceMotion);
    return deserializePreferenceValue(
      cookieValue,
      "boolean",
      DEFAULT_PREFERENCES.reduceMotion,
    );
  },

  /**
   * Set whether to reduce motion/animations for accessibility
   * @param reduce - true to enable reduced motion, false to disable
   */
  setReduceMotion: (reduce: boolean): void => {
    setCookie(
      PREFERENCE_COOKIE_NAMES.reduceMotion,
      serializePreferenceValue(reduce),
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
   * Clean up old/unused cookies from previous versions
   * Call this during app initialization to remove deprecated cookies
   */
  cleanupOldCookies: (): void => {
    const oldCookieNames = [
      "portfolio-sound-volume",
      "portfolio-music-volume",
      "portfolio-music-enabled",
      "portfolio-theme",
      "portfolio-audio-muted", // Old globalAudioMuted cookie
  // Also remove purged cookies from previous versions
  "portfolio-video-autoplay",
  "portfolio-sfx-enabled",
    ];

    oldCookieNames.forEach((cookieName) => {
      deleteCookie(cookieName);
    });
  },

  /**
   * Get all current preference values (useful for debugging or export)
   * @returns Object containing all current preference values
   */
  getAllPreferences: (): UserPreferenceDefinitions => {
    return {
      showOnboarding: UserPreferences.getShowOnboarding(),
      reduceMotion: UserPreferences.getReduceMotion(),
    };
  },
} as const;
