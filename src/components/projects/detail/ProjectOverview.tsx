import React from "react";
import { type Project } from "../../../content";
import { Github, ExternalLink, Play, Link as LinkIcon } from "lucide-react";

interface ProjectOverviewProps {
  project: Project;
}

// Formats date safely (month short + year)
function formatDate(iso?: string): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso; // fallback raw
    return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

const badgeBase = "px-2 py-0.5 rounded-full text-xs font-medium tracking-wide border border-white/15 bg-white/5 backdrop-blur-sm";

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  const created = formatDate(project.createdAt);
  const cover = project.cover || project.image;
  const metaItems: { label: string; value?: string | null }[] = [
    { label: "Type", value: project.type },
    { label: "Status", value: project.status },
    { label: "Year", value: project.year },
    { label: "Duration", value: project.duration },
    { label: "Team", value: project.team },
    { label: "Role", value: project.role },
    { label: "Created", value: created },
  ].filter(i => i.value);

  return (
    <section id="project-overview" className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        {/* Banner image */}
        {cover && (
          <img
            src={cover}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80 scale-100 hover:scale-[1.02] transition-transform duration-700"
            loading="lazy"
          />
        )}
        {/* Overlays: gradient, vignette, subtle scanlines */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background:
                 "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.65) 100%), radial-gradient(120% 100% at 10% 0%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 60%)",
             }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)",
          opacity: 0.06
        }} />
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 15%, rgba(255,255,255,0.25) 85%, rgba(255,255,255,0) 100%)"
        }} />

        {/* Content overlay */}
  <div className="relative z-10 px-5 sm:px-8 md:px-10 py-10 sm:py-14 text-selectable" style={{ minHeight: '16rem' }}>
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight theme-heading drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {project.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <span className={`${badgeBase} text-white/90`}>{project.category}</span>
              {project.type && (
                <span className={`${badgeBase} text-white/70`}>{project.type}</span>
              )}
              {project.status && (
                <span className={`${badgeBase} text-emerald-300/90 border-emerald-400/30 bg-emerald-500/10`}>{project.status}</span>
              )}
              {created && (
                <span className={`${badgeBase} text-white/60`}>{created}</span>
              )}
            </div>

            {/* Description */}
            {(project.description || project.details) && (
              <div className="mt-4 space-y-2">
                {project.description && (
                  <p className="text-sm sm:text-base leading-relaxed text-white/90 max-w-prose drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
                    {project.description}
                  </p>
                )}
                {project.details && (
                  <p className="text-xs sm:text-sm leading-relaxed text-white/80 max-w-prose drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
                    {project.details}
                  </p>
                )}
              </div>
            )}

            {/* Meta grid */}
            {metaItems.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[11px] sm:text-[13px]">
                {metaItems.map(mi => (
                  <div key={mi.label} className="flex flex-col">
                    <span className="uppercase tracking-wider text-[10px] font-semibold text-white/50 mb-0.5">
                      {mi.label}
                    </span>
                    <span className="font-medium text-white/90 truncate" title={mi.value || undefined}>
                      {mi.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags and Links */}
            {(project.tags?.length || project.links) && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {project.tags?.slice(0, 6).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/10 border border-white/15 text-white/80"
                  >
                    {tag}
                  </span>
                ))}
                <span className="mx-1 hidden sm:inline-block h-4 w-px bg-white/20" />
                {project.links?.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg theme-button-outline hover:theme-button transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" /> Demo
                  </a>
                )}
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg theme-button-outline hover:theme-button transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" /> Code
                  </a>
                )}
                {project.links?.external && (
                  <a
                    href={project.links.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg theme-button-outline hover:theme-button transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Site
                  </a>
                )}
                {!project.links?.external && project.slug && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white/60">
                    <LinkIcon className="w-3.5 h-3.5" /> {project.slug}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;
