/**
 * BackgroundRoot.tsx
 *
 * Persistent background layer (video + fallback image + overlay) for the portfolio sections
 * (Home, Projects, About, Skills, Contact, Additional). This component is mounted once inside
 * the Portfolio tree so it is not present on Onboarding or Exit routes.
 */

import React from "react";
// Purged background video; render a static image with overlay for now
import { videoConfig } from "../../content";

interface BackgroundRootProps {
  className?: string;
}

const BackgroundRoot: React.FC<BackgroundRootProps> = ({ className }) => {
  return (
    <div className={`fixed inset-0 z-0 ${className ?? ""}`} aria-hidden>
      {/* Static background image placeholder */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${videoConfig.posterSrc})` }}
      />
      {/* Keep the visual overlay to match previous appearance */}
      <div className="absolute inset-0 video-overlay" />
    </div>
  );
};

export default BackgroundRoot;
