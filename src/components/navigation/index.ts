/**
 * Navigation Components Index
 *
 * Centralized exports for all navigation-related components.
 * Provides clean import paths for navigation functionality.
 */

export { default as MainNavigation } from "./MainNavigation";
export { default as NavigationHeader } from "./NavigationHeader";
export { default as NavigationMenuItem } from "./NavigationMenuItem";
export { default as MenuButton } from "./MenuButton";

// Re-export types for external usage
export type { NavigationMenuItemProps } from "./NavigationMenuItem";
