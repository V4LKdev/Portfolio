/**
 * MenuButton.tsx
 *
 * Reusable menu button component with hover state management.
 * Features smooth label transitions and game-inspired styling.
 * Used throughout the portfolio for interactive navigation elements.
 */

import React, { useState } from "react";

interface MenuButtonProps {
  /** Default button label */
  label: string;
  /** Label shown on hover state */
  hoverLabel: string;
  /** Click handler function */
  onClick: () => void;
  /** Additional CSS classes for styling */
  className?: string;
}

/**
 * Interactive menu button with hover label transitions
 *
 * @param props - Button configuration and event handlers
 * @returns JSX element for the menu button
 */
const MenuButton: React.FC<MenuButtonProps> = ({
  label,
  hoverLabel,
  onClick,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`px-6 py-3 theme-button transition-all duration-300 hover:scale-105 ${className}`}
    >
      <span className="transition-all duration-300">
        {isHovered ? hoverLabel : label}
      </span>
    </button>
  );
};

export default MenuButton;
