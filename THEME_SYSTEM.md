# Theme System Documentation

## Overview

The portfolio website features a modern, designer-friendly theme system that provides:

- **Lazy-loaded individual theme files** for optimal performance
- **Two-color swatch approach** for consistent design patterns
- **FOUC prevention** for seamless user experience
- **Type-safe theme definitions** with full TypeScript support
- **Easy designer workflow** with one file per theme

## Architecture

```
src/themes/
├── index.ts           # Main exports
├── base.ts            # Shared properties (spacing, typography, etc.)
├── types.ts           # TypeScript interfaces
├── registry.ts        # Theme registration and lazy loading
├── utils.ts           # Theme application utilities
├── moonlight.ts       # Night theme (default)
├── daytime.ts         # Day theme
├── crimson.ts         # Red theme
└── forest.ts          # Green theme
```

## Two-Color Swatch System

Each theme follows a consistent two-color approach:

### Primary Color (Accent/Interactive)
- **Usage**: Buttons, links, highlights, active states
- **Variants**: `main`, `light` (hover), `dark` (active), `foreground` (text on primary)

### Secondary Color (Backgrounds/Containers)
- **Usage**: Cards, panels, containers, surfaces
- **Variants**: `main`, `light`, `dark`, `foreground` (text on secondary)

### Example Theme Structure

```typescript
export const myTheme: ColorTheme = {
  id: 'my-theme',
  name: 'My Theme',
  description: 'Theme description',
  
  colors: {
    // Primary swatch (interactive elements)
    primary: {
      main: 'rgb(59 130 246)',      // Main accent color
      light: 'rgb(125 211 252)',    // Hover state
      dark: 'rgb(37 99 235)',       // Active state
      foreground: 'rgb(255 255 255)', // Text on primary
    },
    
    // Secondary swatch (backgrounds)
    secondary: {
      main: 'rgb(30 41 59)',        // Main background
      light: 'rgb(51 65 85)',       // Light variant
      dark: 'rgb(15 23 42)',        // Dark variant
      foreground: 'rgb(226 232 240)', // Text on secondary
    },
    
    // Neutral colors (auto-derived but customizable)
    neutral: {
      background: 'rgb(2 6 23)',    // Page background
      foreground: 'rgb(248 250 252)', // Main text
      muted: 'rgb(148 163 184)',     // Muted text
      border: 'rgb(51 65 85)',       // Borders
    },
    
    // Semantic colors (consistent across themes)
    semantic: {
      success: 'rgb(34 197 94)',     // Green
      warning: 'rgb(245 158 11)',    // Amber
      error: 'rgb(239 68 68)',       // Red
      info: 'rgb(59 130 246)',       // Blue
    },
  },
};
```

## CSS Variables Generated

The system automatically generates CSS custom properties:

```css
/* Primary colors */
--theme-primary: rgb(59 130 246);
--theme-primary-light: rgb(125 211 252);
--theme-primary-dark: rgb(37 99 235);
--theme-primary-foreground: rgb(255 255 255);

/* Secondary colors */
--theme-secondary: rgb(30 41 59);
--theme-secondary-light: rgb(51 65 85);
--theme-secondary-dark: rgb(15 23 42);
--theme-secondary-foreground: rgb(226 232 240);

/* Neutral colors */
--theme-background: rgb(2 6 23);
--theme-foreground: rgb(248 250 252);
--theme-muted: rgb(148 163 184);
--theme-border: rgb(51 65 85);

/* Semantic colors */
--theme-success: rgb(34 197 94);
--theme-warning: rgb(245 158 11);
--theme-error: rgb(239 68 68);
--theme-info: rgb(59 130 246);

/* Common UI patterns (auto-generated) */
--theme-card-bg: rgb(30 41 59) / 0.5;
--theme-card-border: rgb(59 130 246) / 0.2;
--theme-button-bg: rgb(59 130 246) / 0.2;
--theme-button-border: rgb(59 130 246) / 0.5;
/* ... and more */
```

## Base Theme Properties

Shared across all themes (from `base.ts`):

```css
/* Typography */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
/* ... */

/* Spacing */
--spacing-xs: 0.5rem;
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
/* ... */

/* Shadows, transitions, z-index, etc. */
```

## FOUC Prevention

The system prevents Flash of Unstyled Content through:

1. **Critical CSS in HTML**: Essential theme variables are set immediately in `index.html`
2. **Early Theme Detection**: Theme preference is read from cookies before React loads
3. **Graceful Fallbacks**: Default theme is applied if preferences are unavailable

## Usage in Components

### Using the Theme Hook

```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { 
    currentTheme, 
    currentThemeId, 
    setTheme, 
    cycleTheme,
    availableThemes,
    isLoading 
  } = useTheme();

  return (
    <div>
      <h2>Current: {currentTheme?.name}</h2>
      <button onClick={cycleTheme} disabled={isLoading}>
        Cycle Theme
      </button>
    </div>
  );
}
```

### Using CSS Variables

```css
.my-component {
  background: rgb(var(--theme-secondary));
  color: rgb(var(--theme-secondary-foreground));
  border: 1px solid rgb(var(--theme-border));
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  transition: var(--transition-normal);
}

.my-component:hover {
  background: rgb(var(--theme-card-hover-bg));
  border-color: rgb(var(--theme-card-hover-border));
}

.my-button {
  background: rgb(var(--theme-primary));
  color: rgb(var(--theme-primary-foreground));
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-lg);
}
```

### Using Inline Styles with Theme

```typescript
function StyledComponent() {
  const { currentTheme } = useTheme();
  
  if (!currentTheme) return null;
  
  return (
    <div
      style={{
        background: currentTheme.colors.secondary.main,
        color: currentTheme.colors.secondary.foreground,
        borderColor: currentTheme.colors.primary.main,
      }}
    >
      Styled content
    </div>
  );
}
```

## Adding New Themes

### Step 1: Create Theme File

Create `src/themes/my-new-theme.ts`:

```typescript
import type { ColorTheme } from './types';

export const myNewTheme: ColorTheme = {
  id: 'my-new-theme',
  name: 'My New Theme',
  description: 'Description of my new theme',
  
  colors: {
    primary: {
      main: 'rgb(147 51 234)',      // Your primary color
      light: 'rgb(168 85 247)',     // Lighter variant
      dark: 'rgb(126 34 206)',      // Darker variant
      foreground: 'rgb(255 255 255)', // Text on primary
    },
    
    secondary: {
      main: 'rgb(55 65 81)',        // Your secondary color
      light: 'rgb(75 85 99)',       // Lighter variant
      dark: 'rgb(31 41 55)',        // Darker variant
      foreground: 'rgb(243 244 246)', // Text on secondary
    },
    
    neutral: {
      background: 'rgb(17 24 39)',  // Page background
      foreground: 'rgb(243 244 246)', // Main text
      muted: 'rgb(156 163 175)',     // Muted text
      border: 'rgb(75 85 99)',       // Borders
    },
    
    semantic: {
      success: 'rgb(34 197 94)',
      warning: 'rgb(245 158 11)',
      error: 'rgb(239 68 68)',
      info: 'rgb(59 130 246)',
    },
  },
};

export default myNewTheme;
```

### Step 2: Register Theme

Add to `src/themes/registry.ts`:

```typescript
export const THEME_REGISTRY: Record<string, ThemeLoader> = {
  // ... existing themes
  'my-new-theme': () => import('./my-new-theme').then(m => m.default),
};

export const THEME_METADATA = {
  // ... existing metadata
  'my-new-theme': {
    id: 'my-new-theme',
    name: 'My New Theme',
    description: 'Description of my new theme',
  },
};
```

### Step 3: Update FOUC Prevention (Optional)

Add to the critical CSS in `index.html` if you want immediate support:

```javascript
const themes = {
  // ... existing themes
  'my-new-theme': {
    primary: "rgb(147 51 234)",
    background: "rgb(17 24 39)",
    foreground: "rgb(243 244 246)"
  }
};
```

## Best Practices

### For Designers

1. **Use the two-color swatch approach** - Pick one primary and one secondary color
2. **Test contrast ratios** - Ensure text is readable on all backgrounds
3. **Consider accessibility** - Test with users who have visual impairments
4. **Stay consistent** - Use the generated CSS variables instead of hardcoded colors

### For Developers

1. **Always use CSS variables** - Never hardcode theme colors
2. **Lazy load themes** - Don't import theme files directly in components
3. **Handle loading states** - Show appropriate UI while themes are loading
4. **Validate theme IDs** - Check if a theme exists before applying it

### Performance

1. **Themes are lazy-loaded** - Only loaded when needed
2. **Critical CSS is inlined** - Essential variables load immediately
3. **Themes are cached** - Once loaded, themes stay in memory
4. **FOUC is prevented** - Users never see unstyled content

## Troubleshooting

### Theme Not Loading
- Check if theme ID exists in `AVAILABLE_THEME_IDS`
- Verify theme file exports default ColorTheme
- Check browser console for import errors

### FOUC Issues
- Ensure critical CSS is in `index.html`
- Check that theme preference is being read correctly
- Verify fallback theme is applied

### CSS Variables Not Working
- Ensure theme has been applied with `applyTheme()`
- Check that CSS uses correct variable syntax: `rgb(var(--theme-primary))`
- Verify theme system has initialized

## Migration from Legacy System

The new system maintains backward compatibility through `src/lib/themes.ts`. However, for best performance and maintainability, migrate to the new system:

```typescript
// Old way (deprecated)
import { applyTheme, getTheme } from '@/lib/themes';

// New way (recommended)
import { applyTheme, loadTheme } from '@/themes';
import { useTheme } from '@/hooks/useTheme';
```
