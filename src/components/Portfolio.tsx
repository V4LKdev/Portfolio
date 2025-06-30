/**
 * Portfolio.tsx
 * Main portfolio component - refactored to use layout system
 * Uses providers for state management and new layout components for consistency
 */

import * as React from "react";
import { useEffect, Suspense } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { HomeLayout, SectionLayout } from "./layout";
import ServerConnectionPanel from "./ServerConnectionPanel";
import SocialMediaIcons from "./SocialMediaIcons";
import HomeSection from "./sections/HomeSection";
import ProjectsSection from "./sections/ProjectsSection";
import AboutSection from "./sections/AboutSection";
import SkillsSection from "./sections/SkillsSection";
import ContactSection from "./sections/ContactSection";
import SettingsPanel from "./SettingsPanel";
import BUILD_VERSION from "../config/version";
import { AppProviders } from "./AppProviders";
import { useNavigation } from "../hooks/useNavigation";
import { getProjects } from "../lib/contentLoader";
import { type Project } from "../content";
import { navigationItems } from "../content";

// Lazy load ProjectDetail component for better initial bundle size
const ProjectDetail = React.lazy(() => import("./ProjectDetail"));

/**
 * Main portfolio layout component
 * Now focused purely on layout and rendering, with state managed by providers
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
                <div className="flex items-center space-x-3 text-amber-200 bg-black/60 backdrop-blur-sm rounded-lg px-6 py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-200 border-t-transparent"></div>
                  <span className="text-sm font-medium">Loading project details...</span>
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
            <MemoizedNavigationMenu
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
          <ServerConnectionPanel className="fixed top-6 md:top-8 right-6 md:right-8 z-30 hidden xl:block" />
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

// --- Navigation Menu Component ---
interface NavigationMenuProps {
  isOpen: boolean;
  currentSection: string;
  onMenuClick: (sectionId: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isOpen,
  currentSection,
  onMenuClick,
}) => (
  <nav
    id="mobile-navigation"
    className={`fixed left-0 top-0 h-full w-sidebar z-40 transition-transform duration-300 lg:translate-x-0 no-select ${
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    }`}
  >
    <div className="h-full bg-gradient-to-r from-black/95 via-black/85 via-black/75 via-black/60 via-black/45 via-black/30 via-black/18 via-black/8 to-transparent no-select">
      {/* Logo Area */}
      <div className="pt-14 md:pt-20 pb-12 md:pb-16 lg:pb-20 px-8 md:px-12 no-select">
        <h1 className="deadlock-title mb-1 text-3xl md:text-4xl lg:text-5xl no-select">
          NICOLAS MARTIN
        </h1>
        <p
          className="text-base md:text-lg lg:text-xl tracking-wide font-medium no-select"
          style={{
            fontFamily: "Good Timing, serif",
            color: "var(--theme-subtitle, rgb(253 230 138 / 0.8))",
          }}
        >
          Game Programmer
        </p>
      </div>

      {/* Menu Items */}
      <div className="px-8 md:px-12 no-select">
        {navigationItems.map((item) => {
          const getButtonSpacing = () => {
            if (item.hierarchy === "primary") return "mb-6 md:mb-8";
            if (item.hierarchy === "quit") return "mt-8 md:mt-12 mb-2 md:mb-3";
            return "mb-3 md:mb-4";
          };

          return (
            <button
              key={item.id}
              onClick={() => onMenuClick(item.section)}
              className={`deadlock-menu-item menu-${item.hierarchy} group menu-button transition-all duration-300 relative block w-full text-left no-select ${
                currentSection === item.section
                  ? "text-amber-100 text-shadow-glow"
                  : ""
              } ${getButtonSpacing()}`}
              type="button"
              tabIndex={0}
              aria-current={
                currentSection === item.section ? "page" : undefined
              }
            >
              <div className="relative flex items-center gap-2">
                {item.hierarchy === "quit" && (
                  <LogOut className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-300 transition-colors duration-300" />
                )}
                <div className="relative">
                  <span className="block group-hover:opacity-0 transition-opacity duration-300 no-select">
                    {item.gameLabel}
                  </span>
                  <span className="absolute top-0 left-0 w-full group-hover:opacity-100 opacity-0 transition-opacity duration-300 no-select">
                    {item.hoverLabel}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Settings Panel */}
      <SettingsPanel className="absolute bottom-12 md:bottom-14 left-8 md:left-12" />
    </div>
  </nav>
);

// Memoize NavigationMenu to prevent unnecessary re-renders
const MemoizedNavigationMenu = React.memo(NavigationMenu);

// --- Additional Section Components ---
const AdditionalSection: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="max-w-4xl mx-auto">
    <button
      onClick={onBack}
      className="mb-8 flex items-center space-x-2 theme-back-button"
    >
      <span>← Back to Home</span>
    </button>
    <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center deadlock-title">
      ADDITIONAL CONTENT
    </h2>
    <div className="theme-card rounded-lg p-6 md:p-8 atmospheric-glow text-center">
      <p className="text-lg md:text-xl theme-text mb-6 md:mb-8">
        This section is reserved for future content including music career,
        creative projects, and other endeavors beyond programming.
      </p>
      <p className="theme-text-muted">Coming soon...</p>
    </div>
  </div>
);

const ExitSection: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="text-center max-w-4xl">
    <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 deadlock-title">
      GOODBYE
    </h2>
    <p className="text-lg md:text-xl theme-text mb-6 md:mb-8">
      Thanks for visiting my portfolio. May your games be legendary!
    </p>
    <button
      onClick={onBack}
      className="theme-button px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold"
    >
      Return Home
    </button>
  </div>
);

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
