import React from "react";
import { ArrowLeft } from "lucide-react";
import { type Project, type ProjectTab } from "../../../content";
import { useSoundEffects } from "../../../hooks/useSoundEffects";

interface StickyHeaderProps {
  project: Project;
  tabs: ProjectTab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onBack: () => void;
}

/**
 * Sticky navigation header for project detail view.
 * Contains back button, project title, and tab navigation.
 */
const StickyHeader: React.FC<StickyHeaderProps> = ({
  project,
  tabs,
  activeTabId,
  onTabClick,
  onBack,
}) => {
  const { playHover, playUnhover, playClick } = useSoundEffects();

  return (
    <div
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-white/10"
      style={{
        background: "rgba(13, 15, 20, 0.85)"
      }}
      data-sticky-header // Marker for CSS scroll-margin-top calculations
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Back Button */}
          <button
            onClick={() => {
              playClick();
              onBack();
            }}
            onMouseEnter={playHover}
            onMouseLeave={playUnhover}
            onFocus={playHover}
            onBlur={playUnhover}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg theme-back-button group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-semibold text-sm sm:text-base">Back</span>
          </button>

          {/* Project Title */}
          <div className="flex-1 mx-6">
            <h1 className="text-lg sm:text-xl font-bold theme-heading text-center truncate">
              {project.title}
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playClick();
                  onTabClick(tab.id);
                }}
                onMouseEnter={playHover}
                onMouseLeave={playUnhover}
                onFocus={playHover}
                onBlur={playUnhover}
                className={`
                  px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200
                  ${activeTabId === tab.id
                    ? 'theme-button'
                    : 'theme-button-outline hover:theme-button'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyHeader;
