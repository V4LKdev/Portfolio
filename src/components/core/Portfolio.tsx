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
import { getProjectByModeAndSlug } from "../../lib/contentLoader";
import { type GamemodeSlug } from "../../content/gamemodes";
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

  // Lightweight project route parsing: /projects/:mode/:slug
  const projectRoute = React.useMemo<null | { mode: GamemodeSlug; slug: string }>(() => {
    // Expect paths like /projects, /projects/mode, /projects/mode/slug
    if (!location.pathname.startsWith("/projects")) return null;
    const parts = location.pathname.replace(/^\/projects\/?/, "").split("/").filter(Boolean);
    if (parts.length === 2 && parts[0] && parts[1]) {
      const [mode, slug] = parts as [string, string];
      return { mode: mode as GamemodeSlug, slug };
    }
    return null;
  }, [location.pathname]);

  const {
    currentSection,
    selectedProject,
    isMobileMenuOpen,
    setCurrentSection,
    setIsMobileMenuOpen,
    handleBackClick,
    setSelectedProject,
  } = useNavigation();

  useEffect(() => {
    if (urlSection !== currentSection) {
      setCurrentSection(urlSection);
    }
  }, [urlSection, currentSection, setCurrentSection]);

  // Hydrate project detail from deep link: /projects/:mode/:slug
  useEffect(() => {
    let cancelled = false;
    const doHydrate = async () => {
      if (!projectRoute) return;
      if (suppressHydrateRef.current) {
        // Skip one cycle after manual close
        suppressHydrateRef.current = false;
        return;
      }
      // Ensure we are on projects section (so base layout present)
      if (currentSection !== "projects") {
        setCurrentSection("projects");
      }
      // If a different project already selected, allow switch (shareable links inside app)
      if (!selectedProject || selectedProject.slug !== projectRoute.slug) {
        const p = await getProjectByModeAndSlug(projectRoute.mode, projectRoute.slug);
        if (!cancelled) {
          if (p) {
            setSelectedProject(p);
            lastHydratedRef.current = projectRoute.slug;
          } else {
            // Not found: navigate back to mode list or root projects
            // If mode provided, drop slug; else fallback to /projects
            const base = `/projects/${projectRoute.mode}`;
            navigate(base, { replace: true });
          }
        }
      }
    };
    void doHydrate();
    return () => { cancelled = true; };
  }, [projectRoute, currentSection, selectedProject, setCurrentSection, setSelectedProject, navigate]);

  // Track last hydrated slug & suppression flag
  const lastHydratedRef = React.useRef<string | null>(null);
  const suppressHydrateRef = React.useRef(false);

  // Wrap back handler to flag suppression before clearing selection
  const handleProjectBack = React.useCallback(() => {
    if (selectedProject) {
      suppressHydrateRef.current = true;
      setSelectedProject(null);
    } else {
      handleBackClick();
    }
  }, [selectedProject, setSelectedProject, handleBackClick]);

  // When closing project detail (handleBackClick sets selectedProject null), clean URL if slug present
  useEffect(() => {
    if (!selectedProject && projectRoute) {
      // If we were at /projects/:mode/:slug, go back to /projects/:mode (retain mode context)
      navigate(`/projects/${projectRoute.mode}`, { replace: true });
    }
  // Only respond to selectedProject changes & pathname deep-link state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

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
            <ProjectDetail project={selectedProject} onBack={handleProjectBack} />
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
