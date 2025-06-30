/**
 * Layout Component
 * Provides consistent page structure and shared UI elements
 * Handles background, navigation, and common layout patterns
 */

import React from "react";
import LocalVideoBackground from "../media/LocalVideoBackground";
import SocialMediaIcons from "../media/SocialMediaIcons";
import SettingsPanel from "../panels/SettingsPanel";
import { SectionProps } from "../../types/SharedProps";
import { useVideoControls } from "../../hooks/useVideoControls";
import { videoConfig } from "../../content";

interface LayoutProps extends SectionProps {
  /** Child content to render within the layout */
  children: React.ReactNode;
  /** Whether to show the video background (default: true) */
  showVideoBackground?: boolean;
  /** Whether to show the side panels (default: true) */
  showSidePanels?: boolean;
  /** Custom background image URL (overrides video background) */
  backgroundImage?: string;
  /** Whether this is an inner page (affects styling) */
  isInnerPage?: boolean;
}

/**
 * Main layout wrapper component
 * Provides consistent structure across all pages and sections
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  id,
  showVideoBackground = true,
  showSidePanels = true,
  backgroundImage,
  isInnerPage = false,
}) => {
  const { isPaused, isMuted } = useVideoControls();
  return (
    <div
      className={`h-screen bg-black text-foreground overflow-hidden ${className ?? ""}`}
      id={id}
    >
      {/* Background Video or Static Image */}
      {showVideoBackground && !backgroundImage && (
        <div className="fixed inset-0 z-0">
          <LocalVideoBackground
            videoSrc={videoConfig.localVideoSrc}
            posterSrc={videoConfig.posterSrc}
            isPaused={isPaused}
            isMuted={isMuted}
            className="video-responsive"
          />
          <div className="absolute inset-0 video-overlay" />
        </div>
      )}
      {/* Static Background Image */}
      {backgroundImage && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 video-overlay" />
        </div>
      )}
      {/* Side Panels - positioned like the original design */}
      {showSidePanels && (
        <>
          {/* Social Media Icons - Bottom Right */}
          <SocialMediaIcons className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-30" />

          {/* Settings Panel - moved to navigation for home, or bottom left for others */}
          {!isInnerPage && (
            <SettingsPanel className="absolute bottom-12 md:bottom-14 left-8 md:left-12" />
          )}
        </>
      )}{" "}
      {/* Main Content */}
      <div
        className={`relative z-20 h-full ${isInnerPage ? "p-8 overflow-y-auto" : "p-4 md:p-8"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
