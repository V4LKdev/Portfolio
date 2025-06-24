// NavigationProvider.tsx
// Professional navigation state management
// Handles section switching, mobile menu, and project selection

import * as React from "react";
import { createContext, useContext, useState, useMemo } from "react";
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

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

/**
 * Provides centralized navigation state management
 * Features:
 * - Section navigation
 * - Project selection and filtering
 * - Mobile menu state
 * - Smart back navigation
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  // --- Navigation State ---
  const [currentSection, setCurrentSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Navigation Actions ---
  const handleMenuClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    setSelectedProject(null);
    setIsMobileMenuOpen(false);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    if (selectedProject) {
      setSelectedProject(null);
    } else {
      setCurrentSection("home");
    }
  };

  const value: NavigationContextType = useMemo(() => ({
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
  }), [
    currentSection,
    selectedProject,
    projectFilter,
    isMobileMenuOpen,
  ]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
