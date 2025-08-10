import React from "react";
import ProjectCard, { type ProjectCardData } from "./ProjectCard";

interface ProjectGridProps {
  projects: ProjectCardData[];
  onOpen: (p: ProjectCardData) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onOpen }) => {
  if (!projects.length) {
    return (
      <div className="theme-card-static rounded-xl p-8 text-center">
        <p className="theme-text">No projects found for this mode yet.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default ProjectGrid;
