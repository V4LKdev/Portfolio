/**
 * NavigationMenuItem.tsx
 *
 * Individual navigation menu item component with hover effects and game-style styling.
 * Features dynamic spacing, icon support, and smooth label transitions.
 */

import React from "react";
import { LogOut } from "lucide-react";

export interface NavigationMenuItemProps {
  /** Unique identifier for the menu item */
  id: string;
  /** Display label for normal state */
  gameLabel: string;
  /** Display label for hover state */
  hoverLabel: string;
  /** Visual hierarchy level affecting size and spacing */
  hierarchy: "primary" | "secondary" | "tertiary" | "quit";
  /** Target section to navigate to */
  section: string;
  /** Whether this item is currently active */
  isActive: boolean;
  /** Click handler for navigation */
  onClick: (sectionId: string) => void;
}

/**
 * Gets appropriate spacing classes based on menu item hierarchy
 */
const getButtonSpacing = (hierarchy: string): string => {
  if (hierarchy === "primary") return "mb-6 md:mb-8";
  if (hierarchy === "quit") return "mt-8 md:mt-12 mb-2 md:mb-3";
  return "mb-3 md:mb-4";
};

/**
 * Individual navigation menu item with hover effects and game-style theming
 *
 * @param props - Menu item configuration and event handlers
 * @returns JSX element for the navigation menu item
 */
const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  id,
  gameLabel,
  hoverLabel,
  hierarchy,
  section,
  isActive,
  onClick,
}) => {
  return (
    <button
      key={id}
      onClick={() => onClick(section)}
      className={`game-menu-item menu-${hierarchy} group menu-button transition-all duration-300 relative block w-full text-left no-select ${
        isActive ? "theme-text text-shadow-glow" : ""
      } ${getButtonSpacing(hierarchy)}`}
      type="button"
      tabIndex={0}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="relative flex items-center gap-2">
        {hierarchy === "quit" && (
          <LogOut className="w-4 h-4 md:w-5 md:h-5 theme-icon-muted group-hover:theme-icon transition-colors duration-300" />
        )}
        <div className="relative">
          <span className="block group-hover:opacity-0 transition-opacity duration-300 no-select">
            {gameLabel}
          </span>
          <span className="absolute top-0 left-0 w-full group-hover:opacity-100 opacity-0 transition-opacity duration-300 no-select">
            {hoverLabel}
          </span>
        </div>
      </div>
    </button>
  );
};

export default NavigationMenuItem;
