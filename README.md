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

### 🏗️ **Modular Architecture (AI-Agent Friendly)**

The portfolio is built with a modular architecture where each feature is completely isolated:

- `src/components/PortfolioLayout.tsx` - Main layout with composition pattern (no business logic)
- `src/components/VideoControlProvider.tsx` - Video state management (play/pause/mute/fullscreen)
- `src/components/NavigationProvider.tsx` - Navigation and project selection state
- `src/components/SettingsPanel.tsx` - UI settings and theme management
- `src/components/ServerConnectionPanel.tsx` - Network stats and connection monitoring
- `src/config/version.ts` - Single source of truth for build version display

### ✅ **AI Agent Benefits**

Each feature can be modified independently without risk of breaking others:
- **Video features** → Only touch `VideoControlProvider.tsx`
- **Navigation** → Only touch `NavigationProvider.tsx` 
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
│   ├── PortfolioLayout.tsx # Main layout (composition only)
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
│   ├── use-navigation.ts  # Navigation hook
│   ├── use-video-controls.ts # Video controls hook
│   └── use-*.ts          # Other custom hooks
├── lib/                   # Utilities and helper functions
│   ├── utils.ts           # General utilities (cn, etc.)
│   └── cookies.ts         # Video preference persistence
└── pages/                 # Route components
```

### Git Workflow & Version Management

#### Branch Structure

- **`main`**: Production-ready source code
- **`releases`**: Production build artifacts for deployment tracking

#### Build & Release Process

1. **Development**: Work on features in `main` branch
2. **Update Version**: Edit `src/config/version.ts` with new version (e.g., `v2025.12_v03`)
3. **Build & Test**: `npm run build` and `npm run lint` to ensure everything works
4. **Commit Changes**: Commit version update and any final changes to `main`
5. **Create Release**: Merge `main` → `releases` and create version tag
6. **Deploy**: Deploy from `releases` branch with traceable build IDs

#### Release Commands

```bash
# 1. Update version in src/config/version.ts (e.g., v2025.12_v03)

# 2. Test everything works
npm run build
npm run lint

# 3. Commit version update
git add .
git commit -m "chore: bump version to v2025.12_v03"
git push origin main

# 4. Create release
git checkout releases
git merge main
git tag -a v2025.12_v03 -m "Release v2025.12_v03: [Description]"
git push origin releases
git push origin v2025.12_v03

# 5. Return to development
git checkout main
```

#### Version Management

- **Source of Truth**: `src/config/version.ts` - single file to update for new releases
- **Format**: `v2025.12_v02` (year.month_version)
- **Display**: Automatically shown in bottom-left corner of website
- **Git Tags**: Each release gets a corresponding git tag for traceability

### Development Guidelines

#### TypeScript

- Strict mode disabled for flexibility during rapid development
- Interface definitions in content files for data structures
- Proper typing for component props and state

#### Styling

- **Tailwind CSS** for all styling with custom game-inspired classes
- **CSS Custom Properties** for theme colors and dynamic values
- **Responsive Design** using Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- **Game Aesthetics**: Amber color scheme, atmospheric glows, backdrop blur

#### Performance

- **Video Optimization**: Cookie-based preferences, memory management
- **Component Optimization**: useCallback for expensive operations
- **Asset Management**: Optimized images, efficient imports
- **Build Optimization**: Vite bundling with tree-shaking

#### Code Quality

- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **Clean Code**: Descriptive variable names, commented complex logic
- **No Unused Code**: Regular cleanup of unused imports and components

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

---
