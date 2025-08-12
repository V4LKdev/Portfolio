// Projects Section Component
// NOTE: For mobile, consider an autocycle carousel (one card at a time, arrows, dots, auto-advance) in a future pass.
// Visual-only Gamemode Hub for projects
// Replaces filter/grid with four large gamemode cards (no functionality yet)

import React, { useContext } from "react";
import { BackButton } from "../ui/navigation";
import { NavigableSectionComponent } from "../../types/SharedProps";
import GamemodeCard from "../projects/GamemodeCard";
import {
  User,
  Users,
  Trophy,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { MotionContext } from "../../contexts/MotionContext";
import {
  GAMEMODES,
  isGamemodeSlug,
  type GamemodeSlug,
} from "../../content/gamemodes";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import ProjectGrid from "../projects/ProjectGrid";
import FilterPopup from "./FilterPopup";
import {
  getFeaturedSlides,
  getProjectsByMode,
  getProjects,
  normalizeProject,
} from "../../lib/contentLoader";
import { type Project } from "../../content";
import { useNavigation } from "../../hooks/useNavigation";

// No extra props for now; use empty object type so intersection with NavigableSectionProps
// does NOT forbid standard props like onBack.
// (Previously used Record<string, never> which caused 'onBack' to be type 'never').
type AdditionalProjectsProps = {};

type Slide = {
  id: string;
  kind: "featured" | "new";
  title: string;
  subtitle?: string;
  image: string;
  // Optional extras for navigation/presentation
  mode?: GamemodeSlug;
  slug?: string;
  tags?: string[];
};

const FeaturedCarousel: React.FC<{
  slides: Slide[];
  className?: string;
  onOpen?: (s: Slide) => void;
}> = ({ slides, className, onOpen }) => {
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
        <section
          className="group relative w-[92%] md:w-[86%] lg:w-[72%] h-20 md:h-24 lg:h-28 overflow-hidden transform-gpu origin-center will-change-transform transition-transform duration-150 hover:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none rounded-xl"
          onMouseEnter={clear}
          onMouseLeave={start}
          onFocus={clear}
          onBlur={start}
          aria-label="Featured projects carousel"
        >
          <div
            className="absolute inset-0 flex transition-transform duration-150 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s) => (
              <div key={s.id} className="relative w-full h-full flex-shrink-0">
                <button
                  className="absolute inset-0 w-full h-full cursor-pointer text-left"
                  onClick={() => {
                    playClick();
                    onOpen?.(s);
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
                  {/* (Gradient overlay removed per request) */}
                  <div
                    className="absolute inset-y-0 left-6 md:left-8 right-6 md:right-8 flex items-center"
                    style={{ transform: "translateZ(0)" }}
                  >
                    <div>
                      {/* Badge (text-only, no pill background) */}
                      <div className="inline-flex items-center text-white text-sm md:text-base font-extrabold tracking-widest mb-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                        {s.kind === "featured" ? "FEATURED" : "NEW"}
                      </div>
                      <div
                        className="game-title text-2xl md:text-3xl lg:text-4xl font-extrabold leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
                        style={{
                          WebkitFontSmoothing: "antialiased",
                          textRendering: "optimizeLegibility" as any,
                        }}
                      >
                        {s.title}
                      </div>
                    </div>
                  </div>
                  {/* Tags at bottom-right */}
                  {s.tags && s.tags.length > 0 && (
                    <div className="absolute bottom-2 right-4 md:bottom-3 md:right-6 flex flex-wrap gap-1.5">
                      {s.tags.slice(0, 3).map((t) => (
                        <span
                          key={`${s.id}-br-${t}`}
                          className="px-2 py-0.5 rounded-full text-[10px] md:text-xs text-white/90 bg-black/45"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
          {/* hover outline removed per request */}
  </section>
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
          {slides.map((s, i) => (
            <button
              key={`dot-${s.id}`}
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
const DEBUG_LOGS = false; // set true to enable verbose debug logs

const ProjectsSection: NavigableSectionComponent<AdditionalProjectsProps> = ({
  onBack,
  className,
  id,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const subpath = location.pathname.replace(/^\/projects\/?/, "");
  const modeSlug = subpath ? subpath.split("/")[0] : "";
  const { handleProjectClick } = useNavigation();

  // Match main menu nav feel (Portfolio uses ~250ms). Keep local constant for now.
  const MODE_NAV_DELAY = 400;
  const goMode = (slug: string) => {
    window.setTimeout(() => navigate(`/projects/${slug}`), MODE_NAV_DELAY);
  };

  // (Icon row and featured banner removed per request)

  // --- Mode list state (must be declared unconditionally to keep Hook order stable) ---
  type NormalizedProject = Project & {
    slug: string;
    gamemode: GamemodeSlug;
    cover: string;
  };
  type CardItem = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    image: string;
    slug: string;
    mode: GamemodeSlug;
  };
  const [list, setList] = React.useState<CardItem[]>([]);
  const [raw, setRaw] = React.useState<NormalizedProject[]>([]);
  // Filter/sort state
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [showCompleted, setShowCompleted] = React.useState(false);
  type SortOption = 'recent' | 'oldest' | 'title-az' | 'title-za' | 'completed';
  const [sortOrder, setSortOrder] = React.useState<SortOption>('recent');

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (modeSlug && isGamemodeSlug(modeSlug)) {
  const items = await getProjectsByMode(modeSlug);
        if (!cancelled) {
          setRaw(items as unknown as NormalizedProject[]);
          setList(
            items.map((p) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              tags: p.tags,
              image: (p as any).cover,
              slug: (p as any).slug,
              mode: (p as any).gamemode as GamemodeSlug,
            })),
          );
        }
      } else {
        // Not on a mode page; clear list state
        setRaw([]);
        setList([]);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [modeSlug]);

  // Sync URL param /projects/:mode/:slug with overlay detail
  // URL syncing moved to Portfolio; this component is now stateless regarding selection

  // When opening a project from a card, navigate and set selectedProject
  const openProject = React.useCallback(
    (
      p: { slug: string; mode: GamemodeSlug },
      full?: Project,
    ) => {
      if (DEBUG_LOGS) {
        console.debug("[ProjectsSection] Open project", {
          mode: p.mode,
          slug: p.slug,
          hasFull: !!full,
        });
      }
      
      // Set the selected project in navigation context
      if (full) {
        handleProjectClick(full);
      }
      
      // Navigate to the project detail URL
      navigate(`/projects/${p.mode}/${p.slug}`);
    },
    [navigate, handleProjectClick],
  );

  // Local state for filter dropdown (must be before any returns)
  const [showFilter, setShowFilter] = React.useState(false);

  // Simple view when at /projects/:mode — now renders a grid of projects
  if (modeSlug && isGamemodeSlug(modeSlug)) {
    const meta = GAMEMODES[modeSlug];
    // Compute filtered/sorted projects
    let filtered = list;
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => selectedTags.every(tag => p.tags.includes(tag)));
    }
    if (showCompleted) {
      filtered = filtered.filter(p => {
        const full = raw.find(r => r.slug === p.slug);
        return full && (full.status === 'Complete' || full.status === 'Completed');
      });
    }
    switch (sortOrder) {
      case 'title-az':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-za':
        filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => {
          const ra = raw.find(r => r.slug === a.slug);
          const rb = raw.find(r => r.slug === b.slug);
          const da = ra && ra.createdAt ? Date.parse(ra.createdAt) : 0;
          const db = rb && rb.createdAt ? Date.parse(rb.createdAt) : 0;
          return da - db;
        });
        break;
      case 'completed':
        filtered = [...filtered].sort((a, b) => {
          const ra = raw.find(r => r.slug === a.slug);
          const rb = raw.find(r => r.slug === b.slug);
          const sa = ra && ra.status ? ra.status : '';
          const sb = rb && rb.status ? rb.status : '';
          // Completed first, then by most recent
          if (sa === sb) {
            const da = ra && ra.createdAt ? Date.parse(ra.createdAt) : 0;
            const db = rb && rb.createdAt ? Date.parse(rb.createdAt) : 0;
            return db - da;
          }
          if (sa === 'Complete' || sa === 'Completed') return -1;
          if (sb === 'Complete' || sb === 'Completed') return 1;
          return 0;
        });
        break;
      case 'recent':
      default:
        filtered = [...filtered].sort((a, b) => {
          const ra = raw.find(r => r.slug === a.slug);
          const rb = raw.find(r => r.slug === b.slug);
          const da = ra && ra.createdAt ? Date.parse(ra.createdAt) : 0;
          const db = rb && rb.createdAt ? Date.parse(rb.createdAt) : 0;
          return db - da;
        });
        break;
    }
    return (
      <div
        className={`max-w-6xl mx-auto transition-all duration-500 animate-fade-in select-none caret-transparent ${className ?? ""}`}
        id={id}
      >
        <BackButton
          onClick={() => navigate("/projects")}
          label="Back to Modes"
        />

        {/* Mode header: glass panel with large icon and accent */}

        <section
          className="relative mt-2 mb-10 overflow-visible rounded-2xl shadow-xl"
          style={{
            border: `2.5px solid ${meta.accent}`,
            background: 'none',
          }}
        >
          {/* Accent line */}
          {/* Removed top accent line as requested */}

          {/* Prominent icon left of title */}
          <div className="flex items-center gap-7 px-5 sm:px-8 pt-7 pb-2">
            <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 96, height: 96 }}>
              {(() => {
                const size = 72;
                const iconStyle = { filter: 'grayscale(1)', color: '#bfc3d1' };
                switch (meta.iconKey) {
                  case "user":
                    return <User size={size} style={iconStyle} />;
                  case "users":
                    return <Users size={size} style={iconStyle} />;
                  case "trophy":
                    return <Trophy size={size} style={iconStyle} />;
                  default:
                    return <Wrench size={size} style={iconStyle} />;
                }
              })()}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-0.5">
                Projects • {meta.gameLabel}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="game-title text-4xl sm:text-5xl font-extrabold tracking-[0.12em]" style={{ textShadow: `0 2px 24px ${meta.accent}55, 0 1px 0 #000` }}>
                  {meta.portfolioLabel}
                </h2>
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="px-5 sm:px-8 pb-2">
            <div
              className="h-1 w-full max-w-[600px] rounded-full mb-2"
              style={{
                background: `linear-gradient(90deg, ${meta.accent} 0%, ${meta.accent} 85%, transparent 100%)`,
              }}
            />
            <p className="max-w-3xl theme-text-muted text-sm sm:text-base">
              {meta.description}
            </p>
          </div>

          {/* Utility row: tag filter chips, completed toggle, sort button */}
          <div className="px-5 sm:px-8 pb-5 mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Count chip (filtered) */}
              <span className="text-xs font-semibold text-white/80">
              {filtered.length} Project{filtered.length === 1 ? '' : 's'}
            </span>
            {/* Filter dropdown button (UI only) */}
            <div className="relative">
              <button
                type="button"
                className={`px-3 py-1.5 text-xs rounded-full border border-white/15 flex items-center gap-1 transition-colors bg-zinc-900/95
                  ${selectedTags.length > 0 ? 'text-white' : 'text-white/80'}
                  ${selectedTags.length > 0 ? '' : 'hover:text-white'}
                `}
                style={selectedTags.length > 0 ? { background: meta.accent, borderColor: meta.accent } : {}}
                onClick={e => {
                  e.preventDefault();
                  setShowFilter(f => !f);
                }}
              >
                <span>Filter by Tag</span>
              </button>
              {showFilter && (
                <FilterPopup
                  tags={Array.from(new Set(list.flatMap(p => p.tags)))}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  onClose={() => setShowFilter(false)}
                  accent={meta.accent}
                />
              )}
            </div>
            {/* Completed toggle */}
            <button
              type="button"
              className={`px-3 py-1.5 text-xs rounded-full border border-white/15 transition-colors bg-zinc-900/95
                ${showCompleted ? 'text-white' : 'text-white/70'}
                ${showCompleted ? '' : 'hover:text-white'}
              `}
              style={showCompleted ? { background: meta.accent, borderColor: meta.accent } : {}}
              onClick={() => setShowCompleted(v => !v)}
            >
              Completed
            </button>
            {/* Sort dropdown */}
            <div className="ml-auto">
              <label htmlFor="sort-select" className="sr-only">Sort projects</label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as SortOption)}
                className="px-3 py-1.5 text-xs rounded-xl bg-zinc-900/95 border border-white/15 text-white/80 shadow-xl focus:outline-none select-none caret-transparent transition-colors min-w-[140px] cursor-pointer"
                style={{ fontFamily: 'inherit' }}
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="title-az">Title (A–Z)</option>
                <option value="title-za">Title (Z–A)</option>
                <option value="completed">Completed First</option>
              </select>
            </div>
          </div>
        </section>

        <ProjectGrid
          projects={filtered}
          onOpen={(p) => {
            const full = raw.find((r) => r.slug === p.slug);
            openProject(p, full ?? undefined);
          }}
        />
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
      {/* Featured/New banner carousel (data-driven) */}
      <ProjectsFeatured />

  {/* Gamemode Cards row */}
  <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 mt-16 md:mt-20">
        <GamemodeCard
          gameLabel="Singleplayer"
          portfolioLabel="Solo Projects"
          description="Personal projects focused on gameplay, audio, and tools."
          image="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(59 130 246)" // blue
          morphSpeed={1.8}
          icon={User}
          onActivate={() => goMode("singleplayer")}
        />
        <GamemodeCard
          gameLabel="Multiplayer"
          portfolioLabel="Group Projects"
          description="Team-based works: networking, systems, collaboration."
          image="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(234 179 8)" // amber / orange
          morphSpeed={1.8}
          icon={Users}
          onActivate={() => goMode("multiplayer")}
        />
        <GamemodeCard
          gameLabel="Competitive"
          portfolioLabel="Game Jams"
          description="Rapid, focused prototypes built under time pressure."
          image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(168 85 247)" // purple
          morphSpeed={1.8}
          icon={Trophy}
          onActivate={() => goMode("competitive")}
        />
        <GamemodeCard
          gameLabel="Sandbox"
          portfolioLabel="Engine & Tools"
          description="Engine mods, editor tooling, audio & tech exploration."
          image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(34 197 94)" // green
          morphSpeed={1.8}
          icon={Wrench}
          onActivate={() => goMode("sandbox")}
        />
      </div>
    </div>
  );
};

// Data-driven featured carousel wrapper
const ProjectsFeatured: React.FC = () => {
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const navigate = useNavigate();
  const { handleProjectClick } = useNavigation();
  
  React.useEffect(() => {
    let cancelled = false;
    
    // Only load slides - we'll get project data on demand
    getFeaturedSlides().then((featuredRes) => {
      if (!cancelled) {
        setSlides(
          featuredRes.map((s) => ({
            id: s.id,
            kind: s.kind,
            title: s.title,
            subtitle: undefined, // suppress description in banner
            image: s.image,
            mode: s.mode,
            slug: s.slug,
            tags: s.tags,
          })),
        );
      }
    });
    
    return () => {
      cancelled = true;
    };
  }, []);
  
  if (!slides.length) return null;
  
  return (
    <FeaturedCarousel
      className="mb-12 md:mb-16"
      slides={slides}
      onOpen={async (s) => {
        if (s.mode && s.slug) {
          if (DEBUG_LOGS) {
            console.debug("[ProjectsFeatured] Click slide", {
              kind: s.kind,
              mode: s.mode,
              slug: s.slug,
            });
          }
          
          // Load project data on demand
          try {
            const allProjects = await getProjects();
            const fullProject = allProjects.find((p) => {
              const normalized = normalizeProject(p);
              return normalized.slug === s.slug && normalized.gamemode === s.mode;
            });
            if (fullProject) {
              handleProjectClick(fullProject);
            }
          } catch (error) {
            console.warn("Failed to load project data:", error);
          }
          
          // Navigate to the project detail URL
          navigate(`/projects/${s.mode}/${s.slug}`);
        }
      }}
    />
  );
};

export default ProjectsSection;
