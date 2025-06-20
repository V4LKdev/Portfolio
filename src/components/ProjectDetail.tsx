// ProjectDetail.tsx
// Enhanced project detail component with dynamic tabbed navigation
// Features: Sticky navigation, responsive design, dynamic content sections
// Supports Design, Code, and Implementation tabs based on available project data

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image, Code, Settings } from 'lucide-react';
import { type Project } from '../content';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

type ProjectTab = 'design' | 'code' | 'implementation';

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
 * 
 * @param project - The project data to display
 * @param onBack - Callback function to navigate back to projects list
 */
const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  // --- Tab Configuration ---
  // Define available tabs with content validation
  const availableTabs: TabDefinition[] = [
    { 
      id: 'design' as ProjectTab, 
      label: 'Design', 
      icon: Image,
      hasContent: !!project.design 
    },
    { 
      id: 'code' as ProjectTab, 
      label: 'Code', 
      icon: Code,
      hasContent: !!project.code 
    },
    { 
      id: 'implementation' as ProjectTab, 
      label: 'Implementation', 
      icon: Settings,
      hasContent: !!project.implementation 
    }
  ].filter(tab => tab.hasContent);

  // --- State Management ---
  const [activeTab, setActiveTab] = useState<ProjectTab>(
    availableTabs.length > 0 ? availableTabs[0].id : 'design'
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
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [availableTabs.length]);

  // --- Utility Functions ---
  
  /**
   * Formats team information for display
   */
  const getTeamDisplay = (): string => {
    if (project.type === 'solo') return 'Solo Project';
    if (project.type === 'academic') return 'Academic Project';
    return project.team || 'Team Project';  };

  // --- Content Renderers ---
    /**
   * Renders the Design tab content
   */
  const renderDesignContent = () => (
    <div className="space-y-8 w-full max-w-none">
      <div>
        <h3 className="text-2xl font-semibold text-amber-100 mb-4">Design Overview</h3>
        <p className="text-amber-200/80 text-lg leading-relaxed mb-6">
          {project.design?.overview || 'Design overview will be added here...'}
        </p>
      </div>

      {project.design?.challenges && project.design.challenges.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold text-amber-100 mb-3">Design Challenges</h4>
          <ul className="space-y-2">
            {project.design.challenges.map((challenge, index) => (
              <li key={index} className="text-amber-200/80 flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.design?.solutions && project.design.solutions.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold text-amber-100 mb-3">Solutions</h4>
          <ul className="space-y-2">
            {project.design.solutions.map((solution, index) => (
              <li key={index} className="text-amber-200/80 flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {solution}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-black/30 p-6 rounded-lg border border-amber-500/20">
        <h4 className="text-xl font-semibold text-amber-100 mb-3">Design Documentation</h4>
        <p className="text-amber-200/80 mb-4">
          This section contains detailed design documentation, wireframes, and visual concepts that guided the development process.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-500/5 p-4 rounded border border-amber-500/10">
            <h5 className="text-amber-100 font-medium mb-2">User Experience</h5>
            <p className="text-amber-200/70 text-sm">
              User flow analysis and interaction design patterns.
            </p>          </div>          <div className="bg-amber-500/5 p-4 rounded border border-amber-500/10">
            <h5 className="text-amber-100 font-medium mb-2">Visual Design</h5>
            <p className="text-amber-200/70 text-sm">
              Color schemes, typography, and UI component design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
    /**
   * Renders the Code tab content
   * TODO: Fix width consistency issue - Code tab renders narrower than Design/Implementation tabs
   * due to CSS layout engine calculating container width based on first paragraph text length.
   * This affects projects with shorter technical architecture descriptions.
   */
  const renderCodeContent = () => (
    <div className="space-y-8 w-full max-w-none">
      <div>
        <h3 className="text-2xl font-semibold text-amber-100 mb-4">Technical Architecture</h3>
        <p className="text-amber-200/80 text-lg leading-relaxed mb-6">
          {project.code?.architecture || 'Technical architecture will be documented here...'}
        </p>
      </div>

      {project.code?.keyFeatures && project.code.keyFeatures.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold text-amber-100 mb-3">Key Features</h4>
          <ul className="space-y-2">
            {project.code.keyFeatures.map((feature, index) => (
              <li key={index} className="text-amber-200/80 flex items-start">
                <span className="text-amber-500 mr-2">▸</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}      {project.code?.codeSnippets && project.code.codeSnippets.length > 0 && (
        <div className="w-full">
          <h4 className="text-xl font-semibold text-amber-100 mb-3">Code Examples</h4>
          <div className="space-y-4 w-full">
            {project.code.codeSnippets.map((snippet, index) => (
              <div key={index} className="bg-black/40 rounded-lg border border-amber-500/20 w-full">
                <div className="bg-amber-500/10 px-4 py-2 border-b border-amber-500/20">
                  <h5 className="text-amber-100 font-medium">{snippet.title}</h5>
                  <span className="text-amber-200/60 text-sm">{snippet.language}</span>
                </div>
                <div className="w-full">
                  <pre className="p-4 text-amber-200/80 text-sm whitespace-pre w-full overflow-x-auto">
                    <code className="block">{snippet.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}      <div className="bg-black/30 p-6 rounded-lg border border-amber-500/20 w-full">
        <h4 className="text-xl font-semibold text-amber-100 mb-3">Technical Documentation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-amber-500/5 p-4 rounded border border-amber-500/10">
            <h5 className="text-amber-100 font-medium mb-2">Performance</h5>
            <p className="text-amber-200/70 text-sm">
              Optimization strategies and performance benchmarks.
            </p>
          </div>
          <div className="bg-amber-500/5 p-4 rounded border border-amber-500/10">
            <h5 className="text-amber-100 font-medium mb-2">Testing</h5>
            <p className="text-amber-200/70 text-sm">
              Unit tests, integration tests, and quality assurance procedures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );  /**
   * Renders the Implementation tab content
   */
  const renderImplementationContent = () => (
    <div className="space-y-8 w-full max-w-none">
      <div>
        <h3 className="text-2xl font-semibold text-amber-100 mb-4">Development Process</h3>
        <p className="text-amber-200/80 text-lg leading-relaxed mb-6">
          {project.implementation?.process || 'Development process documentation will be added here...'}
        </p>
      </div>

      {project.implementation?.timeline && project.implementation.timeline.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold text-amber-100 mb-3">Development Timeline</h4>
          <div className="space-y-3">
            {project.implementation.timeline.map((phase, index) => (
              <div key={index} className="bg-black/30 p-4 rounded-lg border border-amber-500/20">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="text-amber-100 font-medium">{phase.phase}</h5>
                  <span className="text-amber-200/60 text-sm">{phase.duration}</span>
                </div>
                <p className="text-amber-200/80 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.implementation?.challenges && project.implementation.challenges.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold text-amber-100 mb-3">Implementation Challenges</h4>
          <ul className="space-y-2">
            {project.implementation.challenges.map((challenge, index) => (
              <li key={index} className="text-amber-200/80 flex items-start">
                <span className="text-red-400 mr-2">⚠</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.implementation?.results && project.implementation.results.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold text-amber-100 mb-3">Results & Achievements</h4>
          <ul className="space-y-2">
            {project.implementation.results.map((result, index) => (
              <li key={index} className="text-amber-200/80 flex items-start">
                <span className="text-green-400 mr-2">🎯</span>
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-black/30 p-6 rounded-lg border border-amber-500/20">
        <h4 className="text-xl font-semibold text-amber-100 mb-3">Project Outcomes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-500/5 p-4 rounded border border-amber-500/10">
            <h5 className="text-amber-100 font-medium mb-2">Lessons Learned</h5>
            <p className="text-amber-200/70 text-sm">
              Key takeaways and knowledge gained during development.
            </p>
          </div>
          <div className="bg-amber-500/5 p-4 rounded border border-amber-500/10">
            <h5 className="text-amber-100 font-medium mb-2">Future Improvements</h5>
            <p className="text-amber-200/70 text-sm">
              Planned enhancements and potential feature additions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the current tab content based on active tab
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'design':
        return renderDesignContent();
      case 'code':
        return renderCodeContent();
      case 'implementation':
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
        className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Projects</span>
      </button>

      {/* Project Header with Banner */}
      <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg overflow-hidden atmospheric-glow mb-8">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-8">
          {/* Project Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-amber-500/20 text-amber-200 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          {/* Project Title and Description */}
          <h1 className="text-4xl font-bold text-amber-100 mb-4 deadlock-title">
            {project.title}
          </h1>
          <p className="text-xl text-amber-200/80 mb-6">
            {project.description}
          </p>

          {/* Project Metadata Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/30 rounded-lg p-4 border border-amber-500/10">
            <div className="text-center">
              <div className="text-amber-100 font-semibold text-lg">{project.year || '2024'}</div>
              <div className="text-amber-200/60 text-sm">Year</div>
            </div>
            <div className="text-center">
              <div className="text-amber-100 font-semibold text-lg">{project.duration || 'N/A'}</div>
              <div className="text-amber-200/60 text-sm">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-amber-100 font-semibold text-lg">{project.role || 'Developer'}</div>
              <div className="text-amber-200/60 text-sm">Role</div>
            </div>
            <div className="text-center">
              <div className="text-amber-100 font-semibold text-lg">{getTeamDisplay()}</div>
              <div className="text-amber-200/60 text-sm">Type</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Only show if more than one tab */}
      {availableTabs.length > 1 && (
        <div ref={tabContainerRef} className="relative mb-8">
          <div 
            className={`bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg atmospheric-glow ${
              isSticky 
                ? 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto shadow-2xl border-amber-500/40' 
                : 'relative'
            }`}
          >
            <div className="flex border-b border-amber-500/20">
              {availableTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-center transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-amber-500/20 text-amber-100 border-b-2 border-amber-500'
                        : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <IconComponent 
                        className={`w-5 h-5 ${
                          activeTab === tab.id ? 'text-amber-400' : 'text-amber-200/50'
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
      )}      {/* Content Area */}
      <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg atmospheric-glow">
        <div className="p-8 min-h-[600px] w-full">
          {availableTabs.length > 0 ? renderTabContent() : (
            <div className="text-center py-12">
              <p className="text-xl text-amber-200/80">
                Detailed content for this project will be added soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
