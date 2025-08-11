/**
 * Portfolio.tsx
 *
 * Main component that renders the entire portfolio, including navigation, sections, and overlays.
 * Uses AppProviders to provide context to all other components.
 */
// Animation and UI timing constants
const MENU_NAV_DELAY = 250; // ms
const HOME_FOCUS_DELAY = 100; // ms

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
import BUILD_VERSION from "../../config/version";
import { useNavigation } from "../../hooks/useNavigation";
// (unused imports removed)
import { useNavigate, useLocation } from "react-router-dom";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import { useVideo } from "../../hooks/useVideo";

const ProjectDetail = React.lazy(() => import("../projects/ProjectDetail"));

const PortfolioContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playHover, playUnhover, playClick } = useSoundEffects();
  const { setUIPause } = useVideo();


  const getCurrentSectionFromPath = (pathname: string): string => {
    const trimmed = pathname.replace(/^\/+/, "");
    if (!trimmed) return "home";
    const first = trimmed.split("/")[0];
    return first || "home";
  };

  const urlSection = getCurrentSectionFromPath(location.pathname);

  const {
    currentSection,
    selectedProject,
    isMobileMenuOpen,
    setCurrentSection,
    setIsMobileMenuOpen,
    handleBackClick,
  } = useNavigation();

  useEffect(() => {
    if (urlSection !== currentSection) {
      setCurrentSection(urlSection);
    }
  }, [urlSection, currentSection, setCurrentSection]);

  // Pause background video when project detail overlay is open
  useEffect(() => {
    if (selectedProject) {
      setUIPause(true);
    } else {
      setUIPause(false);
    }
  }, [selectedProject, setUIPause]);

  // Handles navigation menu clicks, with optional delay for animated menus
  const handleMenuClick = (sectionId: string, hierarchy?: string) => {
    if (sectionId === "exit") {
      setTimeout(() => {
        navigate("/exit");
      }, MENU_NAV_DELAY);
      return;
    }
    const sectionRoutes: Record<string, string> = {
      home: "/",
      projects: "/projects",
      about: "/about",
      skills: "/skills",
      contact: "/contact",
      additional: "/additional",
    };
    const route = sectionRoutes[sectionId] || "/";
    const shouldDelay = hierarchy === "primary" || hierarchy === "secondary";
    if (shouldDelay) {
      setTimeout(() => {
        navigate(route);
      }, MENU_NAV_DELAY);
    } else {
      navigate(route);
    }
  };

  // Focuses the main menu anchor when returning to home section (for accessibility)
  useEffect(() => {
    if (currentSection === "home") {
      setTimeout(() => {
        const anchor = document.getElementById("main-menu-cursor-anchor");
        if (anchor) {
          anchor.focus({ preventScroll: true });
        }
      }, HOME_FOCUS_DELAY);
    }
  }, [currentSection]);
  const renderBaseContent = () => {
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

          <ServerConnectionPanel className="fixed top-16 md:top-20 right-6 md:right-8 z-30 hidden xl:block" />
          <SocialMediaIcons className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-30" />

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

    switch (currentSection) {
      case "projects":
        return (
          <SectionLayout section="projects">
            <ProjectsSection onBack={() => handleMenuClick("home")} />
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
    <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden">
      {currentSection === "home" && (
        <button
          onClick={() => {
            playClick();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          onMouseEnter={playHover}
          onMouseLeave={playUnhover}
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
      )}
      {/* Content or project detail (no overlay animation) */}
      {selectedProject ? (
        <SectionLayout
          section="projects"
          overlayVariant="deep"
          className="fixed inset-0 z-50"
          disablePadding
        >
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
      ) : (
        renderBaseContent()
      )}
      {currentSection === "home" && (
        <div className="fixed bottom-4 left-8 md:bottom-6 md:left-12 z-50 build-id text-xs font-mono select-none pointer-events-none">
          {BUILD_VERSION}
        </div>
      )}
      {isMobileMenuOpen && currentSection === "home" && (
        <button
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => {
            playClick();
            setIsMobileMenuOpen(false);
          }}
          onMouseEnter={playHover}
          onMouseLeave={playUnhover}
          aria-label="Close mobile menu overlay"
          tabIndex={0}
          type="button"
          style={{ cursor: "pointer" }}
        />
      )}
    </div>
  );
};

const Portfolio: React.FC = () => <PortfolioContent />;

export default Portfolio;
