/**
 * Navigation Hook
 * 
 * Custom hook for accessing navigation state and actions throughout the application.
 * Must be used within a NavigationProvider context.
 * 
 * @returns Navigation state and actions
 * @throws Error if used outside NavigationProvider
 * 
 * @example
 * ```tsx
 * const { currentSection, handleMenuClick } = useNavigation();
 * ```
 */
import { useContext } from "react";
import { NavigationContext } from "../components/NavigationProvider";

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error(
      "useNavigation must be used within NavigationProvider. " +
      "Make sure your component is wrapped with <NavigationProvider>."
    );
  }
  
  return context;
};
