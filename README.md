# Nicolas Martin Portfolio

A modern, game-inspired portfolio website built with React, TypeScript, and Tailwind CSS.

## Features

### ✅ Completed

- **Responsive Design**: Single component that adapts to all screen sizes using modern CSS breakpoints
- **Local Video Background**: Optimized HTML5 video player with cookie-based preferences and memory management
- **Server Connection Panel**: Real HTTP latency and packet loss stats in game-style UI (desktop only)
- **Social Media Integration**: GitHub, LinkedIn, The Rookies, YouTube icons with responsive positioning
- **Game-Style Navigation**: Interactive menu with hover effects and smooth transitions
- **Project Filtering**: Filter projects by type (All/Team/Solo/Academic)
- **Mobile-Friendly**: Responsive navigation, touch-friendly controls, and optimized layout
- **Video Game Main Menu Aesthetic**: Seamless sidebar gradient, prominent game title positioning, and clean menu interface
- **Settings Panel**: Compact icon-based settings popup with theme, video, and audio controls

### 🔄 TODO

#### Feature Improvements

- [ ] Add Night/Day mode toggle (warm/yellow vs. cool/blue themes)
- [ ] Add transition animations when opening subpages from the main menu
- [ ] Add GitHub repo/download links on Project Details pages where available
- [ ] [Future] Improve video quality and compression (AV1, adaptive streaming, higher bitrates)
- [ ] Fake login screen that we can show as greeter and when clicking on QUIT (could be renamed to Logout)

#### Style Enhancements

- [ ] Implement Night/Day (warm/cool) color theme system
- [x] Enhanced game-style menu with seamless gradient background and prominent title positioning
- [ ] Overwatch 2-style Projects page: Game Modes categorization system
- [ ] More interactive project cards (hover, tilt, sound effects)
- [ ] Clean UI Animations for extending settings, hovering buttons and clicking

#### Content & Polish

- [ ] Improve Project Details layout with better image/code/video alignment
- [ ] Add syntax highlighting for code snippets
- [ ] Enhanced project writeups and additional links
- [ ] Smooth subpage transitions with game-like animations
- [ ] Add patchnotes element to the main menu
- [ ] Move the Fallback Image warning and others to the center bottom instead of the left bottom

## Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **UI Components**: Custom components with shadcn/ui integration
- **Video**: HTML5 with cookie-based preference persistence
- **Network Stats**: Real-time HTTP latency and packet loss measurement
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Architecture

### 🏗️ **Clean Provider-Based Architecture**

The portfolio uses a modern React provider pattern with complete separation of concerns:

- `src/components/Portfolio.tsx` - Main component with provider composition (clean & focused)
- `src/components/VideoControlProvider.tsx` - Video state management with cookie persistence
- `src/components/NavigationProvider.tsx` - Navigation and project selection state management
- `src/components/SettingsPanel.tsx` - UI settings and theme management
- `src/components/ServerConnectionPanel.tsx` - Network stats and connection monitoring  
- `src/config/version.ts` - Single source of truth for build version display

### ✅ **Developer Benefits**

Each feature can be modified independently without risk of breaking others:
- **Video features** → Only touch `VideoControlProvider.tsx` and `useVideoControls` hook
- **Navigation** → Only touch `NavigationProvider.tsx` and `useNavigation` hook
- **Settings** → Only touch `SettingsPanel.tsx`
- **Version updates** → Only touch `src/config/version.ts`

### 📁 **Directory Structure**

- `src/components/sections/` - Individual page sections (Home, Projects, About, etc.)
- `src/components/ui/` - Reusable UI components (shadcn/ui)
- `src/hooks/` - Custom React hooks (use-navigation.ts, use-video-controls.ts)
- `src/content/` - Content configuration and data
- `src/lib/` - Utilities and helper functions

## Development Workflow & Principles

### Architecture Principles

- **Component-Based Design**: Modular React components with clear separation of concerns
- **TypeScript First**: Strict typing for better code quality and developer experience
- **Mobile-First Responsive**: Built with Tailwind CSS breakpoints (mobile → tablet → desktop)
- **Game-Inspired UX**: Clean, modern UI with video game aesthetics and smooth interactions
- **Performance Optimized**: Video management, efficient re-renders, and optimized asset loading
- **Accessibility**: Proper ARIA labels, keyboard navigation, and semantic HTML

### Code Organization

```
src/
├── components/              # React components
│   ├── Portfolio.tsx       # Main component with provider composition
│   ├── VideoControlProvider.tsx    # Video state management
│   ├── NavigationProvider.tsx      # Navigation state management  
│   ├── SettingsPanel.tsx          # Settings UI and logic
│   ├── ServerConnectionPanel.tsx  # Network monitoring
│   ├── sections/           # Page sections (Home, Projects, etc.)
│   └── ui/                # Reusable UI components (shadcn/ui)
├── config/                 # Configuration files
│   └── version.ts         # Build version (single source of truth)
├── content/               # Content configuration & data
│   ├── projects.ts        # Project data and interfaces
│   ├── skills.ts          # Skills and tools data
│   ├── about.ts           # About page content
│   ├── personal.ts        # Personal info and contacts
│   ├── ui-config.ts       # Navigation, backgrounds, UI config
│   └── index.ts           # Central content exports
├── hooks/                 # Custom React hooks
│   ├── use-navigation.ts  # Navigation hook with error handling
│   ├── use-video-controls.ts # Video controls hook with error handling
│   └── use-*.ts          # Other custom hooks
├── lib/                   # Utilities and helper functions
│   ├── utils.ts           # General utilities (cn, etc.)
│   ├── themes.ts          # Theme system configuration
│   └── cookies.ts         # Video preference persistence
└── pages/                 # Route components
```

### Git Workflow & Version Management

#### Branch Structure

- **`main`**: Development source code and documentation  
- **`releases`**: **Production-ready build files** (index.html, assets/) for deployment

#### Build & Release Process

1. **Development**: Work on features in `main` branch
2. **Update Version**: Edit `src/config/version.ts` with new version (e.g., `v2025.06_v04`)
3. **Build & Test**: `npm run build` and `npm run lint` to ensure everything works
4. **Commit Changes**: Commit version update and any final changes to `main`
5. **Create Release**: Build production files and commit to `releases` branch
6. **Deploy**: Deploy built files from `releases` branch

#### Release Commands

```bash
# 1. Update version in src/config/version.ts (e.g., v2025.06_v04)

# 2. Test everything works
npm run build
npm run lint

# 3. Commit version update to main
git add .
git commit -m "chore: bump version to v2025.06_v04"
git push origin main

# 4. Create production release
git checkout releases
git merge main
npm run build
cp -r dist/* .  # Copy built files to releases root
git add index.html assets/
git commit -m "build: production build v2025.06_v04"
git tag -a v2025.06_v04 -m "Release v2025.06_v04: [Description]"
git push origin releases
git push origin v2025.06_v04

# 5. Return to development
git checkout main
```

#### Deployment

- **Source**: Deploy the built files from `releases` branch root
- **Files**: `index.html` and `assets/` directory contain everything needed
- **Version**: Each release tag points to a specific built version
- **Traceability**: Git tags link deployed versions to exact source code

#### Version Management

- **Source of Truth**: `src/config/version.ts` - single file to update for new releases
- **Format**: `v2025.06_v02` (year.month_version)
- **Display**: Automatically shown in bottom-left corner of website
- **Git Tags**: Each release gets a corresponding git tag pointing to built files in `releases` branch
- **Deployment**: Use files from `releases` branch root (index.html + assets/)

### Development Guidelines

#### TypeScript

- Strict unused variable detection enabled for better code quality
- Interface definitions in content files for data structures
- Proper typing for component props and state
- Comprehensive JSDoc documentation for all public APIs

#### Code Quality Standards

- **ESLint**: Configured with React and TypeScript rules, unused variable detection
- **Professional Documentation**: All components have detailed JSDoc with examples
- **Error Handling**: Comprehensive error boundaries and context validation
- **Clean Architecture**: Provider pattern with complete separation of concerns
- **No Dead Code**: Regular cleanup of unused imports and components enforced by linting

- **Tailwind CSS** for all styling with custom game-inspired classes
- **CSS Custom Properties** for theme colors and dynamic values
- **Responsive Design** using Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- **Game Aesthetics**: Amber color scheme, atmospheric glows, backdrop blur

#### Performance

- **Video Optimization**: Cookie-based preferences, memory management
- **Component Optimization**: useCallback for expensive operations
- **Asset Management**: Optimized images, efficient imports
- **Build Optimization**: Vite bundling with tree-shaking

#### Styling

### File Conventions

- **Components**: PascalCase (`Portfolio.tsx`)
- **Hooks**: camelCase with `use` prefix (`useToast.ts`)
- **Content**: camelCase (`ui-config.ts`)
- **Utilities**: camelCase (`utils.ts`)
- **Types**: PascalCase interfaces and types

### Content Management

- **Centralized Data**: All content in `src/content/` directory
- **Type Safety**: TypeScript interfaces for all data structures
- **Easy Updates**: Modify content files without touching components
- **Modular Exports**: Clean imports through `content/index.ts`

## 🚀 **Extending the Portfolio**

### Adding New Sections

1. **Create Section Component**: Add new component in `src/components/sections/`
2. **Update Navigation**: Add menu item to `src/content/ui-config.ts`
3. **Add Content**: Create content file in `src/content/` directory
4. **Import & Route**: Add section to main Portfolio component

### Adding New Projects

1. **Add Project Data**: Edit `src/content/projects.ts`
2. **Follow Interface**: Use the `Project` interface for type safety
3. **Add Assets**: Place images in public directory or use external URLs

### Modifying Themes

1. **Edit Theme Config**: Modify `src/lib/themes.ts`
2. **CSS Properties**: Themes automatically generate CSS custom properties
3. **Component Usage**: Use theme classes like `theme-card`, `theme-heading`

### Adding New Providers

1. **Create Provider**: Follow pattern in `VideoControlProvider.tsx`
2. **Create Hook**: Add corresponding `use-*` hook with error handling
3. **Wrap Component**: Add to main Portfolio component provider stack

---
