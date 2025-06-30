/**
 * MainNavigation.tsx
 *
 * Primary navigation component for the portfolio application.
 * Features collapsible sidebar with game-style menu items and theming.
 */

import React from "react";
import { navigationItems } from "../../content";
import NavigationHeader from "./NavigationHeader";
import NavigationMenuItem from "./NavigationMenuItem";
import SettingsPanel from "../panels/SettingsPanel";

interface MainNavigationProps {
  /** Whether the mobile menu is expanded */
  isOpen: boolean;
  /** Currently active section identifier */
  currentSection: string;
  /** Callback for menu item selection */
  onMenuClick: (sectionId: string) => void;
}

/**
 * Main navigation sidebar component
 *
 * Provides the primary navigation interface with collapsible mobile support,
 * game-style menu items, and integrated settings panel.
 *
 * @param props - Navigation state and event handlers
 * @returns JSX element for the main navigation
 */
const MainNavigation: React.FC<MainNavigationProps> = ({
  isOpen,
  currentSection,
  onMenuClick,
}) => (
  <nav
    id="mobile-navigation"
    className={`fixed left-0 top-0 h-full w-sidebar z-40 transition-transform duration-300 lg:translate-x-0 no-select ${
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    }`}
  >
    <div
      className="h-full no-select"
      style={{
        background:
          "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.5) 70%, transparent 99%)",
      }}
    >
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Menu Items */}
      <div className="flex flex-col px-8 md:px-12 no-select">
        {navigationItems.map((item) => (
          <NavigationMenuItem
            key={item.id}
            id={item.id}
            gameLabel={item.gameLabel}
            hoverLabel={item.hoverLabel}
            hierarchy={
              item.hierarchy as "primary" | "secondary" | "tertiary" | "quit"
            }
            section={item.section}
            isActive={currentSection === item.section}
            onClick={onMenuClick}
          />
        ))}
      </div>

      {/* Settings Panel */}
      <SettingsPanel className="absolute bottom-12 md:bottom-14 left-8 md:left-12" />
    </div>
  </nav>
);

export default MainNavigation;
