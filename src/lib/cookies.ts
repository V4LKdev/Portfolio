// Cookie utility for storing user preferences
// Simple functions to save and load video/audio preferences
// 
// Security Note: HttpOnly flag is intentionally NOT used as these are client-side
// preference cookies that need to be readable by JavaScript for theme/video state.
// These cookies contain no sensitive data (only UI preferences like mute/pause state).

/**
 * Set a cookie with expiration and security settings
 */
export const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Detect if we're in a secure context (HTTPS or localhost)
  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  
  // Build cookie string with security flags
  let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  
  // Add Secure flag for HTTPS environments
  if (isSecure) {
    cookieString += ';Secure';
  }
  
  document.cookie = cookieString;
};

/**
 * Get a cookie value
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    let c = cookie;
    while (c.startsWith(" ")) c = c.substring(1);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
  }
  return null;
};

/**
 * Delete a cookie with proper security flags
 */
export const deleteCookie = (name: string) => {
  // Detect if we're in a secure context (HTTPS or localhost)
  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  
  // Build deletion cookie string with same security flags as setCookie
  let cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
  
  // Add Secure flag for HTTPS environments
  if (isSecure) {
    cookieString += ';Secure';
  }
  
  document.cookie = cookieString;
};

/**
 * Video preferences utilities
 */
export const VideoPreferences = {
  // Save video mute preference
  setMuted: (isMuted: boolean) => setCookie("video_muted", isMuted.toString()),

  // Get video mute preference
  getMuted: (): boolean => {
    const saved = getCookie("video_muted");
    return saved !== null ? saved === "true" : true; // Default to muted
  },

  // Save video pause preference
  setPaused: (isPaused: boolean) =>
    setCookie("video_paused", isPaused.toString()),

  // Get video pause preference
  getPaused: (): boolean => {
    const saved = getCookie("video_paused");
    return saved !== null ? saved === "true" : false; // Default to playing
  },
};
