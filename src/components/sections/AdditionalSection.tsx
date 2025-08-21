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
      Hobbies & Interests
    </h2>
    <div className="theme-card-static rounded-2xl p-12 shadow-2xl border border-accent/20 bg-zinc-900/95 text-center">
      <p className="theme-text text-lg md:text-xl mb-6 max-w-2xl mx-auto">
        This section is under development. I’m polishing the layout and content for hobbies, creative projects and extracurricular work.
        <br /> Check back soon.
      </p>
    </div>
  </div>
  );
};

export default AdditionalSection;
