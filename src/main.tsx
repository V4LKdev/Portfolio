/**
 * Main Application Entry Point
 *
 * This file initializes the React application and renders the root App component.
 * It's the starting point for the entire portfolio application.
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize the new theme system
import { initializeThemeSystem } from "@/themes";

// Initialize theme system early to prevent FOUC
initializeThemeSystem().catch(console.error);

// Initialize React application with root element
createRoot(document.getElementById("root")!).render(<App />);
