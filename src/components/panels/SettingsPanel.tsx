// SettingsPanel.tsx
// Professional settings panel with theme, video, and audio controls
// Extracted from Portfolio component for better modularity

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Settings,
  ChevronLeft,
  Palette,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useVideoControls } from "../../hooks/useVideoControls";

interface SettingsPanelProps {
  className?: string;
}

/**
 * Professional settings panel component
 * Features:
 * - Theme cycling through available themes
 * - Video playback controls
 * - Audio controls
 * - Click-outside-to-close functionality
 * - Accessible keyboard navigation
 */
const SettingsPanel: React.FC<SettingsPanelProps> = ({ className = "" }) => {
  const { cycleTheme, currentTheme } = useTheme();
  const { isPaused, isMuted, togglePlayback, toggleMute } = useVideoControls();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Get current theme display name
  const getCurrentThemeName = (): string => {
    return currentTheme?.name ?? "Unknown";
  };

  // Get appropriate icon for theme button
  const getThemeIcon = () => {
    return <Palette className="w-5 h-5 settings-panel-icon" />;
  };

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
            style={{ color: "var(--theme-settings-icon, rgb(253 230 138))" }}
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

          {/* Separator Line */}
          <div
            className="w-px h-6"
            style={{
              backgroundColor:
                "var(--theme-settings-panel-border, rgb(59 130 246))",
            }}
          />

          {/* Theme Cycle Button */}
          <button
            onClick={cycleTheme}
            className="p-3 transition-all duration-300 hover:scale-110"
            aria-label="Cycle to next theme"
            title={`Current: ${getCurrentThemeName()}. Click to cycle themes.`}
          >
            {getThemeIcon()}
          </button>

          {/* Video Toggle */}
          <button
            onClick={togglePlayback}
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

          {/* Audio Toggle */}
          <button
            onClick={toggleMute}
            className="p-3 transition-all duration-300 hover:scale-110"
            aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
            title={isMuted ? "Unmute video audio" : "Mute video audio"}
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
