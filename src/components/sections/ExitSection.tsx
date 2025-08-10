/**
 * ExitSection.tsx
 *
 * Game-style exit/farewell section with thematic messaging.
 * Provides a friendly goodbye experience with navigation back to home.
 */

import React from "react";
import { useSoundEffects } from "../../hooks/useSoundEffects";

interface ExitSectionProps {
  /** Navigation callback to return to the home page */
  onBack: () => void;
}

/**
 * Exit section component with game-style farewell
 *
 * Provides a thematic goodbye experience with consistent styling
 * and navigation back to the main portfolio.
 *
 * @param onBack - Function to handle navigation back to home
 * @returns JSX element for the exit section
 */
const ExitSection: React.FC<ExitSectionProps> = ({ onBack }) => {
  const { playHover, playUnhover, playClick } = useSoundEffects();
  return (
  <div className="text-center max-w-4xl">
    <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 game-title">
      GOODBYE
    </h2>
    <p className="text-lg md:text-xl theme-text mb-6 md:mb-8">
      Thanks for visiting my portfolio. May your games be legendary!
    </p>
    <button
      onClick={() => {
        playClick();
        onBack();
      }}
      onMouseEnter={playHover}
      onMouseLeave={playUnhover}
      onFocus={playHover}
      onBlur={playUnhover}
      className="theme-button px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold"
    >
      Return Home
    </button>
  </div>
  );
};

export default ExitSection;
