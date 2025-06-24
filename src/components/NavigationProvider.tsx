// NavigationProvider.tsx
// Professional navigation state management
// Handles section switching, mobile menu, and project selection

import * as React from "react";
import { createContext, useState, useMemo, useCallback } from "react";
import { type Project } from "../content";

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

interface NavigationContextType extends NavigationState, NavigationActions {}

export const NavigationContext = createContext<NavigationContextType | null>(
  null,
);

interface NavigationProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Provides centralized navigation state management
 * Features:
 * - Section navigation
 * - Project selection and filtering
 * - Mobile menu state
 * - Smart back navigation
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
  // --- Navigation State ---
  const [currentSection, setCurrentSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // --- Navigation Actions ---
  const handleMenuClick = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
    setSelectedProject(null);
    setIsMobileMenuOpen(false);
  }, []);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleBackClick = useCallback(() => {
    if (selectedProject) {
      setSelectedProject(null);
    } else {
      setCurrentSection("home");
    }
  }, [selectedProject]);

  const value: NavigationContextType = useMemo(
    () => ({
      currentSection,
      selectedProject,
      projectFilter,
      isMobileMenuOpen,
      setCurrentSection,
      setSelectedProject,
      setProjectFilter,
      setIsMobileMenuOpen,
      handleMenuClick,
      handleProjectClick,
      handleBackClick,
    }),
    [
      currentSection,
      selectedProject,
      projectFilter,
      isMobileMenuOpen,
      handleMenuClick,
      handleProjectClick,
      handleBackClick,
    ],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}
