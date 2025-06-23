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

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **UI Components**: Custom components with shadcn/ui integration
- **Video**: HTML5 with cookie-based preference persistence
- **Network Stats**: Real-time HTTP latency and packet loss measurement
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Architecture
- `src/components/Portfolio.tsx` - Main responsive portfolio component with video game aesthetics
- `src/components/sections/` - Individual page sections (Home, Projects, About, etc.)
- `src/components/ui/` - Reusable UI components
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
├── components/           # React components
│   ├── Portfolio.tsx    # Main container component
│   ├── sections/        # Page sections (Home, Projects, etc.)
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   └── *.tsx           # Feature components
├── content/            # Content configuration & data
│   ├── projects.ts     # Project data and interfaces
│   ├── skills.ts       # Skills and tools data
│   ├── about.ts        # About page content
│   ├── personal.ts     # Personal info and contacts
│   ├── ui-config.ts    # Navigation, backgrounds, UI config
│   └── index.ts        # Central content exports
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helper functions
│   ├── utils.ts        # General utilities (cn, etc.)
│   └── cookies.ts      # Video preference persistence
└── pages/              # Route components
```

### Git Workflow & Version Management

#### Branch Structure
- **`main`**: Production-ready source code
- **`releases`**: Production build artifacts for deployment tracking

#### Build & Release Process
1. **Development**: Work on features in `main` branch
2. **Build**: `npm run build` creates production files in `dist/`
3. **Release**: Production builds are committed to `releases` branch with version tags
4. **Deploy**: Deploy from `releases` branch with traceable build IDs

#### Commands
```bash
# Development
npm run dev          # Start development server
npm run lint         # Run ESLint checks
npm run build        # Create production build

# Release Process
npm run build                           # Create production build
git checkout releases                   # Switch to releases branch
# Copy dist/ contents to releases branch root
git add . && git commit -m "build: production build vX.XX.XX_vXX"
git push origin releases               # Push release to GitHub
git checkout main                      # Return to development
```

### Build ID System
- **Format**: `v2025.07_v01` (year.month_version)
- **Location**: Displayed in bottom-left corner of main menu
- **Purpose**: Match deployed versions to git commits in `releases` branch
- **Updates**: Increment for each production release

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
