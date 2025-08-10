import React from "react";
import { Settings, Users, User, Trophy } from "lucide-react";
import { useSoundEffects } from "../../hooks/useSoundEffects";

interface ProjectFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const { playHover, playUnhover, playClick } = useSoundEffects();
  const filters = [
    { id: "all", label: "All Projects", icon: Settings },
    { id: "team", label: "Team Projects", icon: Users },
    { id: "solo", label: "Solo Projects", icon: User },
    { id: "academic", label: "Academic", icon: Trophy },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        return (
          <button
            key={filter.id}
            onClick={() => {
              playClick();
              onFilterChange(filter.id);
            }}
            onMouseEnter={playHover}
            onMouseLeave={playUnhover}
            onFocus={playHover}
            onBlur={playUnhover}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
              activeFilter === filter.id
                ? "theme-button active shadow-[0_0_20px_var(--theme-menu-glow)]"
                : "theme-filter-button hover:theme-button"
            }`}
          >
            <IconComponent className="w-5 h-5" />
            <span className="game-subtitle font-semibold">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProjectFilter;
