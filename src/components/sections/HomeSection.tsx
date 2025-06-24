// Home Section Component
// Landing page content with hero text and call-to-action
// Displays personal information and main navigation button

import React from "react";
import { HomeSectionComponent } from "../../types/SharedProps";

/**
 * Home section component - main landing page content
 * @param onNavigateToProjects - Callback to navigate to projects section (unused in current design)
 */
const HomeSection: HomeSectionComponent = ({
  onNavigateToProjects: _onNavigateToProjects,
  className,
  id,
}) => {
  return (
    <div
      className={`text-left max-w-4xl pt-8 transition-all duration-500 animate-fade-in no-select ${className || ""}`}
      id={id}
    >
      {/* Content removed for clean video game menu aesthetic */}
    </div>
  );
};

export default HomeSection;
