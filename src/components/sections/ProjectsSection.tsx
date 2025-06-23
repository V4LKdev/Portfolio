// Projects Section Component
// Displays portfolio projects with filtering and navigation
// Handles project grid view and individual project selection

import React from "react";
import { ArrowLeft } from "lucide-react";
import { projects, type Project } from "../../content";
import ProjectFilter from "../ProjectFilter";

interface ProjectsSectionProps {
  onBack: () => void;
  onProjectClick: (project: Project) => void;
  projectFilter: string;
  onFilterChange: (filter: string) => void;
}

/**
 * Projects section component - displays portfolio projects in a grid
 * @param onBack - Callback to navigate back to home
 * @param onProjectClick - Callback when a project is clicked
 * @param projectFilter - Current active filter (all/team/solo/academic)
 * @param onFilterChange - Callback to change project filter
 */
const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onBack,
  onProjectClick,
  projectFilter,
  onFilterChange,
}) => {
  // Filter projects based on selected filter
  const filteredProjects = projects.filter((project) => {
    if (projectFilter === "all") return true;
    if (projectFilter === "team") return project.type === "team";
    if (projectFilter === "solo") return project.type === "solo";
    if (projectFilter === "academic") return project.type === "academic";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto transition-all duration-500 animate-fade-in">      <button
        onClick={onBack}
        className="mb-8 flex items-center space-x-2 theme-back-button"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <h2 className="text-5xl font-bold mb-8 text-center deadlock-title">
        FEATURED PROJECTS
      </h2>
      <p
        className="text-center theme-text-muted mb-12 text-lg"
        style={{ fontFamily: "Good Timing, serif" }}
      >
        Portfolio of Game Development Work
      </p>

      <ProjectFilter
        activeFilter={projectFilter}
        onFilterChange={onFilterChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (          <button
            key={project.id}
            onClick={() => onProjectClick(project)}
            className="theme-project-card rounded-lg overflow-hidden cursor-pointer w-full text-left"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="theme-skill-tag px-2 py-1 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3
                className="text-xl font-semibold theme-heading mb-2"
                style={{ fontFamily: "Good Timing, serif" }}
              >
                {project.title}
              </h3>
              <p className="theme-text-muted text-sm mb-4 line-clamp-3">
                {project.description}
              </p>              <div className="theme-text-subtle text-xs">{project.details}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
