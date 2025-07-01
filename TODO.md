# TODO - Future Enhancements

This file tracks planned features, improvements, and technical debt for the Nicolas Martin Portfolio project.

## 🚀 Planned Features

### Theming & Visual Style

- [x] **Modern Theme System (July 2025)**: Complete overhaul with 4 themes (Moonlight Night, Sunny Daytime, Crimson Fire, Forest Emerald)
- [x] **Two-Color Swatch Design (July 2025)**: Primary (interactive) + Secondary (background) color approach for consistency  
- [x] **Lazy Loading & FOUC Prevention (July 2025)**: Individual theme files with optimal loading and no flash of unstyled content
- [x] **Designer-Friendly Architecture (July 2025)**: One file per theme, easy customization, type-safe theme definitions
- [x] **Enhanced Navigation (July 2025)**: Advanced text animations (letter-morph, instant reveal), sound integration, Patchnotes button
- [x] **Comprehensive User Preferences System (July 2025)**: Type-safe, extensible preference management with secure cookie persistence
- [ ] Improve UI animations (settings, menu, buttons, subpage transitions)

### Project & Content Features

- [ ] Overhaul Project Details (better layout, image galleries/lightbox, video demos, interactive code with syntax highlighting, more writeups/links)
- [ ] Add GitHub repo/download links to Project Details
- [ ] Overwatch 2-style Projects page (Game Modes categorization)
- [ ] More interactive project cards (hover, tilt, sound effects)

### User Experience & Interactivity

- [ ] Add contact form with validation, spam protection, and email service
- [ ] Implement fake login/greeter screen (e.g., for QUIT/logout)
- [x] **Add patchnotes element to the main menu (July 2025)**: Integrated with icon animations
- [x] Move fallback image warning and similar notifications to center bottom
- [ ] Add more sound effects and audio feedback throughout the UI
- [ ] Implement different animation themes (Overwatch-style, Valorant-style variations)
- [ ] Integrate volume controls for sound effects using new preferences system
- [ ] Add onboarding tutorial system using `showOnboarding` preference

### Performance & Optimization

- [ ] Optimize video quality and compression (AV1, adaptive streaming, reduce file size)
- [ ] Lazy/progressive loading for images and assets, blur-up effect
- [ ] Add service worker for offline support
- [ ] Bundle/code splitting, tree shaking, and font/image optimization

### Accessibility & Responsiveness

- [ ] Improve keyboard navigation and focus management
- [ ] Enhance screen reader support and ARIA labels
- [x] **Reduced Motion Support (July 2025)**: Added `reduceMotionEnabled` preference for accessibility
- [ ] Ensure mobile/touch-friendliness and legacy browser support

### Content Management & Analytics

- [ ] Add admin panel for content updates
- [ ] Support markdown for project descriptions
- [ ] Enable dynamic content loading from CMS
- [ ] Integrate analytics, performance monitoring, and user interaction tracking
- [ ] Add blog, social feed, and comment system

### Technical Debt & Quality

- [x] **Modern Theme System (July 2025)**: Complete overhaul with 4 themes (Moonlight, Daytime, Crimson, Forest)
- [x] **Two-Color Swatch Design (July 2025)**: Primary (interactive) + Secondary (background) color approach
- [x] **Lazy Loading & FOUC Prevention (July 2025)**: Individual theme files with optimal loading
- [x] **Comprehensive Preferences System (July 2025)**: Replaced legacy logic with a type-safe, extensible UserPreferences API
- [x] Split large components into smaller, reusable pieces
- [x] Organize components into logical subfolders
- [x] Standardize theming system across all components
- [x] Remove all hardcoded colors and fonts
- [x] Improve component documentation and single responsibility
- [ ] Improve documentation (Storybook, API docs, deployment guide)

---

## 📝 Ideas & Considerations

- Portfolio Analytics: Track which projects get the most views
- Internationalization: Multi-language support
- Progressive Web App: Add PWA capabilities
- AI Integration: ChatBot for project inquiries
- 3D Elements: WebGL project showcases
- Audio Integration: Background music system

---

## 📋 Changelog

### Completed

- Strict TypeScript Setup
- Clean Architecture (Provider-based state management)
- Theme System (Dynamic CSS variable generation)
- Mobile Responsive (Touch-friendly design)
- Video Background (Optimized video with preferences)
- Network Monitoring (Real-time connection stats)
- Professional UI (Game-inspired design system)
- **Component Organization (June 2025)**: Modular folder structure, single-responsibility components
- **Theme Consistency (June 2025)**: Standardized theming, removed hardcoded styling
- **UI Polish (June 2025)**: Improved network panel, refined gradients and spacing
- **Enhanced Navigation (July 2025)**: Letter-morphing text animations, instant reveal effects, integrated sound system, Patchnotes button with icon animations
- **Comprehensive User Preferences System (July 2025)**: Type-safe, extensible preference management with secure cookie persistence, replacing legacy VideoPreferences with modern UserPreferences API

---

_Last updated: July 2025_
