import React from "react";
import { type Section, type Project } from "../../../content";
import ContentBlockRenderer from "./ContentBlockRenderer";

interface SectionRendererProps {
  section: Section;
  project: Project;
  activeTabId: string;
  onNavigate: (tabId: string, anchorId: string) => void;
  anchorId?: string; // Optional anchor ID for scrolling
}

/**
 * Renders a complete section, including its header with cross-tab navigation
 * and the content block. Shows "See in..." links when other tabs have 
 * content for the same syncKey.
 */
const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  project,
  activeTabId,
  onNavigate,
  anchorId,
}) => {
  // Find all tabs that have content for this syncKey (excluding current tab)
  const otherTabsWithSyncKey = React.useMemo(() => {
    if (!section.syncKey || !project.tabs) return [];
    
    return project.tabs
      .filter((tab) => tab.id !== activeTabId)
      .filter((tab) => 
        tab.sections.some((s) => s.syncKey === section.syncKey)
      );
  }, [section.syncKey, project.tabs, activeTabId]);

  // Generate an ID for the section for anchor linking
  const sectionId = anchorId || section.id || section.syncKey || `section-${Math.random().toString(36).substring(2, 9)}`;

  // Helper to safely get section title
  const getSectionTitle = (section: Section): string | undefined => {
    if ('title' in section) {
      return section.title;
    }
    return undefined;
  };

  const sectionTitle = getSectionTitle(section);

  return (
    <section
      id={sectionId}
      className="scroll-mt-header"
    >
  {/* Section Header with Cross-Tab Navigation */}
      {(sectionTitle || otherTabsWithSyncKey.length > 0) && (
        <div className="mb-6 pb-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Section Title */}
            {sectionTitle && (
              <h2 className="text-2xl font-bold theme-heading">
                {sectionTitle}
              </h2>
            )}
            
            {/* Cross-Tab Navigation Links */}
            {otherTabsWithSyncKey.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="theme-text-muted">See in:</span>
                {otherTabsWithSyncKey.map((tab, index) => {
                  // Generate the anchorId for the target tab/section
                  const syncIndex = project.tabs?.find(t => t.id === tab.id)?.sections.findIndex(s => s.syncKey === section.syncKey) ?? 0;
                  const targetAnchorId = `section-${tab.id}-${section.syncKey}-${syncIndex}`;
                  return (
                    <React.Fragment key={tab.id}>
                      <button
                        type="button"
                        className="theme-link hover:underline font-medium transition-colors bg-transparent border-none p-0 m-0 cursor-pointer"
                        onClick={() => onNavigate(tab.id, targetAnchorId)}
                        aria-label={`See in ${tab.label}`}
                      >
                        {tab.label}
                      </button>
                      {index < otherTabsWithSyncKey.length - 1 && (
                        <span className="theme-text-subtle">•</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Content */}
      <div className="section-content">
        <ContentBlockRenderer block={section} />
      </div>
  </section>
  );
};

export default SectionRenderer;
