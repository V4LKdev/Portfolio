import React from "react";
import { NavigationContext } from "./NavigationContext";
import { useNavigationSync } from "../hooks/useNavigationSync";

interface NavigationProviderProps {
  readonly children: React.ReactNode;
}

/**
 * NavigationProvider
 * Provides global navigation state and actions to the app.
 * Handles section navigation, project selection, mobile menu, and project filtering.
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
  const navigationValue = useNavigationSync();

  return (
    <NavigationContext.Provider value={navigationValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export default NavigationProvider;
