/**
 * MenuButton.tsx
 *
 * Reusable menu button component with hover state management.
 * Features smooth label transitions and game-inspired styling.
 * Used throughout the portfolio for interactive navigation elements.
 */

import React, { useState } from "react";
import "../../styles/theme-button.css";

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
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false); // Reset active state if mouse leaves
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      className={`px-6 py-3 theme-button transition-all duration-300 hover:scale-105 ${isActive ? "theme-button-active" : ""} ${className}`}
    >
      <span className="transition-all duration-300">
        {isHovered ? hoverLabel : label}
      </span>
    </button>
  );
};

export default MenuButton;
