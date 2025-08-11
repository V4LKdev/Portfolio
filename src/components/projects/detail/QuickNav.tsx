import React from "react";
import { type ProjectTab } from "../../../content";

interface QuickNavProps {
  activeTab: ProjectTab;
  activeTabId: string;
  allSyncKeys: string[]; // Master list of sync keys for consistent indexing
}

/**
 * Left-hand sidebar for navigating sections within the active tab.
 * Uses native anchor links for smooth scrolling behavior.
 */
const QuickNav: React.FC<QuickNavProps> = ({ activeTab, activeTabId, allSyncKeys }) => {

  // Get sections that exist in the current tab for the given sync keys
  const navigableSyncKeys = allSyncKeys.filter((syncKey) => {
    return activeTab.sections.some((section) => section.syncKey === syncKey);
  });

  // Don't render if there are no navigable sections
  if (navigableSyncKeys.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4">
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Quick Navigation
        </h3>
        <nav className="space-y-1.5">
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
              <button
                key={`nav-${syncKey}-${syncIndex}`}
                onClick={(e) => {
                  e.preventDefault();
                  requestAnimationFrame(() => {
                    const element = document.getElementById(anchorId);
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                      });
                    }
                  });
                }}
                className="block w-full text-left px-2.5 py-2 rounded-md text-sm text-white/75 hover:text-white transition-colors focus:outline-none focus:ring-0 bg-transparent"
                tabIndex={0}
              >
                {displayTitle}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default QuickNav;
