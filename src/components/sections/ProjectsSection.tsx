// Projects Section Component
// Visual-only Gamemode Hub for projects
// Replaces filter/grid with four large gamemode cards (no functionality yet)

import { BackButton } from "../ui/navigation";
import { NavigableSectionComponent } from "../../types/SharedProps";
import GamemodeCard from "../projects/GamemodeCard";
import { User, Users, Trophy, Wrench } from "lucide-react";

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
  return (
    <div
      className={`max-w-6xl mx-auto transition-all duration-500 animate-fade-in ${className ?? ""}`}
      id={id}
    >
      <BackButton onClick={onBack} label="Back to Home" />
      <h2 className="text-5xl font-bold mb-4 text-center game-title">
        Projects
      </h2>
      <p className="text-center game-subtitle theme-text-muted mb-10 text-lg">
        Choose a mode to explore
      </p>

  {/* Gamemode Cards row */}
  <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
        <GamemodeCard
          gameLabel="Singleplayer"
          portfolioLabel="Solo Projects"
          description="Personal projects focused on gameplay, audio, and tools."
          image="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(59 130 246)"  // blue
          morphSpeed={1.8}
          icon={User}
        />
        <GamemodeCard
          gameLabel="Multiplayer"
          portfolioLabel="Group Projects"
          description="Team-based works: networking, systems, collaboration."
          image="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(234 179 8)"   // amber / orange
          morphSpeed={1.8}
          icon={Users}
        />
        <GamemodeCard
          gameLabel="Competitive"
          portfolioLabel="Game Jams"
          description="Rapid, focused prototypes built under time pressure."
          image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(168 85 247)"  // purple
          morphSpeed={1.8}
          icon={Trophy}
        />
        <GamemodeCard
          gameLabel="Sandbox"
          portfolioLabel="Engine & Tools"
          description="Engine mods, editor tooling, audio & tech exploration."
          image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1470&auto=format&fit=crop"
          accent="rgb(34 197 94)"   // green
          morphSpeed={1.8}
          icon={Wrench}
        />
      </div>
    </div>
  );
};

export default ProjectsSection;
