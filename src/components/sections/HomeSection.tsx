// Home Section Component
// Landing page content with hero text and call-to-action
// Displays personal information and main navigation button

import React from "react";

interface HomeSectionProps {
  onNavigateToProjects?: () => void; // Optional since it's not currently used
}

/**
 * Home section component - main landing page content
 * @param _onNavigateToProjects - Callback to navigate to projects section (unused in current design)
 */
const HomeSection: React.FC<HomeSectionProps> = ({ onNavigateToProjects: _onNavigateToProjects }) => {
  return (
    <div className="text-left max-w-4xl pt-8 transition-all duration-500 animate-fade-in no-select">
      {/* Content removed for clean video game menu aesthetic */}
    </div>
  );
};

export default HomeSection;
