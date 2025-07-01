// UI Configuration
// Contains background images, navigation items, and other UI-related data
// Edit this file to change visual elements and navigation structure

// --- Background Images for Different Sections ---
export const backgroundImages = {
  projects:
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80",
  about:
    "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=1920&q=80",
  skills:
    "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=1920&q=80",
  contact:
    "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1920&q=80",
  additional:
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80",
};

// --- Navigation Menu Items ---
// Game-style navigation with hover text changes and button hierarchy
export const navigationItems = [
  {
    id: "projects",
    label: "Projects",
    section: "projects",
    gameLabel: "Play",
    hoverLabel: "Projects",
    hierarchy: "primary", // Largest - main action
  },
  {
    id: "about",
    label: "About Me",
    section: "about",
    gameLabel: "Profile",
    hoverLabel: "About Me",
    hierarchy: "secondary", // Medium - important sections
  },
  {
    id: "contact",
    label: "Contact",
    section: "contact",
    gameLabel: "Social",
    hoverLabel: "Contact",
    hierarchy: "secondary", // Medium - important sections
  },
  {
    id: "skills",
    label: "Skills & Tools",
    section: "skills",
    gameLabel: "Achievements",
    hoverLabel: "Skills & CV",
    hierarchy: "secondary", // Medium - important sections
  },
  {
    id: "additional",
    label: "Additional Content",
    section: "additional",
    gameLabel: "Extras",
    hoverLabel: "Hobbies",
    hierarchy: "tertiary", // Smaller - less important
  },
  {
    id: "patchnotes",
    label: "Patchnotes",
    section: "patchnotes",
    gameLabel: "Patchnotes",
    hoverLabel: "News",
    hierarchy: "patchnotes", // Special styling with icon
    hasIcon: true,
  },
  {
    id: "exit",
    label: "Exit",
    section: "exit",
    gameLabel: "Quit",
    hoverLabel: "Quit",
    hierarchy: "quit", // Special styling - smallest and grey
    hasIcon: true,
  },
];

// --- Video Configuration ---
export const videoConfig = {
  // Local video file path (relative to public directory)
  localVideoSrc: "/videos/PlaceholderClip.mp4",
  // Fallback poster image
  posterSrc:
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80",
  // Legacy YouTube video ID (for reference)
  youtubeVideoId: "f3st1DfrvIc",
  // Default states
  defaultMuted: true,
  defaultPaused: false,
};
