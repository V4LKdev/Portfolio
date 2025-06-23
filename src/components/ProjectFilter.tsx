import React from "react";
import { Settings, Users, User, Trophy } from "lucide-react";

interface ProjectFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
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
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
              activeFilter === filter.id
                ? "bg-amber-500/30 border-amber-500/80 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                : "bg-black/30 border-amber-500/30 text-amber-200/80 hover:border-amber-500/60 hover:bg-amber-500/20"
            }`}
          >
            <IconComponent className="w-5 h-5" />
            <span
              className="font-semibold"
              style={{ fontFamily: "Good Timing, serif" }}
            >
              {filter.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ProjectFilter;
