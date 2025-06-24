// Shared Props Types
// Common props used across section components for consistency
// Provides standard interface for section-level components

/**
 * Standard props for all section components
 * Ensures consistent interface across the portfolio
 */
export interface SectionProps {
  /** Optional CSS class name for styling customization */
  className?: string;
  /** Optional ID for anchor links and navigation */
  id?: string;
}

/**
 * Extended section props that include navigation callback
 * Used by sections that need back navigation functionality
 */
export interface NavigableSectionProps extends SectionProps {
  /** Callback function for back navigation */
  onBack: () => void;
}

/**
 * Props for the main home section
 * Includes navigation to projects functionality
 */
export interface HomeSectionProps extends SectionProps {
  /** Callback to navigate to projects section */
  onNavigateToProjects: () => void;
}
