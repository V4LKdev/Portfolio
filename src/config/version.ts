/**
 * Version configuration - Single source of truth
 *
 * Update both versions when creating a new release:
 * - RELEASE_VERSION: For UI display and git tags (date-based)
 * - PACKAGE_VERSION: For npm (semantic versioning)
 */

/** Release version for UI display and git tags - UPDATE FOR NEW RELEASES */
export const RELEASE_VERSION = "2025.07_v05";

/** Package version for npm (semantic versioning) - UPDATE FOR NEW RELEASES */
export const PACKAGE_VERSION = "1.2.0";

/** Legacy export for backward compatibility */
export default RELEASE_VERSION;
