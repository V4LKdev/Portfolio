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

/**
 * Generic section component type for extensibility
 * @template P - Additional props extending SectionProps
 */
export type SectionComponent<P = object> = React.FC<SectionProps & P>;

/**
 * Generic navigable section component type
 * @template P - Additional props extending NavigableSectionProps
 */
export type NavigableSectionComponent<P = object> = React.FC<
  NavigableSectionProps & P
>;

/**
 * Theme-aware component props
 * For components that need theme context
 */
export interface ThemeAwareProps {
  /** Optional theme override */
  theme?: string;
}

/**
 * Strict readonly wrapper for configuration objects
 * Ensures immutability of config data
 */
export type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P];
};
