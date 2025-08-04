import { useState, useCallback, useMemo, useEffect } from "react";
import { type Project } from "../content";

/**
 * useNavigationSync
 * Encapsulates navigation state and logic: section, project, filter, mobile menu, and video pause sync.
 */
export function useNavigationSync() {
  const [currentSection, setCurrentSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pauseStateBeforeNavigation, setPauseStateBeforeNavigation] = useState<
    boolean | null
  >(null);
  // Video sync logic should be handled in VideoProvider; this is a placeholder for future integration if needed.

  // Navigation Effects - Auto-pause when leaving home, auto-resume when returning
  useEffect(() => {
    if (currentSection !== "home") {
      setPauseStateBeforeNavigation(isManuallyPaused);
      setIsPaused(true);
    }
  }, [currentSection, isManuallyPaused, setIsPaused]);

  useEffect(() => {
    if (currentSection === "home" && pauseStateBeforeNavigation !== null) {
      setIsPaused(pauseStateBeforeNavigation);
      setPauseStateBeforeNavigation(null);
    }
  }, [currentSection, pauseStateBeforeNavigation, setIsPaused]);

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

  return useMemo(
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
}
