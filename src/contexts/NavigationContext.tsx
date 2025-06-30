/**
 * Navigation Context
 * Manages navigation state and actions across the application
 */

import { createContext } from "react";
import { type Project } from "../content";

// -------------------- Navigation Context --------------------

interface NavigationState {
  currentSection: string;
  selectedProject: Project | null;
  projectFilter: string;
  isMobileMenuOpen: boolean;
}

interface NavigationActions {
  setCurrentSection: (section: string) => void;
  setSelectedProject: (project: Project | null) => void;
  setProjectFilter: (filter: string) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleMenuClick: (sectionId: string) => void;
  handleProjectClick: (project: Project) => void;
  handleBackClick: () => void;
}

export interface NavigationContextType
  extends NavigationState,
    NavigationActions {}

export const NavigationContext = createContext<NavigationContextType | null>(
  null,
);
