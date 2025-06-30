/**
 * Main Application Entry Point
 *
 * This file initializes the React application and renders the root App component.
 * It's the starting point for the entire portfolio application.
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize React application with root element
createRoot(document.getElementById("root")!).render(<App />);
