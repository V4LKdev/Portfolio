/**
 * NavigationHeader.tsx
 *
 * Logo and title area for the main navigation menu.
 * Displays the portfolio owner's name and title with consistent game-style theming.
 */

import React from "react";
import { SPACING_CONFIG } from "../../config";

/**
 * Navigation header with logo and title information
 *
 * Features consistent spacing and theming for the navigation menu header area.
 * Uses viewport-aware spacing to optimize space usage across different screen heights.
 *
 * @returns JSX element for the navigation header
 */
const NavigationHeader: React.FC = () => {
  return (
    <div
      className={`${SPACING_CONFIG.HEADER.PADDING_TOP} ${SPACING_CONFIG.HEADER.PADDING_BOTTOM} ${SPACING_CONFIG.HEADER.PADDING_X} no-select`}
    >
      <h1 className="game-title mb-1 text-4xl md:text-5xl lg:text-6xl no-select">
        NICOLAS MARTIN
      </h1>
      <p className="game-subtitle text-lg md:text-xl lg:text-2xl tracking-wide font-medium no-select">
        Game Programmer
      </p>
    </div>
  );
};

export default NavigationHeader;
