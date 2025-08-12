import React from "react";
import { motion } from "framer-motion";
import { type GamemodeSlug, GAMEMODES } from "../../content/gamemodes";
import { useSoundEffects } from "../../hooks/useSoundEffects";

export type ProjectCardData = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string; // cover
  slug: string;
  mode: GamemodeSlug;
};

interface ProjectCardProps {
  project: ProjectCardData;
  onOpen: (p: ProjectCardData) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
  const meta = GAMEMODES[project.mode];
  const accent = meta.accent;
  const { playHover, playClick } = useSoundEffects();

  return (
    <motion.button
      type="button"
      onClick={() => {
        playClick();
        onOpen(project);
      }}
      onMouseEnter={playHover}
      className="relative group overflow-hidden rounded-xl text-left focus:outline-none"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      aria-label={`Open ${project.title}`}
    >
      <div className="absolute inset-0">
        <img
          src={project.image}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>
  <div className="relative z-10 p-8 flex flex-col gap-4">
        <div className="text-xl md:text-2xl font-extrabold game-title text-white">
          {project.title}
        </div>
        <div className="text-sm text-white/80 line-clamp-2">
          {project.description}
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor: "rgba(0,0,0,0.35)",
                border: `1px solid rgba(255,255,255,0.25)`,
                color: "#fff",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.08), 0 0 24px ${accent}`,
        }}
      />
    </motion.button>
  );
};

export default ProjectCard;
