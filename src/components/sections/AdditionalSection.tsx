/**
 * AdditionalSection.tsx
 *
 * Placeholder section for future portfolio content beyond programming projects.
 * This section is reserved for music career, creative projects, and other endeavors.
 */

import React from "react";
import { useSoundEffects } from "../../hooks/useSoundEffects";

interface AdditionalSectionProps {
  /** Navigation callback to return to the home page */
  onBack: () => void;
}

/**
 * Additional content section component
 *
 * Provides a placeholder for future non-programming portfolio content
 * with consistent theming and navigation.
 *
 * @param onBack - Function to handle navigation back to home
 * @returns JSX element for the additional section
 */
const AdditionalSection: React.FC<AdditionalSectionProps> = ({ onBack }) => {
  const { playHover, playUnhover, playClick } = useSoundEffects();
  return (
  <div className="max-w-4xl mx-auto">
    <button
      onClick={() => {
        playClick();
        onBack();
      }}
      onMouseEnter={playHover}
      onMouseLeave={playUnhover}
      onFocus={playHover}
      onBlur={playUnhover}
      className="mb-8 flex items-center space-x-2 theme-back-button"
    >
      <span>← Back to Home</span>
    </button>
    <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center game-title">
      ADDITIONAL CONTENT
    </h2>
    <div className="theme-card rounded-lg p-6 md:p-8 atmospheric-glow text-center">
      <p className="text-lg md:text-xl theme-text mb-6 md:mb-8">
        This section is reserved for future content including music career,
        creative projects, and other endeavors beyond programming.
      </p>
      <p className="theme-text-muted">Coming soon...</p>
    </div>
  </div>
  );
};

export default AdditionalSection;
