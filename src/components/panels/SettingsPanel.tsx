// SettingsPanel.tsx
// Professional settings panel with video and audio controls
// Extracted from Portfolio component for better modularity

import * as React from "react";
import { useState, useEffect } from "react";
import { useVideo } from "../../hooks/useVideo";
import {
  Settings,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
// Purge: temporarily disable settings functionality

interface SettingsPanelProps {
  className?: string;
}

/**
 * Professional settings panel component
 * Features:
 * - Video playback controls
 * - SFX (Sound Effects) controls
 * - Click-outside-to-close functionality
 * - Accessible keyboard navigation
 */
const SettingsPanel: React.FC<SettingsPanelProps> = ({ className = "" }) => {
  const { videoEnabled, toggleVideo } = useVideo();
  // For now, treat "paused" as the inverse of videoEnabled
  const isPaused = !videoEnabled;
  const isMuted = true;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- Click Outside to Close ---
  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const settingsPanel = document.querySelector("[data-settings-panel]");
      if (settingsPanel && !settingsPanel.contains(target)) {
        setIsSettingsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  // --- Keyboard Controls ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape" && isSettingsOpen) {
        event.preventDefault();
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen]);

  return (
    <div className={className}>
      {!isSettingsOpen ? (
        /* Settings Gear Button */
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
          data-settings-panel
          style={{
            backgroundColor:
              "var(--theme-settings-panel-bg, rgba(30, 41, 59, 0.9))",
            borderColor: "var(--theme-settings-panel-border, rgb(59 130 246))",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
          aria-label="Open settings menu"
          aria-expanded={false}
          aria-haspopup="true"
        >
          <Settings
            className="w-5 h-5"
            style={{ color: "var(--theme-settings-icon, rgb(248 250 252))" }}
          />
        </button>
      ) : (
        /* Expanded Settings Menu */
        <div
          className="flex items-center space-x-1 rounded-lg backdrop-blur-sm"
          data-settings-panel
          style={{
            backgroundColor:
              "var(--theme-settings-panel-bg, rgba(30, 41, 59, 0.9))",
            borderColor: "var(--theme-settings-panel-border, rgb(59 130 246))",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          {/* Collapse Button */}
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-3 transition-all duration-300 hover:scale-110"
            aria-label="Close settings menu"
            title="Close settings menu"
          >
            <ChevronLeft className="w-5 h-5 settings-panel-icon" />
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className="p-3 transition-all duration-300 hover:scale-110"
            aria-label={
              isPaused ? "Play background video" : "Pause background video"
            }
            title={
              isPaused ? "Play background video" : "Pause background video"
            }
          >
            {isPaused ? (
              <Play className="w-5 h-5 settings-panel-icon" />
            ) : (
              <Pause className="w-5 h-5 settings-panel-icon" />
            )}
          </button>

          {/* SFX Toggle */}
          <button
            onClick={() => {}}
            className="p-3 transition-all duration-300 hover:scale-110"
            aria-label={isMuted ? "Enable sound effects" : "Disable sound effects"}
            title={isMuted ? "Enable sound effects" : "Disable sound effects"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 settings-panel-icon" />
            ) : (
              <Volume2 className="w-5 h-5 settings-panel-icon" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
