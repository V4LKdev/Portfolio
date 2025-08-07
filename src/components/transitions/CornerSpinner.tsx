/**
 * CornerSpinner.tsx
 *
 * Loading spinner component displayed during route transitions.
 * Features a single white arc animation in the bottom-right corner.
 */

import React from "react";

export const CornerSpinner: React.FC = () => (
  <div
    style={{
      position: "fixed",
      right: 20,
      bottom: 20,
      zIndex: 1100,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    aria-label="Loading..."
  >
    <div
      style={{
        width: 28,
        height: 28,
        border: "3px solid transparent",
        borderTop: "3px solid #fff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        background: "transparent",
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);
