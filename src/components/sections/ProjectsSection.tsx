// Projects Section Component
// TODO: For mobile, implement an autocycle carousel (one card at a time, arrows, dots, auto-advance) in a future pass.
// Visual-only Gamemode Hub for projects
// Replaces filter/grid with four large gamemode cards (no functionality yet)

import { BackButton } from "../ui/navigation";
import { NavigableSectionComponent } from "../../types/SharedProps";
import GamemodeCard from "../projects/GamemodeCard";
import { User, Users, Trophy, Wrench } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
// No local React hooks needed here; keep lightweight
import { GAMEMODES, isGamemodeSlug } from "../../content/gamemodes";

interface AdditionalProjectsProps {}

/**
 * Projects section component - displays portfolio projects in a grid
 * @param onBack - Callback to navigate back to home
 * (Functionality intentionally omitted for this visual pass)
 */
const ProjectsSection: NavigableSectionComponent<AdditionalProjectsProps> = ({
  onBack,
  className,
  id,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const subpath = location.pathname.replace(/^\/projects\/?/, "");
  const modeSlug = subpath ? subpath.split("/")[0] : "";

  // Match main menu nav feel (Portfolio uses ~250ms). Keep local constant for now.
  const MODE_NAV_DELAY = 400;
  const goMode = (slug: string) => {
    window.setTimeout(() => navigate(`/projects/${slug}`), MODE_NAV_DELAY);
  };

  // (Icon row and featured banner removed per request)

  // Simple stub view when at /projects/:mode
  if (modeSlug && isGamemodeSlug(modeSlug)) {
    const meta = GAMEMODES[modeSlug];
    return (
      <div
        className={`max-w-6xl mx-auto transition-all duration-500 animate-fade-in select-none caret-transparent ${className ?? ""}`}
        id={id}
      >
        <BackButton onClick={() => navigate("/projects")} label="Back to Modes" />
        <h2 className="text-5xl font-extrabold mb-2 text-center game-title uppercase tracking-[0.2em]">
          {meta.gameLabel} / {meta.portfolioLabel}
        </h2>
  <p className="text-center game-subtitle theme-text-muted mb-10 text-lg">
          {meta.description}
        </p>
        <div className="theme-card-static rounded-xl p-8 text-center">
          <p className="theme-text">
            This is a placeholder page to verify navigation and transitions. Clicking a
            mode card takes you here. Next step: render filtered projects.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`max-w-6xl mx-auto transition-all duration-500 animate-fade-in select-none caret-transparent ${className ?? ""}`}
      id={id}
    >
      <BackButton onClick={onBack} label="Back to Home" />
      <div className="text-center mb-8 md:mb-10">
        <h2 className="game-title uppercase tracking-[0.3em] text-6xl md:text-7xl font-extrabold">
          Projects
        </h2>
        <div
          className="mx-auto mt-4 h-[3px] w-40 md:w-56 rounded-full opacity-80"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
        <p className="mt-5 tracking-wide text-base md:text-lg theme-text-muted">
          Browse Projects by Category
        </p>
      </div>
      {/* Featured/New banner (rectangular strip, skewed corners) */}
  <div className="relative w-full mb-12 md:mb-16 select-none" aria-hidden>
        {/* TODO: Turn this into an auto-cycling carousel of featured/new projects.
            Consider adding `featured?: boolean` and `createdAt?: string` to Project. */}
  <div className="relative overflow-hidden" style={{ borderRadius: 0 }}>
          <div className="relative w-full h-16 md:h-20 lg:h-24">
            <img
              src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1920&auto=format&fit=crop"
              alt="Featured banner background"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
            <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2">
              <div className="uppercase tracking-[0.25em] text-[12px] md:text-xs font-bold text-white/85 mb-1">
                Featured
              </div>
              <div className="game-title text-xl md:text-2xl lg:text-3xl font-extrabold">
                Spotlight coming soon
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* Gamemode Cards row */}
  <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 mt-16 md:mt-20">
        <GamemodeCard
          gameLabel="Singleplayer"
          portfolioLabel="Solo Projects"
          description="Personal projects focused on gameplay, audio, and tools."
          image="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(59 130 246)"  // blue
          morphSpeed={1.8}
          icon={User}
          onActivate={() => goMode("singleplayer")}
        />
        <GamemodeCard
          gameLabel="Multiplayer"
          portfolioLabel="Group Projects"
          description="Team-based works: networking, systems, collaboration."
          image="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(234 179 8)"   // amber / orange
          morphSpeed={1.8}
          icon={Users}
          onActivate={() => goMode("multiplayer")}
        />
        <GamemodeCard
          gameLabel="Competitive"
          portfolioLabel="Game Jams"
          description="Rapid, focused prototypes built under time pressure."
          image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(168 85 247)"  // purple
          morphSpeed={1.8}
          icon={Trophy}
          onActivate={() => goMode("competitive")}
        />
        <GamemodeCard
          gameLabel="Sandbox"
          portfolioLabel="Engine & Tools"
          description="Engine mods, editor tooling, audio & tech exploration."
          image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(34 197 94)"   // green
          morphSpeed={1.8}
          icon={Wrench}
          onActivate={() => goMode("sandbox")}
        />
      </div>
    </div>
  );
};

export default ProjectsSection;
