// Section Layout Component
// Specialized layout for section pages (About, Skills, Projects, Contact)
// Provides consistent inner page structure with static backgrounds

import React from "react";
import Layout from "./Layout";
import { SectionProps } from "../../types/SharedProps";
// Background images removed in favor of persistent shared background

interface SectionLayoutProps extends SectionProps {
  /** Child content to render within the section layout */
  children: React.ReactNode;
  /** Section name (kept for semantics, no longer used to select background) */
  section: string;
  /** Optional custom background image (overrides section default) */
  customBackground?: string;
  /** Optional overlay variant for inner pages */
  overlayVariant?: "default" | "deep";
  /** Disable layout padding for edge-to-edge presentations */
  disablePadding?: boolean;
}

/**
 * Layout wrapper for section pages
 * Automatically applies appropriate background and inner page styling
 */
const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  section: _section,
  customBackground: _customBackground,
  className,
  id,
  overlayVariant,
  disablePadding,
}) => {
  return (
    <Layout
      showVideoBackground={false}
      innerOverlayVariant={overlayVariant}
      isInnerPage={true}
      disablePadding={disablePadding}
      className={className}
      id={id}
    >
      {children}
    </Layout>
  );
};

export default SectionLayout;
