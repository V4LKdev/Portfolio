// Content Index
// Central export file for all portfolio content
// Import from this file to get all content in one place

// --- Type Exports ---
export type { Project, ProjectTab, Section } from "./projects";

// --- Content Exports ---
export { projects } from "./projects";
export { personalInfo, resumeFileName } from "./personal";
export { aboutContent } from "./about";
export { skillsContent } from "./skills";
export { navigationItems, videoConfig } from "./ui-config";

// --- Content File Locations ---
// projects.ts      - Portfolio project data
// personal.ts      - Personal information and contact details
// about.ts         - About page content and bio
// skills.ts        - Technical skills and tool lists
// ui-config.ts     - UI elements, backgrounds, and navigation
