/**
 * Test file to verify cookie integration
 * Run this to test that cookies are working properly
 * Delete this file after testing
 */

import { UserPreferences } from "../lib/cookies";

// Test function to verify cookie functionality
export const testCookieIntegration = () => {
  console.log("🧪 Testing Cookie Integration...");
  
  // Test 1: Check default values
  console.log("1. Default Values:");
  console.log("  - Video Autoplay:", UserPreferences.getVideoAutoplayEnabled()); // Should be true
  console.log("  - Global Audio Muted:", UserPreferences.getGlobalAudioMuted()); // Should be true (SFX OFF)
  console.log("  - Show Onboarding:", UserPreferences.getShowOnboarding()); // Should be true
  
  // Test 2: Set some values
  console.log("2. Setting new values...");
  UserPreferences.setVideoAutoplayEnabled(false);
  UserPreferences.setGlobalAudioMuted(false); // Enable SFX
  
  // Test 3: Read back the values
  console.log("3. Reading back values:");
  console.log("  - Video Autoplay:", UserPreferences.getVideoAutoplayEnabled()); // Should be false
  console.log("  - Global Audio Muted:", UserPreferences.getGlobalAudioMuted()); // Should be false (SFX ON)
  
  // Test 4: Reset to defaults
  console.log("4. Resetting to defaults...");
  UserPreferences.resetAllPreferencesToDefaults();
  
  console.log("5. After reset:");
  console.log("  - Video Autoplay:", UserPreferences.getVideoAutoplayEnabled()); // Should be true
  console.log("  - Global Audio Muted:", UserPreferences.getGlobalAudioMuted()); // Should be true (SFX OFF)
  console.log("  - Show Onboarding:", UserPreferences.getShowOnboarding()); // Should be true
  
  console.log("✅ Cookie integration test complete!");
};
