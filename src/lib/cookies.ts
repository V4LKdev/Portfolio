// Cookie utility for storing user preferences
// Simple functions to save and load video/audio preferences

/**
 * Set a cookie with expiration
 */
export const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
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
 * Delete a cookie
 */
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
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
