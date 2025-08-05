# User Preferences Management System

## Overview

The portfolio website includes a comprehensive, type-safe, and extensible user preferences management system. This provides a single source of truth for all user settings with secure cookie persistence and proper validation.

## User Preferences Features

- **Type-Safe Preferences**: All preferences are defined with TypeScript interfaces
- **Extensible Architecture**: Easy to add new preferences without breaking existing code
- **Secure Cookie Management**: Proper security flags with URL encoding
- **Default Value Management**: Explicit defaults with automatic fallbacks
- **Single Source of Truth**: Centralized preference management
- **Automatic Cleanup**: Old/deprecated cookies are automatically removed

## Available Preferences

### Video & Media Settings

- **Video Autoplay**: Whether background videos should autoplay when entering sections
- **Global Audio Mute**: Site-wide audio control affecting video sound and UI sound effects

### UI & UX Settings

- **Show Onboarding**: Whether to display onboarding/tutorial screens for new users

## Design Approach

The system uses a moonlight theme with blue accents as the fixed visual design. All color values are centralized in CSS variables for easy maintenance and consistency.

## Architecture

### Type Definitions

All preferences are defined in `src/lib/cookies.ts` with the `UserPreferenceDefinitions` interface:

```typescript
export interface UserPreferenceDefinitions {
  videoAutoplayEnabled: boolean;
  globalAudioMuted: boolean;
  showOnboarding: boolean;
}
```

### Cookie Management

Each preference has a corresponding cookie name defined in `PREFERENCE_COOKIE_NAMES`:

```typescript
export const PREFERENCE_COOKIE_NAMES = {
  videoAutoplayEnabled: "portfolio-video-autoplay",
  globalAudioMuted: "portfolio-audio-muted",  
  showOnboarding: "portfolio-show-onboarding",
};
```

### API Usage

The `UserPreferences` object provides a clean API for getting and setting preferences:

```typescript
import { UserPreferences } from '@/lib/cookies';

// Get preferences with automatic type safety and defaults
const isAutoplayEnabled = UserPreferences.getVideoAutoplayEnabled();
const isAudioMuted = UserPreferences.getGlobalAudioMuted();
const shouldShowOnboarding = UserPreferences.getShowOnboarding();

// Set preferences with automatic validation and persistence
UserPreferences.setVideoAutoplayEnabled(true);
UserPreferences.setGlobalAudioMuted(false);
UserPreferences.setShowOnboarding(false);

// Get all preferences at once (useful for debugging)
const allPrefs = UserPreferences.getAllPreferences();
```

## Adding New Preferences

To add a new preference:

1. **Add to Type Definition**: Update `UserPreferenceDefinitions` interface
2. **Add Default Value**: Update `DEFAULT_PREFERENCES` object
3. **Add Cookie Name**: Update `PREFERENCE_COOKIE_NAMES` mapping
4. **Add Getter/Setter**: Add methods to `UserPreferences` object
5. **Update getAllPreferences**: Include the new preference in the return value

Example:

```typescript
// 1. Add to interface
export interface UserPreferenceDefinitions {
  // ... existing preferences
  myNewPreference: string;
}

// 2. Add default
export const DEFAULT_PREFERENCES = {
  // ... existing defaults
  myNewPreference: "default-value",
};

// 3. Add cookie name
export const PREFERENCE_COOKIE_NAMES = {
  // ... existing names
  myNewPreference: "portfolio-my-new-preference",
};

// 4. Add to UserPreferences object
export const UserPreferences = {
  // ... existing methods
  getMyNewPreference: (): string => {
    return getPreference("myNewPreference", "string");
  },
  setMyNewPreference: (value: string): void => {
    setPreference("myNewPreference", value);
  },
};
```

## Security & Privacy

- **No Sensitive Data**: Cookies only contain UI preferences, never sensitive information
- **URL Encoding**: All values are properly encoded for security
- **SameSite Protection**: Cookies use `SameSite=Strict` for CSRF protection
- **Secure Flag**: Cookies use `Secure` flag when served over HTTPS
- **No HttpOnly**: JavaScript access is intentionally enabled for UI state management

## Cleanup & Maintenance

The system automatically cleans up old/deprecated cookies during app initialization:

```typescript
UserPreferences.cleanupOldCookies();
```

Current cleanup list includes:
- `portfolio-sound-volume` (deprecated)
- `portfolio-music-volume` (deprecated)
- `portfolio-music-enabled` (deprecated)  
- `portfolio-theme` (deprecated)
- `portfolio-reduce-motion` (deprecated)
