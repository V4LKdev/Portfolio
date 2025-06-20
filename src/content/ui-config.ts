// UI Configuration
// Contains background images, navigation items, and other UI-related data
// Edit this file to change visual elements and navigation structure

// --- Background Images for Different Sections ---
export const backgroundImages = {
  projects: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
  about: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=1920&q=80',
  skills: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=1920&q=80',
  contact: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1920&q=80',
  additional: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80'
};

// --- Navigation Menu Items ---
// Game-style navigation with hover text changes
export const navigationItems = [
  { id: 'projects', label: 'Projects', section: 'projects', gameLabel: 'Play', hoverLabel: 'Projects' },
  { id: 'about', label: 'About Me', section: 'about', gameLabel: 'Profile', hoverLabel: 'About Me' },
  { id: 'skills', label: 'Skills & Tools', section: 'skills', gameLabel: 'Achievements', hoverLabel: 'Skills & CV' },
  { id: 'additional', label: 'Additional Content', section: 'additional', gameLabel: 'DLC', hoverLabel: 'Hobbies' },
  { id: 'contact', label: 'Contact', section: 'contact', gameLabel: 'Chat', hoverLabel: 'Contact' },
  { id: 'exit', label: 'Exit', section: 'exit', gameLabel: 'Quit', hoverLabel: 'Quit' }
];

// --- Video Configuration ---
export const videoConfig = {
  // YouTube video ID for background video on home page
  youtubeVideoId: 'f3st1DfrvIc',
  // Default states
  defaultMuted: true,
  defaultPaused: false
};
