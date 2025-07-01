# Contributing to Nicolas Martin Portfolio

Thank you for your interest in contributing to this project! This document provides guidelines and information for maintaining and extending this React TypeScript portfolio website.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Version Management](#version-management)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Content Management](#content-management)
- [Theme System](#theme-system)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Build & Deployment](#build--deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

This is a modern, game-inspired portfolio website built with:

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Radix UI** components for accessibility
- **React Router** for navigation
- **TanStack Query** for state management

### Key Features

- Game-style UI with dynamic themes
- Local video background with preferences
- Real-time server connection monitoring
- Mobile-responsive design
- Comprehensive project showcase

## 🚀 Development Setup

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd UpdatedPortfolioWebsite

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server (localhost:8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 📁 Project Structure

```
src/
├── components/           # React components (organized by purpose)
│   ├── core/            # Core app components (AppProviders, Portfolio)
│   ├── navigation/      # Navigation components (MainNavigation, MenuItem, etc.)
│   ├── sections/        # Page sections (Home, About, Skills, Projects, etc.)
│   ├── panels/          # UI panels (ServerConnection, Settings)
│   ├── projects/        # Project-specific components (ProjectDetail, Filter)
│   ├── media/           # Media components (VideoBackground, SocialIcons)
│   ├── errors/          # Error handling (ErrorBoundary, NotFound)
│   ├── layout/          # Layout wrappers (Layout, HomeLayout, etc.)
│   ├── ui/              # Reusable UI components (Radix UI based)
│   └── index.ts         # Centralized component exports
├── content/             # Content data files
│   ├── projects.ts      # Project showcase data
│   ├── personal.ts      # Personal information
│   ├── skills.ts        # Technical skills
│   └── ui-config.ts     # UI configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── themes.ts        # Theme system
│   ├── cookies.ts       # Preference persistence
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

### Component Organization Principles

**📁 Folder Structure**: Components are organized by purpose into logical subfolders

- Each subfolder contains an `index.ts` with documented exports
- Components follow single-responsibility principle
- Well-documented with clear purpose and usage examples

**🎨 Theming**: All components use the centralized theme system

- No hardcoded colors or fonts - everything uses CSS variables
- Theme variables defined in `src/index.css` with fallback values
- Consistent styling across all components

**📝 Documentation**: Every component includes:

- Clear purpose documentation
- TypeScript interfaces for all props
- Usage examples and context

### Key Files

- **`src/content/`** - All content management (projects, skills, personal info)
- **`src/lib/themes.ts`** - Complete theme system with CSS variable generation
- **`src/components/core/AppProviders.tsx`** - Global state management contexts
- **`src/components/index.ts`** - Centralized component exports
- **`tsconfig.*.json`** - TypeScript configuration with strict mode

## 🏷️ Version Management

This project uses a **dual versioning system** for different purposes:

### Version Types

**1. Release Version** (`src/config/version.ts`)

- Format: `2025.06_v03` (year.month_version)
- Used for: UI display, git tags
- Shows: Release date and iteration number
- Example: `2025.06_v03` = 3rd version in June 2025

**2. Package Version** (`package.json`)

- Format: `1.2.0` (major.minor.patch)
- Used for: npm semantic versioning
- Follows: Standard semantic versioning rules
- Example: `1.2.0` = Major version 1, minor version 2, patch 0

### Creating a New Release

1. **Update Release Version** in `src/config/version.ts`:

   ```typescript
   export const RELEASE_VERSION = "2025.07_v01"; // New version
   ```

2. **Update Package Version** in `package.json`:

   ```json
   "version": "1.3.0" // Follow semver: major.minor.patch
   ```

3. **Create Git Tag** using the release version:
   ```bash
   git tag -a "v2025.07_v01" -m "Release v2025.07_v01"
   git push origin v2025.07_v01
   ```

### Semantic Versioning Guidelines (Package Version)

- **Major** (X.0.0): Breaking changes, major UI overhauls
- **Minor** (1.X.0): New features, significant improvements
- **Patch** (1.2.X): Bug fixes, small tweaks

### Build Artifacts

- **Never commit** build artifacts (`dist/`, `assets/`)
- Files are auto-generated during build process
- `.gitignore` prevents accidental commits

## 🔧 Development Workflow

### 1. Code Quality Checks

Before committing, always run:

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build verification
npm run build
```

### 2. Branch Strategy

- **main** - Production-ready code
- **develop** - Development integration
- **feature/** - New features
- **fix/** - Bug fixes

### 3. Commit Guidelines

Use conventional commit format:

```
feat: add new project showcase component
fix: resolve mobile navigation issue
docs: update setup instructions
style: improve theme transition animations
```

## 📝 Code Standards

### TypeScript Configuration

This project uses **strict TypeScript** settings:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noImplicitReturns": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

### Component Guidelines

1. **Use functional components** with TypeScript interfaces
2. **Implement proper prop validation** with readonly where appropriate
3. **Export interfaces** for component props
4. **Use semantic HTML** and proper accessibility attributes
5. **Follow React hooks rules** (ESLint will enforce)

#### Example Component Structure

```tsx
interface ComponentProps {
  readonly title: string;
  readonly children?: React.ReactNode;
  readonly className?: string;
}

const Component: React.FC<ComponentProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={cn("base-styles", className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Component;
```

### Enhanced Navigation Components

The navigation system features advanced text animations and professional game-style interactions:

#### Animation Types

- **letter-morph**: Characters change in place letter by letter (Valorant-style)
- **instant-reveal**: Immediate clear then reveal from left with clip-path
- **fade**: Simple crossfade between text states
- **instant**: No animation - immediate swap

#### NavigationMenuItem Configuration

```tsx
<NavigationMenuItem
  id="projects"
  gameLabel="Play"
  hoverLabel="Projects"
  hierarchy="primary"
  section="projects"
  isActive={currentSection === "projects"}
  onClick={handleMenuClick}
  animationType="letter-morph" // Default animation
  animationSpeed={1.2} // Enhanced responsiveness
  enableEnhancedAnimations={true} // Enable advanced effects
  hasIcon={false} // Show icon for special buttons
/>
```

#### Sound Integration

Sound effects are automatically integrated with the global mute setting:

```tsx
// Sound effects respect global video mute state
const { playHover, playClick } = useSoundEffects();
// Will not play if video is muted via global toggle
```

#### Theme Integration

The navigation system features comprehensive theme integration with dedicated color variables:

```tsx
// Theme-aware special buttons
// Quit button: always uses red for universal danger indication
// Patchnotes button: uses theme's accent color for consistency

// Themes automatically provide CSS variables:
--theme-quit-color        // Base state (gray/slate)
--theme-quit-hover        // Hover state (red-500)
--theme-patchnotes-color  // Base state (gray/slate)
--theme-patchnotes-hover  // Hover state (theme accent)

// Components automatically use these variables:
style={{
  color: isHovered ? 'var(--theme-quit-hover)' : 'var(--theme-quit-color)'
}}
```

The theme system (`src/lib/themes.ts`) defines colors for each theme, and the `applyTheme()` function automatically applies the appropriate CSS variables. This ensures consistent styling across all themes while maintaining semantic color choices (red for quit/danger, theme accent for patchnotes).

#### Hierarchy Levels

- **primary**: Largest buttons (Projects/Play)
- **secondary**: Standard menu items (About, Contact, Skills)
- **tertiary**: Smaller items (Extras/Hobbies)
- **patchnotes**: Special button with newspaper icon
- **quit**: Exit button with logout icon

### Styling Guidelines

1. **Use Tailwind CSS** utility classes
2. **Leverage CSS variables** for theming (see `src/lib/themes.ts`)
3. **Follow mobile-first** responsive design
4. **Use `cn()` utility** for conditional classes
5. **Maintain consistent spacing** using Tailwind's scale

### State Management

- **Local state**: `useState` for component-specific state
- **Global state**: Context providers in `AppProviders.tsx`
- **Server state**: TanStack Query for async operations
- **Preferences**: Cookie-based persistence via `src/lib/cookies.ts`

## 📄 Content Management

### User Preferences System

The portfolio now includes a comprehensive user preferences management system in `src/lib/cookies.ts` that provides:

- **Type-Safe Preferences**: All preferences are defined with TypeScript interfaces
- **Extensible Architecture**: Easy to add new preferences without breaking existing code
- **Secure Cookie Management**: Proper security flags with URL encoding
- **Single Source of Truth**: Centralized API accessible throughout the application

#### Current Preferences:
- **Video & Media**: `videoAutoplayEnabled`, `globalAudioMuted`
- **Audio & Sound**: `soundEffectVolume`, `backgroundMusicVolume`, `backgroundMusicEnabled`
- **UI & UX**: `selectedTheme`, `showOnboarding`
- **Accessibility**: `reduceMotionEnabled`

#### Usage Example:
```typescript
import { UserPreferences } from '@/lib/cookies';

// Get preferences with automatic type safety and defaults
const isAutoplayEnabled = UserPreferences.getVideoAutoplayEnabled();
const currentTheme = UserPreferences.getSelectedTheme();

// Set preferences with validation and persistence
UserPreferences.setGlobalAudioMuted(true);
UserPreferences.setSelectedTheme('cyberpunk');
```

See `PREFERENCES_SYSTEM.md` for complete documentation.

### Adding Projects

Edit `src/content/projects.ts`:

```typescript
export const projects: Project[] = [
  {
    id: "unique-project-id",
    title: "Project Title",
    category: "Project Category",
    type: "solo" | "team" | "academic",
    tags: ["React", "TypeScript"],
    description: "Brief description",
    details: "Detailed technical overview",
    image: "https://image-url.com",
    // Optional detailed sections
    design: {
      /* design process */
    },
    code: {
      /* technical implementation */
    },
    implementation: {
      /* project timeline */
    },
  },
];
```

### Updating Personal Information

Edit `src/content/personal.ts` for contact details and social links.

### Managing Skills

Edit `src/content/skills.ts` to update technical skills and tools.

### UI Configuration

Edit `src/content/ui-config.ts` for:

- Navigation menu items
- Background images
- Video settings
- Layout preferences

## 🎨 Theme System

The theme system in `src/lib/themes.ts` provides:

### Adding New Themes

```typescript
export const THEMES: Record<string, ThemeConfig> = {
  newTheme: {
    id: "newTheme",
    name: "New Theme Name",
    description: "Theme description",
    colors: {
      background: "0 0% 100%", // HSL format
      foreground: "0 0% 0%",
      // ... other colors
    },
    gameStyle: {
      menuTextColor: "#ffffff",
      // ... game-specific styling
    },
  },
};
```

### CSS Variable Generation

Themes automatically generate CSS custom properties:

- `--background` → `hsl(0 0% 100%)`
- `--theme-panel-bg` → `rgba(0, 0, 0, 0.8)`

## 🧪 Testing & Quality Assurance

### Manual Testing Checklist

- [ ] **Responsive Design**: Test on mobile, tablet, desktop
- [ ] **Video Functionality**: Play, pause, mute, preferences
- [ ] **Navigation**: All sections and project details
- [ ] **Theme Switching**: All themes render correctly
- [ ] **Performance**: Video loading, smooth animations
- [ ] **Accessibility**: Keyboard navigation, screen readers

### Code Quality Tools

```bash
# TypeScript strict checking
npx tsc --noEmit

# ESLint with React rules
npm run lint

# Build verification
npm run build
```

### Performance Considerations

- **Video Optimization**: Proper loading states and error handling
- **Image Loading**: Use appropriate formats and sizes
- **Bundle Size**: Monitor with `npm run build` output
- **Accessibility**: Maintain ARIA attributes and semantic HTML

### Performance Optimizations

This project implements several performance optimizations:

#### Code Splitting & Lazy Loading

- **ProjectDetail Component**: Lazy loaded to reduce initial bundle size
- **React.Suspense**: Provides loading states for code-split components
- **Automatic Bundle Analysis**: Vite automatically splits chunks for optimal loading

#### React Performance

- **React.memo()**: Applied to expensive components like NavigationMenu
- **Stable Keys**: Proper React keys prevent unnecessary re-renders
- **useCallback/useMemo**: Used in contexts to prevent excessive re-renders

#### Bundle Size Monitoring

Current production bundle sizes:

- Main bundle: ~294KB (~93KB gzipped)
- ProjectDetail chunk: ~10KB (~2.5KB gzipped)
- CSS: ~37KB (~7KB gzipped)

#### Cookie Security

- **Secure Flag**: Automatically applied in HTTPS environments
- **SameSite**: Set to 'Lax' for CSRF protection
- **Client-side Only**: HttpOnly intentionally omitted for preference access

## 🚀 Build & Deployment

### Production Build

```bash
npm run build
```

Generates optimized static files in `dist/`:

- **HTML**: Single-page application entry point
- **CSS**: Compiled Tailwind styles (~37KB, ~7KB gzipped)
- **JS Main Bundle**: React application bundle (~294KB, ~93KB gzipped)
- **JS Lazy Chunks**: Code-split components (e.g., ProjectDetail ~10KB, ~2.5KB gzipped)

### Environment Variables

Create `.env.local` for local development:

```env
VITE_API_URL=your-api-url
```

### Deployment Platforms

This project is optimized for:

- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting**

## 🔧 Troubleshooting

### Common Issues

**TypeScript Errors**

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run build
```

**ESLint Issues**

```bash
# Check specific file
npx eslint src/components/YourComponent.tsx
```

**Build Failures**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Video Not Loading**

- Check file path in `public/videos/`
- Verify browser codec support
- Test with fallback poster image

### Development Server Issues

1. **Port conflicts**: Default port 8080, configure in `vite.config.ts`
2. **Hot reload**: Clear browser cache if changes don't appear
3. **CORS issues**: Configure proxy in Vite config if needed

## 📞 Support

For questions or issues:

1. **Check existing documentation** in this file
2. **Review TypeScript errors** carefully
3. **Test in clean environment** (fresh install)
4. **Check browser console** for runtime errors

## 🔄 Version History

- **v1.0.0** - Initial portfolio release with strict TypeScript setup
- Clean codebase with professional type safety
- Complete theme system and content management
- Production-ready build configuration

---

_This contributing guide reflects the current state of the project as of the latest commit. Keep this document updated as the project evolves._
