// Projects Section Component
// TODO: For mobile, implement an autocycle carousel (one card at a time, arrows, dots, auto-advance) in a future pass.
// Visual-only Gamemode Hub for projects
// Replaces filter/grid with four large gamemode cards (no functionality yet)

import React, { useContext } from "react";
import { BackButton } from "../ui/navigation";
import { NavigableSectionComponent } from "../../types/SharedProps";
import GamemodeCard from "../projects/GamemodeCard";
import { User, Users, Trophy, Wrench, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { MotionContext } from "../../contexts/MotionContext";
import { GAMEMODES, isGamemodeSlug } from "../../content/gamemodes";
import { useSoundEffects } from "../../hooks/useSoundEffects";

interface AdditionalProjectsProps {}

type Slide = {
  id: string;
  kind: "featured" | "new";
  title: string;
  subtitle?: string;
  image: string;
};

const FeaturedCarousel: React.FC<{
  slides: Slide[];
  className?: string;
}> = ({ slides, className }) => {
  const motion = useContext(MotionContext);
  const reduce = motion?.reduceMotion;
  const [index, setIndex] = React.useState(0);
  const timerRef = React.useRef<number | null>(null);
  const count = slides.length;
  const { playHover, playUnhover, playClick } = useSoundEffects();

  const clear = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const start = () => {
    if (reduce || count <= 1) return;
    clear();
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 6000);
  };

  React.useEffect(() => {
    start();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, reduce]);

  const go = (i: number) => setIndex(((i % count) + count) % count);
  const next = () => {
    playClick();
    go(index + 1);
  };
  const prev = () => {
    playClick();
    go(index - 1);
  };

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <div className="flex items-center justify-center gap-2 md:gap-3">
        {count > 1 && (
          <button
            type="button"
            onClick={prev}
            className="p-2 rounded-md bg-black/35 hover:bg-black/50 text-white"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div
          className="group relative w-[92%] md:w-[86%] lg:w-[72%] h-16 md:h-20 lg:h-24 overflow-hidden transform-gpu origin-center will-change-transform transition-transform duration-150 hover:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none"
          onMouseEnter={clear}
          onMouseLeave={start}
          onFocus={clear}
          onBlur={start}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured projects"
        >
          <div
            className="absolute inset-0 flex transition-transform duration-200 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s) => (
              <div key={s.id} className="relative w-full h-full flex-shrink-0">
                <button
                  className="absolute inset-0 w-full h-full cursor-pointer text-left"
                  onClick={() => {
                    playClick();
                  }}
                  onMouseEnter={() => playHover()}
                  onMouseLeave={() => playUnhover()}
                  onFocus={() => playHover()}
                  onBlur={() => playUnhover()}
                  aria-label={`${s.kind === "featured" ? "Featured" : "New"}: ${s.title}`}
                >
                  <img
                    src={s.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
                  <div className="absolute inset-y-0 left-6 md:left-8 flex items-center" style={{ transform: "translateZ(0)" }}>
                    <div>
                      <div className="uppercase tracking-[0.25em] text-[12px] md:text-xs font-bold text-white/85 mb-1">
                      {s.kind === "featured" ? "Featured" : "New"}
                      </div>
                      <div
                        className="game-title text-xl md:text-2xl lg:text-3xl font-extrabold leading-none"
                        style={{ WebkitFontSmoothing: "antialiased", textRendering: "optimizeLegibility" as any }}
                      >
                        {s.title}
                      </div>
                      {s.subtitle && (
                        <div className="theme-text-muted text-[11px] md:text-xs mt-0.5 leading-snug">
                          {s.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
          {/* subtle hover glow without scaling */}
          <div className="pointer-events-none absolute inset-0 ring-0 transition-all duration-150 group-hover:ring-1 group-hover:ring-white/60 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.35)]" />
        </div>
        {count > 1 && (
          <button
            type="button"
            onClick={next}
            className="p-2 rounded-md bg-black/35 hover:bg-black/50 text-white"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
      {count > 1 && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                playClick();
                go(i);
              }}
              onMouseEnter={() => playHover()}
              onMouseLeave={() => playUnhover()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
      {/* Featured/New banner carousel */}
      <FeaturedCarousel
        className="mb-12 md:mb-16"
        slides={[
          {
            id: "s1",
            kind: "featured",
            title: "Spotlight coming soon",
            subtitle: undefined,
            image:
              "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1920&auto=format&fit=crop",
          },
          {
            id: "s2",
            kind: "new",
            title: "New project coming soon",
            subtitle: undefined,
            image:
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop",
          },
        ]}
      />

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
