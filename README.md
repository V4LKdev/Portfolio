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

---
