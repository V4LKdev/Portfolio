/**
 * HomeSection.tsx
 *
 * Main landing page component that serves as the entry point to the portfolio.
 * Features a clean, minimalist design with gaming-inspired navigation menu.
 * The content is intentionally minimal to maintain focus on the navigation experience.
 */

import { HomeSectionComponent } from "../../types/SharedProps";

/**
 * Landing page section component
 *
 * Provides the main entry experience for portfolio visitors with minimal content
 * to maintain focus on the game-style navigation menu.
 *
 * @param onNavigateToProjects - Navigation callback (unused in current minimal design)
 * @param className - Additional CSS classes for styling
 * @param id - Component identifier for targeting
 * @returns JSX element for the home section
 */
const HomeSection: HomeSectionComponent = ({
  onNavigateToProjects: _onNavigateToProjects,
  className,
  id,
}) => {
  return (
    <div
      className={`text-left max-w-4xl pt-8 transition-all duration-500 animate-fade-in no-select ${className ?? ""}`}
      id={id}
    >
      {/* Content intentionally minimal to maintain focus on navigation menu */}
    </div>
  );
};

export default HomeSection;
