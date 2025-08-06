/**
 * useNavigation.ts
 *
 * Custom hook for accessing the navigation context.
 */

import { useContext } from "react";
import { NavigationContext } from "../contexts/NavigationContext";

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