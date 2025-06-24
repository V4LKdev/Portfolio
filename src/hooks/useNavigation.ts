/**
 * Navigation Hook
 *
 * Custom hook for accessing navigation state and actions throughout the application.
 * Must be used within AppProviders context.
 *
 * @returns Navigation state and actions
 * @throws Error if used outside AppProviders
 *
 * @example
 * ```tsx
 * const { currentSection, handleMenuClick } = useNavigation();
 * ```
 */
import { useContext } from "react";
import { NavigationContext } from "../components/AppProviders";

export const useNavigation = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "useNavigation must be used within AppProviders. " +
        "Make sure your component is wrapped with <AppProviders>.",
    );
  }

  return context;
};
