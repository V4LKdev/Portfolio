/**
 * Portfolio.tsx
 * Main portfolio component with game-inspired navigation
 * Features clean layout system with provider-based state management
 */

import * as React from "react";
import { useEffect, Suspense } from "react";
import { Menu, X } from "lucide-react";
import { HomeLayout, SectionLayout } from "../layout";
import { MainNavigation } from "../navigation";
import ServerConnectionPanel from "../panels/ServerConnectionPanel";
import SocialMediaIcons from "../media/SocialMediaIcons";
import HomeSection from "../sections/HomeSection";
import ProjectsSection from "../sections/ProjectsSection";
import AboutSection from "../sections/AboutSection";
import SkillsSection from "../sections/SkillsSection";
import ContactSection from "../sections/ContactSection";
import AdditionalSection from "../sections/AdditionalSection";
import ExitSection from "../sections/ExitSection";
import BUILD_VERSION from "../../config/version";
import AppProviders from "./AppProviders";
import { useNavigation } from "../../hooks/useNavigation";
import { getProjects } from "../../lib/contentLoader";
import { type Project } from "../../content";

// Lazy load ProjectDetail component for better initial bundle size
const ProjectDetail = React.lazy(() => import("../projects/ProjectDetail"));

/**
 * Main portfolio content component
 * Handles routing between different sections and manages project state
 */
const PortfolioContent: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const {
    currentSection,
    selectedProject,
    projectFilter,
    isMobileMenuOpen,
    setProjectFilter,
    setIsMobileMenuOpen,
    handleMenuClick,
    handleProjectClick,
    handleBackClick,
  } = useNavigation();

  // Focus cursor to bottom-right when on home page
  useEffect(() => {
    if (currentSection === "home") {
      setTimeout(() => {
        const anchor = document.getElementById("main-menu-cursor-anchor");
        if (anchor) {
          anchor.focus({ preventScroll: true });
        }
      }, 100);
    }
  }, [currentSection]);
  // --- Content Rendering ---
  const renderContent = () => {
    // Project detail page (overlay-style)
    if (selectedProject) {
      return (
        <SectionLayout section="projects" className="fixed inset-0 z-50">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-3 theme-text bg-black/60 backdrop-blur-sm rounded-lg px-6 py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-200 border-t-transparent"></div>
                  <span className="text-sm font-medium">
                    Loading project details...
                  </span>
                </div>
              </div>
            }
          >
            <ProjectDetail project={selectedProject} onBack={handleBackClick} />
          </Suspense>
        </SectionLayout>
      );
    } // Home page with video background and navigation
    if (currentSection === "home") {
      return (
        <HomeLayout
          menu={
            <MainNavigation
              isOpen={isMobileMenuOpen}
              currentSection={currentSection}
              onMenuClick={handleMenuClick}
            />
          }
        >
          <HomeSection
            onNavigateToProjects={() => handleMenuClick("projects")}
          />

          {/* Additional home page elements */}
          <ServerConnectionPanel className="fixed top-16 md:top-20 right-6 md:right-8 z-30 hidden xl:block" />
          <SocialMediaIcons className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-30" />

          {/* Focus anchor */}
          <div
            id="main-menu-cursor-anchor"
            tabIndex={-1}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "1px",
              height: "1px",
              opacity: 0,
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />
        </HomeLayout>
      );
    }

    // Section pages with static backgrounds
    switch (currentSection) {
      case "projects":
        return (
          <SectionLayout section="projects">
            <ProjectsSection
              projects={projects}
              onBack={() => handleMenuClick("home")}
              onProjectClick={handleProjectClick}
              projectFilter={projectFilter}
              onFilterChange={setProjectFilter}
            />
          </SectionLayout>
        );
      case "about":
        return (
          <SectionLayout section="about">
            <AboutSection onBack={() => handleMenuClick("home")} />
          </SectionLayout>
        );
      case "skills":
        return (
          <SectionLayout section="skills">
            <SkillsSection onBack={() => handleMenuClick("home")} />
          </SectionLayout>
        );
      case "contact":
        return (
          <SectionLayout section="contact">
            <ContactSection onBack={() => handleMenuClick("home")} />
          </SectionLayout>
        );
      case "additional":
        return (
          <SectionLayout section="projects">
            <AdditionalSection onBack={() => handleMenuClick("home")} />
          </SectionLayout>
        );
      case "exit":
        return (
          <SectionLayout section="projects">
            <ExitSection onBack={() => handleMenuClick("home")} />
          </SectionLayout>
        );
      default:
        return (
          <HomeLayout>
            <HomeSection
              onNavigateToProjects={() => handleMenuClick("projects")}
            />
          </HomeLayout>
        );
    }
  };
  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden">
      {/* Mobile Menu Button for Home Page */}
      {currentSection === "home" && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 md:top-6 md:left-6 z-50 lg:hidden theme-panel p-3 rounded-lg transition-all duration-300"
          aria-label={
            isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 theme-icon" />
          ) : (
            <Menu className="w-6 h-6 theme-icon" />
          )}
        </button>
      )}{" "}
      {/* Render Content with Layout */}
      {renderContent()}{" "}
      {/* Build Version - only show on home page, positioned above navigation gradient */}
      {currentSection === "home" && (
        <div className="fixed bottom-4 left-8 md:bottom-6 md:left-12 z-50 build-id text-xs font-mono select-none pointer-events-none">
          {BUILD_VERSION}
        </div>
      )}
      {/* Mobile Menu Overlay for Home Page */}
      {isMobileMenuOpen && currentSection === "home" && (
        <button
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close mobile menu overlay"
          tabIndex={0}
          type="button"
          style={{ cursor: "pointer" }}
        />
      )}
    </div>
  );
};

// --- Main Portfolio Component with Providers ---
/**
 * Main Portfolio component with provider-based architecture
 * Renders the complete portfolio application with proper state management
 */
const Portfolio: React.FC = () => (
  <AppProviders>
    <PortfolioContent />
  </AppProviders>
);

export default Portfolio;
