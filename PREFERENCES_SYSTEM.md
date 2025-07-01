# User Preferences & Theme Management System

## Overview

The portfolio website includes a comprehensive, type-safe, and extensible user preferences management system integrated with a modern theme system. This provides a single source of truth for all user settings and themes, with secure cookie persistence, lazy loading, and FOUC (Flash of Unstyled Content) prevention.

## Theme System Features

- **Two-Color Swatch Design**: Each theme uses a primary color (accents/interactive) and secondary color (backgrounds/containers)
- **Lazy Loading**: Individual theme files are loaded only when needed for optimal performance
- **Designer-Friendly**: One file per theme for easy editing and customization
- **FOUC Prevention**: Critical theme CSS is loaded immediately to prevent flash of unstyled content
- **Type Safety**: Full TypeScript support with proper interfaces and validation

## Available Themes

### 🌙 Moonlight Night (Default)
- **ID**: `moonlight`
- **Primary**: Cool blue (`rgb(59 130 246)`) for interactive elements
- **Secondary**: Deep slate (`rgb(30 41 59)`) for backgrounds
- **Description**: Cool blue theme perfect for nighttime browsing

### ☀️ Sunny Daytime
- **ID**: `daytime`
- **Primary**: Warm orange (`rgb(249 115 22)`) for interactive elements
- **Secondary**: Clean whites (`rgb(248 250 252)`) for backgrounds
- **Description**: Bright, energetic theme perfect for daytime productivity

### 🔥 Crimson Fire
- **ID**: `crimson`
- **Primary**: Deep red (`rgb(220 38 38)`) for interactive elements
- **Secondary**: Dark charcoal (`rgb(38 38 38)`) for backgrounds
- **Description**: Bold, passionate red theme with intense energy

### 🌲 Forest Emerald
- **ID**: `forest`
- **Primary**: Rich emerald (`rgb(34 197 94)`) for interactive elements
- **Secondary**: Deep forest green (`rgb(22 78 99)`) for backgrounds
- **Description**: Natural, calming green theme inspired by forest environments

## User Preferences Features

- **Type-Safe Preferences**: All preferences are defined with TypeScript interfaces
- **Extensible Architecture**: Easy to add new preferences without breaking existing code
- **Secure Cookie Management**: Proper security flags with URL encoding
- **Default Value Management**: Explicit defaults with automatic fallbacks
- **Single Source of Truth**: Centralized API for all preference management
- **Validation & Error Handling**: Robust validation for malformed data

## Current Preferences

### Video & Media
- `videoAutoplayEnabled` (boolean) - Whether video should autoplay when visiting/returning to home section
- `globalAudioMuted` (boolean) - Global site-wide audio mute setting (affects video sound + UI sound effects)

### Audio & Sound
- `soundEffectVolume` (number) - Volume level for UI sound effects (0.0 to 1.0)
- `backgroundMusicVolume` (number) - Volume level for background music (0.0 to 1.0)
- `backgroundMusicEnabled` (boolean) - Whether background music should play automatically

### UI & UX
- `selectedTheme` (string) - Selected theme identifier ('moonlight', 'daytime', 'crimson', 'forest')
- `showOnboarding` (boolean) - Whether to show onboarding/tutorial on first visit

### Accessibility
- `reduceMotionEnabled` (boolean) - Whether to reduce motion for accessibility

## Theme System Usage

### Using Themes in Components

```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { currentTheme, setTheme, availableThemes, isLoading } = useTheme();

  const handleThemeChange = async (themeId: string) => {
    const success = await setTheme(themeId);
    if (success) {
      console.log('Theme changed successfully!');
    }
  };

  return (
    <div>
      <h2>Current Theme: {currentTheme?.name}</h2>
      {availableThemes.map(theme => (
        <button 
          key={theme.id}
          onClick={() => handleThemeChange(theme.id)}
          disabled={isLoading}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}
```

### Creating Custom Themes

Create a new theme file in `src/themes/`:

```typescript
// src/themes/my-theme.ts
import type { ColorTheme } from './types';

export const myTheme: ColorTheme = {
  id: 'my-theme',
  name: 'My Custom Theme',
  description: 'A beautiful custom theme',
  
  colors: {
    primary: {
      main: 'rgb(147 51 234)',      // Purple-600
      light: 'rgb(168 85 247)',     // Purple-500
      dark: 'rgb(126 34 206)',      // Purple-700
      foreground: 'rgb(255 255 255)', // White
    },
    
    secondary: {
      main: 'rgb(55 65 81)',        // Gray-700
      light: 'rgb(75 85 99)',       // Gray-600
      dark: 'rgb(31 41 55)',        // Gray-800
      foreground: 'rgb(243 244 246)', // Gray-100
    },
    
    // ... rest of the theme configuration
  },
};
```

Then register it in `src/themes/registry.ts`:

```typescript
export const THEME_REGISTRY: Record<string, ThemeLoader> = {
  // ... existing themes
  'my-theme': () => import('./my-theme').then(m => m.default),
};
```

## Usage Examples

### Basic Usage

```typescript
import { UserPreferences } from '@/lib/cookies';

// Get a preference with automatic type safety and default fallback
const isAutoplayEnabled = UserPreferences.getVideoAutoplayEnabled();

// Set a preference with automatic validation and persistence
UserPreferences.setGlobalAudioMuted(true);

// Check if a preference has been explicitly set by the user
const hasUserSetTheme = UserPreferences.hasUserSetPreference('selectedTheme');
```

### Volume Controls

```typescript
// Get current sound effect volume (0.0 to 1.0)
const currentVolume = UserPreferences.getSoundEffectVolume();

// Set sound effect volume with automatic clamping to valid range
UserPreferences.setSoundEffectVolume(0.7);

// Get background music settings
const musicEnabled = UserPreferences.getBackgroundMusicEnabled();
const musicVolume = UserPreferences.getBackgroundMusicVolume();
```

### Theme Management

```typescript
// Get current theme
const currentTheme = UserPreferences.getSelectedTheme();

// Set theme (integrates with existing theme system)
UserPreferences.setSelectedTheme('cyberpunk');
```

### Accessibility Settings

```typescript
// Check if user prefers reduced motion
const reduceMotion = UserPreferences.getReduceMotionEnabled();

// Set reduced motion preference
UserPreferences.setReduceMotionEnabled(true);
```

### Utility Functions

```typescript
// Get all current preferences (useful for debugging or export)
const allPrefs = UserPreferences.getAllPreferences();

// Reset a specific preference to default
UserPreferences.resetPreferenceToDefault('soundEffectVolume');

// Reset all preferences (factory reset)
UserPreferences.resetAllPreferencesToDefaults();
```

## Adding New Preferences

To add a new preference:

1. **Update the Type Definition** in `src/lib/cookies.ts`:

```typescript
export interface UserPreferenceDefinitions {
  // ...existing preferences...
  
  // Add your new preference
  newPreferenceName: boolean; // or string, number, etc.
}
```

2. **Add Default Value**:

```typescript
export const DEFAULT_PREFERENCES: UserPreferenceDefinitions = {
  // ...existing defaults...
  
  newPreferenceName: false, // Your default value
};
```

3. **Add Cookie Name**:

```typescript
export const PREFERENCE_COOKIE_NAMES: Record<keyof UserPreferenceDefinitions, string> = {
  // ...existing names...
  
  newPreferenceName: "portfolio-new-preference",
};
```

4. **Add Getter/Setter Methods**:

```typescript
export const UserPreferences = {
  // ...existing methods...
  
  /**
   * Get your new preference
   * @returns Description of what it returns
   */
  getNewPreferenceName: (): boolean => {
    const cookieValue = getCookie(PREFERENCE_COOKIE_NAMES.newPreferenceName);
    return deserializePreferenceValue(cookieValue, "boolean", DEFAULT_PREFERENCES.newPreferenceName);
  },

  /**
   * Set your new preference
   * @param value - Description of the parameter
   */
  setNewPreferenceName: (value: boolean): void => {
    setCookie(PREFERENCE_COOKIE_NAMES.newPreferenceName, serializePreferenceValue(value));
  },
};
```

5. **Update `getAllPreferences` method** to include the new preference.

## Migration from Legacy System

The system includes a legacy compatibility layer for the old `VideoPreferences` API:

```typescript
// OLD (deprecated, but still works)
VideoPreferences.setMuted(true);
const isMuted = VideoPreferences.getMuted();

// NEW (recommended)
UserPreferences.setGlobalAudioMuted(true);
const isMuted = UserPreferences.getGlobalAudioMuted();
```

**Migration Plan:**
1. Legacy API will show deprecation warnings in console
2. Update components to use new API over time
3. Remove legacy compatibility layer in future version

## Security & Privacy

- **Cookie Security**: Cookies use proper security flags (`SameSite=Lax`, `Secure` for HTTPS)
- **No Sensitive Data**: Cookies only contain UI preferences, no personal or sensitive information
- **URL Encoding**: All cookie values are URL encoded to handle special characters safely
- **Client-Side Only**: HttpOnly flag is intentionally omitted as these are client-side preferences

## Technical Implementation

### Cookie Management
- **Expiration**: 1 year by default (configurable)
- **Path**: `/` (site-wide)
- **SameSite**: `Lax` for CSRF protection
- **Secure**: Automatically applied for HTTPS and localhost

### Validation & Error Handling
- **Type Validation**: Automatic type checking and conversion
- **Range Clamping**: Numeric values are clamped to valid ranges
- **Fallback Behavior**: Always returns default values for invalid/missing data
- **Error Logging**: Comprehensive error logging for debugging

### Performance
- **Lazy Loading**: Preferences are only read when needed
- **Caching**: No additional caching layer needed (cookies are already cached by browser)
- **Bundle Size**: Minimal impact on bundle size

## Integration Points

### Video Controls (AppProviders.tsx)
- Video autoplay state synchronized with `videoAutoplayEnabled`
- Global mute state synchronized with `globalAudioMuted`

### Theme System (themes.ts)
- Theme selection synchronized with `selectedTheme`
- Automatic theme persistence when themes are applied

### Sound Effects (useSoundEffects.ts)
- Sound effects respect `globalAudioMuted` setting
- Volume controlled by `soundEffectVolume` (future enhancement)

## Future Enhancements

- **Real-time Sync**: Synchronize preferences across multiple browser tabs
- **Cloud Sync**: Optional cloud synchronization for logged-in users
- **Import/Export**: Preference backup and restore functionality
- **Analytics**: Anonymous analytics on preference usage patterns
- **Validation Schema**: JSON Schema validation for complex preferences

## Best Practices

1. **Always use the UserPreferences API** instead of reading cookies directly
2. **Check for user-set preferences** before applying automatic behaviors
3. **Provide clear default values** that work well for new users
4. **Validate input ranges** for numeric preferences
5. **Document new preferences** thoroughly in this file
6. **Test with disabled cookies** to ensure graceful degradation

---

This preferences system provides a solid foundation for managing user settings while maintaining flexibility for future enhancements and ensuring a great user experience.
