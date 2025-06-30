/**
 * NavigationHeader.tsx
 *
 * Logo and title area for the main navigation menu.
 * Displays the portfolio owner's name and title with consistent game-style theming.
 */

import React from "react";

/**
 * Navigation header with logo and title information
 *
 * Features consistent spacing and theming for the navigation menu header area.
 *
 * @returns JSX element for the navigation header
 */
const NavigationHeader: React.FC = () => {
  return (
    <div className="pt-14 md:pt-20 pb-12 md:pb-16 lg:pb-20 px-8 md:px-12 no-select">
      <h1 className="game-title mb-1 text-3xl md:text-4xl lg:text-5xl no-select">
        NICOLAS MARTIN
      </h1>
      <p className="game-subtitle text-base md:text-lg lg:text-xl tracking-wide font-medium no-select">
        Game Programmer
      </p>
    </div>
  );
};

export default NavigationHeader;
