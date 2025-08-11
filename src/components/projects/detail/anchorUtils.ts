import { type ProjectTab } from "../../../content";

/**
 * Returns a stable ordered list of unique syncKeys across all tabs.
 * Order is based on first appearance to ensure deterministic indices.
 */
export function getAllSyncKeys(tabs: ProjectTab[]): string[] {
  const set = new Set<string>();
  for (const tab of tabs) {
    for (const section of tab.sections) {
      if (section.syncKey) set.add(section.syncKey);
    }
  }
  return Array.from(set);
}

/**
 * Deterministically constructs an anchor ID for a given tab + syncKey.
 * Pattern: section-<tabId>-<syncKey>-<index>
 */
export function makeAnchorId(tabId: string, syncKey: string, allSyncKeys: string[]): string {
  const index = allSyncKeys.indexOf(syncKey);
  return `section-${tabId}-${syncKey}-${index >= 0 ? index : 'x'}`;
}
