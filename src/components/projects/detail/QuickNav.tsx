import React from "react";
import { type ProjectTab } from "../../../content";
import { useProjectScroll } from "../../../hooks/useProjectScroll";

interface QuickNavProps {
  activeTab: ProjectTab;
  activeTabId: string;
  allSyncKeys: string[]; // Master list of sync keys for consistent indexing
}

/**
 * Left-hand sidebar for navigating sections within the active tab.
 * Uses the centralized useProjectScroll hook for smooth scrolling.
 */
const QuickNav: React.FC<QuickNavProps> = ({ activeTab, activeTabId, allSyncKeys }) => {
  const { scrollToAnchor } = useProjectScroll();

  // Get sections that exist in the current tab for the given sync keys
  const navigableSyncKeys = allSyncKeys.filter((syncKey) => {
    return activeTab.sections.some((section) => section.syncKey === syncKey);
  });

  // Don't render if there are no navigable sections
  if (navigableSyncKeys.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-32 h-fit">
      <div className="theme-card p-4 rounded-lg">
        <h3 className="text-sm font-semibold theme-text-muted uppercase tracking-wider mb-3">
          Quick Navigation
        </h3>
        <nav className="space-y-2">
          {navigableSyncKeys.map((syncKey) => {
            // Get the index from the master sync keys list for consistency
            const syncIndex = allSyncKeys.findIndex(key => key === syncKey);
            const anchorId = `section-${activeTabId}-${syncKey}-${syncIndex}`;
            
            // Find the section to get display title (prioritize non-spacer sections)
            const section = activeTab.sections.find(s => 
              s.syncKey === syncKey && s.type !== 'spacer'
            ) || activeTab.sections.find(s => s.syncKey === syncKey);
            
            // Get section title for display
            const displayTitle = (() => {
              if (section && 'title' in section && section.title) {
                return section.title;
              }
              if (syncKey) {
                // Capitalize and format syncKey as fallback
                return syncKey
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
              }
              return 'Untitled Section';
            })();

            return (
              <a
                key={`nav-${syncKey}-${syncIndex}`}
                href={`#${anchorId}`}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm theme-text hover:theme-button-outline transition-colors"
                tabIndex={0}
                role="button"
              >
                {displayTitle}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default QuickNav;
