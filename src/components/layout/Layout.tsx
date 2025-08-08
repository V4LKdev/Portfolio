/**
 * Layout.tsx
 *
 * This is the main layout component for the entire application.
 * It handles the video background, side panels, and other global layout elements.
 */

import React from "react";
import SocialMediaIcons from "../media/SocialMediaIcons";
import SettingsPanel from "../panels/SettingsPanel";
import { SectionProps } from "../../types/SharedProps";

interface LayoutProps extends SectionProps {
  children: React.ReactNode;
  showVideoBackground?: boolean;
  showSidePanels?: boolean;
  backgroundImage?: string;
  isInnerPage?: boolean;
  /** Controls backdrop intensity for inner pages */
  innerOverlayVariant?: "default" | "deep";
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  id,
  showSidePanels = true,
  // The following props are kept for API compatibility but ignored;
  // background is handled by BackgroundRoot at the Portfolio level now.
  showVideoBackground: _showVideoBackground,
  backgroundImage: _backgroundImage,
  isInnerPage = false,
  innerOverlayVariant = "default",
}) => {
  const overlayClasses =
    innerOverlayVariant === "deep"
      ? "fixed inset-0 z-10 pointer-events-none bg-black/50 backdrop-blur-md"
      : "fixed inset-0 z-10 pointer-events-none bg-black/40 backdrop-blur-sm";
  return (
    <div
      className={`h-screen bg-transparent text-foreground overflow-hidden ${className ?? ""}`}
      id={id}
    >
      {showSidePanels && (
        <>
          <SocialMediaIcons className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-30" />

          {!isInnerPage && (
            <SettingsPanel className="absolute bottom-12 md:bottom-14 left-8 md:left-12" />
          )}
        </>
      )}
      {/* Backdrop effects for inner sections: sits above background (z-0) and below content (z-20) */}
      {isInnerPage && <div className={overlayClasses} aria-hidden />}
      <div
        className={`relative z-20 h-full ${isInnerPage ? "p-8 overflow-y-auto" : "p-4 md:p-8"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
