// ProjectDetail.tsx - The Orchestrator
// Robust, component-based architecture for project detail views

import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { type Project, type ProjectTab } from "../../content";
import DetailLayout from "../layout/DetailLayout";
import { StickyHeader, QuickNav, SectionRenderer } from "./detail";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

/**
 * Creates backward-compatible tabs from legacy project data structure.
 * Converts old design/code/implementation fields into the new tab format.
 */
const createLegacyTabs = (project: Project): ProjectTab[] => {
  const tabs: ProjectTab[] = [];

  // Design Tab (from project.design)
  if (project.design) {
    tabs.push({
      id: "design",
      label: "Design",
      sections: [
        {
          type: "text",
          syncKey: "overview",
          title: "Overview",
          body: project.design.overview,
        },
        {
          type: "text",
          syncKey: "challenges",
          title: "Challenges",
          body: project.design.challenges.map((c, _i) => `${_i + 1}. ${c}`).join('\n'),
        },
        {
          type: "text", 
          syncKey: "solutions",
          title: "Solutions",
          body: project.design.solutions.map((s, _i) => `${_i + 1}. ${s}`).join('\n'),
        },
        {
          type: "gallery",
          syncKey: "gallery",
          title: "Gallery",
          images: project.design.images,
        },
      ],
    });
  }

  // Code Tab (from project.code)
  if (project.code) {
    const sections: ProjectTab['sections'] = [
      {
        type: "text",
        syncKey: "architecture",
        title: "Architecture",
        body: project.code.architecture,
      },
      {
        type: "text",
        syncKey: "features",
        title: "Key Features",
        body: project.code.keyFeatures.map((f, _i) => `• ${f}`).join('\n'),
      },
    ];

    // Add code snippets
    project.code.codeSnippets.forEach((snippet, index) => {
      sections.push({
        type: "code",
        syncKey: `code-${index}`,
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
      });
    });

    tabs.push({
      id: "code",
      label: "Code",
      sections,
    });
  }

  // Implementation Tab (from project.implementation)
  if (project.implementation) {
    const sections: ProjectTab['sections'] = [
      {
        type: "text",
        syncKey: "process",
        title: "Process",
        body: project.implementation.process,
      },
      {
        type: "text",
        syncKey: "timeline",
        title: "Timeline",
        body: project.implementation.timeline
          .map(t => `**${t.phase}** (${t.duration})\n${t.description}`)
          .join('\n\n'),
      },
      {
        type: "text",
        syncKey: "challenges",
        title: "Challenges",
        body: project.implementation.challenges.map((c, _i) => `${_i + 1}. ${c}`).join('\n'),
      },
      {
        type: "text",
        syncKey: "results",
        title: "Results",
        body: project.implementation.results.map((r, _i) => `• ${r}`).join('\n'),
      },
    ];

    tabs.push({
      id: "implementation",
      label: "Implementation",
      sections,
    });
  }

  return tabs;
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get tabs from project (new format) or create from legacy data
  const projectTabs = useMemo(() => {
    return project.tabs && project.tabs.length > 0 
      ? project.tabs 
      : createLegacyTabs(project);
  }, [project]);

  // State management with URL sync
  const urlTabId = searchParams.get('tab');
  const defaultTabId = projectTabs[0]?.id || 'design';
  const validActiveTabId = (() => {
    // Validate URL tab exists
    const validTab = projectTabs.find(tab => tab.id === urlTabId);
    return validTab ? urlTabId! : defaultTabId;
  })();
  
  const [activeTabId, setActiveTabId] = useState<string>(validActiveTabId);

  // Update URL when tab changes
  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tabId);
    setSearchParams(newParams);
  };

  // Cross-tab navigation (from SectionRenderer)
  const handleNavigate = (tabId: string, anchorId: string) => {
    handleTabClick(tabId);
    // Use requestAnimationFrame + setTimeout for better timing
    // First RAF ensures React has processed the tab change
    requestAnimationFrame(() => {
      // Second timeout allows DOM to fully update and render
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          // Use smooth scrollIntoView - this works WITH CSS scroll-behavior
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        } else {
          console.debug('[ProjectDetail] Element not found for anchor:', anchorId);
        }
      }, 150); // Increased from 100ms to 150ms for more reliable rendering
    });
  };

  // Get active tab data
  const activeTab = projectTabs.find(tab => tab.id === activeTabId) || projectTabs[0];

  // Master list of unique syncKeys for synchronized rows
  const allSyncKeys = useMemo(() => {
    const syncKeySet = new Set<string>();
    projectTabs.forEach(tab => {
      tab.sections.forEach(section => {
        if (section.syncKey) {
          syncKeySet.add(section.syncKey);
        }
      });
    });
    return Array.from(syncKeySet);
  }, [projectTabs]);

  // If no tabs available, show error state
  if (!activeTab || projectTabs.length === 0) {
    return (
      <DetailLayout>
        <div className="relative min-h-screen w-full animate-fade-in">
          <div className="absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.6) 42%, rgba(0,0,0,0.9) 100%), linear-gradient(180deg, rgba(13,15,20,0.9) 0%, rgba(5,6,8,0.96) 100%)",
            }}
          />
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold theme-heading">{project.title}</h1>
              <p className="theme-text-muted mt-4">No content available for this project.</p>
            </div>
          </div>
        </div>
      </DetailLayout>
    );
  }

  // ...existing code...

  return (
    <DetailLayout>
      <div className="relative min-h-screen w-full animate-fade-in">
        {/* Premium dark gradient background (preserved) */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.6) 42%, rgba(0,0,0,0.9) 100%), linear-gradient(180deg, rgba(13,15,20,0.9) 0%, rgba(5,6,8,0.96) 100%)",
          }}
        />

        {/* Sticky Header */}
        <StickyHeader
          project={project}
          tabs={projectTabs}
          activeTabId={activeTabId}
          onTabClick={handleTabClick}
          onBack={onBack}
        />

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Quick Navigation Sidebar */}
            <div className="lg:col-span-1">
              <QuickNav 
                activeTab={activeTab} 
                activeTabId={activeTabId} 
                allSyncKeys={allSyncKeys}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-12">
                {/* Render sections for each unique syncKey */}
                {(() => {
                  const renderedSections = new Set();
                  return allSyncKeys.map((syncKey, syncIndex) => {
                    // Find the section in the active tab that matches this syncKey
                    // Prioritize non-spacer sections
                    const section = activeTab.sections.find(s => 
                      s.syncKey === syncKey && s.type !== 'spacer'
                    ) || activeTab.sections.find(s => s.syncKey === syncKey);
                    
                    // Skip if no section found for this syncKey in active tab
                    if (!section) return null;

                    // Create a unique identifier for this section to prevent duplicates
                    const sectionTitle = 'title' in section ? section.title || 'notitle' : 'notitle';
                    const sectionId = `${activeTabId}-${section.type}-${section.syncKey}-${sectionTitle}`;
                    
                    if (renderedSections.has(sectionId)) {
                      console.warn('[ProjectDetail] Skipping duplicate section:', sectionId);
                      return null;
                    }
                    renderedSections.add(sectionId);

                    // Generate unique anchor ID
                    const anchorId = `section-${activeTabId}-${syncKey}-${syncIndex}`;

                    return (
                      <SectionRenderer
                        key={`${activeTabId}-${syncKey}-${syncIndex}`}
                        section={section}
                        project={project}
                        activeTabId={activeTabId}
                        onNavigate={handleNavigate}
                        anchorId={anchorId}
                      />
                    );
                  });
                })()}

                {/* Render sections without syncKeys at the end */}
                {activeTab.sections
                  .filter(section => !section.syncKey)
                  .map((section, index) => {
                    const anchorId = `section-${activeTabId}-no-sync-${index}`;
                    return (
                      <SectionRenderer
                        key={`${activeTabId}-no-sync-${index}`}
                        section={section}
                        project={project}
                        activeTabId={activeTabId}
                        onNavigate={handleNavigate}
                        anchorId={anchorId}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DetailLayout>
  );
};

export default ProjectDetail;