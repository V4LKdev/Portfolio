/**
 * NavigationContext.tsx
 *
 * Defines the navigation context interface and types for the portfolio application.
 * This context manages all navigation state including current section, selected projects,
 * mobile menu visibility, and project filtering functionality.
 *
 * Used by AppProviders to provide navigation state to all child components.
 */

import { createContext } from "react";
import { type Project } from "../content";

// -------------------- Navigation Types --------------------

/**
 * Navigation state interface defining all navigation-related data
 */
interface NavigationState {
  /** Current active section (home, projects, about, skills, contact, etc.) */
  currentSection: string;
  /** Currently selected project for detail view, null when no project selected */
  selectedProject: Project | null;
  /** Current filter applied to projects list */
  projectFilter: string;
  /** Mobile menu visibility state */
  isMobileMenuOpen: boolean;
}

/**
 * Navigation actions interface defining all navigation-related functions
 */
interface NavigationActions {
  /** Update the current active section */
  setCurrentSection: (section: string) => void;
  /** Set the selected project for detail view */
  setSelectedProject: (project: Project | null) => void;
  /** Update the project filter for projects list */
  setProjectFilter: (filter: string) => void;
  /** Toggle mobile menu visibility */
  setIsMobileMenuOpen: (open: boolean) => void;
  /** Handle navigation menu item clicks */
  handleMenuClick: (sectionId: string) => void;
  /** Handle project selection for detail view */
  handleProjectClick: (project: Project) => void;
  /** Handle back navigation from detail views */
  handleBackClick: () => void;
}

/**
 * Complete navigation context type combining state and actions
 */
export interface NavigationContextType
  extends NavigationState,
    NavigationActions {}

/**
 * Navigation context instance
 * Used by AppProviders to provide navigation functionality across the app
 */
export const NavigationContext = createContext<NavigationContextType | null>(
  null,
);
