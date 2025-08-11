// ProjectDetail.tsx - The Orchestrator
// Robust, component-based architecture for project detail views

import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { type Project, type ProjectTab } from "../../content";
import DetailLayout from "../layout/DetailLayout";
import { StickyHeader, SectionRenderer, ProjectOverview, QuickNav } from "./detail";

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
          console.debug('[ProjectDetail] Navigated to:', anchorId);
        } else {
          console.debug('[ProjectDetail] Element not found for anchor:', anchorId);
          // Fallback: scroll to main content area
          const contentArea = document.getElementById('project-content');
          if (contentArea) {
            contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
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

  return (
    <DetailLayout>
      <div className="relative min-h-screen w-full animate-fade-in">
        {/* Premium dark gradient background (preserved) */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute top-0 left-0 w-[180vw] h-full pointer-events-none"
            style={{
              background: `radial-gradient(160% 140% at 25% 10%, rgba(255,255,255,0.07) 0%, rgba(20,22,28,0.45) 40%, rgba(5,6,8,0.92) 70%, rgba(0,0,0,0.98) 100%),
                           linear-gradient(135deg, rgba(13,15,20,0.85) 0%, rgba(8,10,14,0.9) 55%, rgba(0,0,0,0.95) 100%)` ,
              maskImage: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.9))",
            }}
          />
        </div>

        {/* Sticky Header */}
        <StickyHeader
          project={project}
          tabs={projectTabs}
          activeTabId={activeTabId}
          onTabClick={handleTabClick}
          onBack={onBack}
        />

        {/* Main Content: full-width overview banner, then dual-column layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-10 py-12" key={activeTabId} data-active-tab={activeTabId}>
          {/* Full-width Project Overview hero */}
          <ProjectOverview project={project} />

          {/* Dual column content below overview */}
          <div className="mt-10 flex flex-row gap-10">
            {/* Sidebar QuickNav (desktop) */}
            <aside className="hidden lg:block shrink-0 w-56 xl:w-60 pt-2">
              <div className="sticky top-32">
                <QuickNav 
                  activeTab={activeTab} 
                  activeTabId={activeTabId} 
                  allSyncKeys={allSyncKeys}
                />
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1" id="project-content">
              <div className="max-w-3xl 2xl:max-w-4xl space-y-12 mx-auto">
                {/* Render sections for each unique syncKey */}
                {(() => {
                  const renderedSections = new Set();
                  return allSyncKeys.map((syncKey, syncIndex) => {
                    const section = activeTab.sections.find(s => 
                      s.syncKey === syncKey && s.type !== 'spacer'
                    ) || activeTab.sections.find(s => s.syncKey === syncKey);
                    if (!section) return null;
                    const sectionTitle = 'title' in section ? section.title || 'notitle' : 'notitle';
                    const sectionId = `${activeTabId}-${section.type}-${section.syncKey}-${sectionTitle}`;
                    if (renderedSections.has(sectionId)) {
                      console.warn('[ProjectDetail] Skipping duplicate section:', sectionId);
                      return null;
                    }
                    renderedSections.add(sectionId);
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

                {/* Sections without syncKeys */}
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
            </main>
          </div>
        </div>
      </div>
    </DetailLayout>
  );
};

export default ProjectDetail;