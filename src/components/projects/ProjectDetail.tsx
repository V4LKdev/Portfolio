// ProjectDetail.tsx
// Enhanced project detail component with dynamic tabbed navigation
// Features: Sticky navigation, responsive design, dynamic content sections
// Supports Design, Code, and Implementation tabs based on available project data

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Image, Code, Settings } from "lucide-react";
import { type Project } from "../content";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

type ProjectTab = "design" | "code" | "implementation";

interface TabDefinition {
  id: ProjectTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasContent: boolean;
}

/**
 * Enhanced project detail component with tabbed navigation
 * Automatically shows/hides tabs based on available content
 * Features sticky navigation when scrolling
 * Fully theme-aware with consistent styling
 *
 * @param project - The project data to display
 * @param onBack - Callback function to navigate back to projects list
 */
const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  // --- Tab Configuration ---
  // Define available tabs with content validation
  const availableTabs: TabDefinition[] = [
    {
      id: "design" as ProjectTab,
      label: "Design",
      icon: Image,
      hasContent: !!project.design,
    },
    {
      id: "code" as ProjectTab,
      label: "Code",
      icon: Code,
      hasContent: !!project.code,
    },
    {
      id: "implementation" as ProjectTab,
      label: "Implementation",
      icon: Settings,
      hasContent: !!project.implementation,
    },
  ].filter((tab) => tab.hasContent);

  // --- State Management ---
  const [activeTab, setActiveTab] = useState<ProjectTab>(
    availableTabs.length > 0 ? availableTabs[0].id : "design",
  );
  const [isSticky, setIsSticky] = useState(false);

  // --- Refs for DOM Elements ---
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  // Handle sticky navigation behavior
  useEffect(() => {
    const handleScroll = () => {
      if (tabContainerRef.current && availableTabs.length > 1) {
        const containerRect = tabContainerRef.current.getBoundingClientRect();
        const shouldBeSticky = containerRect.top <= 20;
        setIsSticky(shouldBeSticky);
      }
    };

    // Only add scroll listener if multiple tabs exist
    if (availableTabs.length > 1) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [availableTabs.length]);

  // --- Helper Functions ---
  const getTeamDisplay = () => {
    if (project.type === "team") return project.team ?? "Team Project";
    if (project.type === "solo") return "Solo Project";
    if (project.type === "academic") return "Academic Project";
    return project.team ?? "Team Project";
  };

  // --- Content Rendering Functions ---
  const renderDesignContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold theme-heading mb-4">
          Design Overview
        </h3>
        <p className="theme-text text-lg leading-relaxed mb-6">
          {project.design?.overview ?? "Design overview will be added here..."}
        </p>
      </div>

      {project.design?.challenges && project.design.challenges.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold theme-heading mb-3">
            Design Challenges
          </h4>
          <ul className="space-y-2">
            {project.design.challenges.map((challenge) => (
              <li
                key={challenge.substring(0, 50).replace(/[^a-zA-Z0-9]/g, "-")}
                className="theme-text flex items-start"
              >
                <span className="theme-icon-accent mr-2">•</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.design?.solutions && project.design.solutions.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold theme-heading mb-3">
            Design Solutions
          </h4>
          <ul className="space-y-2">
            {project.design.solutions.map((solution) => (
              <li
                key={solution.substring(0, 50).replace(/[^a-zA-Z0-9]/g, "-")}
                className="theme-text flex items-start"
              >
                <span className="theme-icon-accent mr-2">▸</span>
                {solution}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.design?.images && project.design.images.length > 0 && (
        <div className="theme-card-static p-6 rounded-lg">
          <h4 className="text-xl font-semibold theme-heading mb-3">
            Design Gallery
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="theme-heading font-medium mb-2">
                User Experience
              </h5>
              <p className="theme-text-muted text-sm">
                Focus on intuitive navigation and seamless user interactions.
              </p>
            </div>
            <div>
              <h5 className="theme-heading font-medium mb-2">Visual Design</h5>
              <p className="theme-text-muted text-sm">
                Consistent visual hierarchy with modern design principles.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCodeContent = () => (
    <div className="space-y-8 w-full">
      <div>
        <h3 className="text-2xl font-semibold theme-heading mb-4">
          Technical Implementation
        </h3>
        <p className="theme-text text-lg leading-relaxed mb-6">
          {project.code?.architecture ??
            "Technical details will be added here..."}
        </p>
      </div>

      {project.code?.keyFeatures && project.code.keyFeatures.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold theme-heading mb-3">
            Key Features
          </h4>
          <ul className="space-y-2">
            {project.code.keyFeatures.map((feature) => (
              <li
                key={feature.substring(0, 50).replace(/[^a-zA-Z0-9]/g, "-")}
                className="theme-text flex items-start"
              >
                <span className="theme-icon-accent mr-2">▸</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.code?.codeSnippets && project.code.codeSnippets.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold theme-heading mb-3">
            Code Examples
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {project.code.codeSnippets.map((snippet) => (
              <div
                key={snippet.title}
                className="theme-card-static rounded-lg w-full"
              >
                <div className="p-4">
                  <h5 className="theme-heading font-medium">{snippet.title}</h5>
                  <span className="theme-text-muted text-sm">
                    {snippet.language}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.code?.architecture && (
        <div className="theme-card-static p-6 rounded-lg w-full">
          <h4 className="text-xl font-semibold theme-heading mb-3">
            Architecture Details
          </h4>
          <p className="theme-text">{project.code.architecture}</p>
        </div>
      )}
    </div>
  );

  const renderImplementationContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold theme-heading mb-4">
          Implementation Details
        </h3>
        <p className="theme-text text-lg leading-relaxed mb-6">
          {project.implementation?.process ??
            "Implementation details will be added here..."}
        </p>
      </div>

      {project.implementation?.timeline && (
        <div className="theme-card-static p-6 rounded-lg">
          <h4 className="text-xl font-semibold theme-heading mb-3">
            Development Timeline
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.implementation.timeline.map((step) => (
              <div
                key={step.phase ?? step.duration}
                className="theme-card-static p-4 rounded-lg"
              >
                <h5 className="theme-heading font-medium mb-2">
                  {step.phase ?? step.duration}
                </h5>
                <p className="theme-text-muted text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.implementation?.challenges && (
        <div>
          <h4 className="text-xl font-semibold theme-heading mb-3">
            Implementation Challenges
          </h4>
          <ul className="space-y-2">
            {project.implementation.challenges.map((challenge) => (
              <li
                key={challenge.substring(0, 50).replace(/[^a-zA-Z0-9]/g, "-")}
                className="theme-text flex items-start"
              >
                <span className="theme-icon-accent mr-2">•</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.implementation?.results && (
        <div>
          <h4 className="text-xl font-semibold theme-heading mb-3">
            Results & Outcomes
          </h4>
          <ul className="space-y-2">
            {project.implementation.results.map((result) => (
              <li
                key={result.substring(0, 50).replace(/[^a-zA-Z0-9]/g, "-")}
                className="theme-text flex items-start"
              >
                <span className="theme-icon-accent mr-2">★</span>
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // --- Tab Content Router ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "design":
        return renderDesignContent();
      case "code":
        return renderCodeContent();
      case "implementation":
        return renderImplementationContent();
      default:
        return null;
    }
  };

  // --- Main Render ---
  return (
    <div className="max-w-6xl mx-auto transition-all duration-500 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-8 flex items-center space-x-2 theme-back-button"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Projects</span>
      </button>

      {/* Project Header with Banner */}
      <div className="theme-card rounded-lg overflow-hidden atmospheric-glow mb-8">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-8">
          {/* Project Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="theme-skill-tag px-3 py-1 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Project Title and Description */}
          <h1 className="text-4xl font-bold theme-heading mb-4 game-title">
            {project.title}
          </h1>
          <p className="text-xl theme-text mb-6">{project.description}</p>

          {/* Project Metadata Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 theme-card-static rounded-lg p-4">
            <div className="text-center">
              <div className="theme-heading font-semibold text-lg">
                {project.year ?? "2024"}
              </div>
              <div className="theme-text-muted text-sm">Year</div>
            </div>
            <div className="text-center">
              <div className="theme-heading font-semibold text-lg">
                {project.duration ?? "N/A"}
              </div>
              <div className="theme-text-muted text-sm">Duration</div>
            </div>
            <div className="text-center">
              <div className="theme-heading font-semibold text-lg">
                {project.role ?? "Developer"}
              </div>
              <div className="theme-text-muted text-sm">Role</div>
            </div>
            <div className="text-center">
              <div className="theme-heading font-semibold text-lg">
                {getTeamDisplay()}
              </div>
              <div className="theme-text-muted text-sm">Type</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Only show if more than one tab */}
      {availableTabs.length > 1 && (
        <div ref={tabContainerRef} className="relative mb-8">
          <div
            className={`theme-card atmospheric-glow ${
              isSticky
                ? "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto shadow-2xl"
                : "relative"
            }`}
          >
            <div className="flex border-b theme-divider">
              {availableTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-center transition-all duration-300 ${
                      activeTab === tab.id
                        ? "theme-button-outline active border-b-2 border-current"
                        : "theme-text-muted hover:theme-text hover:theme-button-outline"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <IconComponent
                        className={`w-5 h-5 ${
                          activeTab === tab.id
                            ? "theme-icon-accent"
                            : "theme-icon-muted"
                        }`}
                      />
                      <span className="font-semibold">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Placeholder to maintain space when sticky */}
          {isSticky && <div className="h-20"></div>}
        </div>
      )}

      {/* Content Area */}
      <div className="theme-card atmospheric-glow">
        <div className="p-8 min-h-[600px] w-full">
          {availableTabs.length > 0 ? (
            renderTabContent()
          ) : (
            <div className="text-center py-12">
              <p className="text-xl theme-text">
                No detailed content available for this project yet.
              </p>
              <p className="theme-text-muted mt-4">
                Check back later for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
