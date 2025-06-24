// Section Layout Component
// Specialized layout for section pages (About, Skills, Projects, Contact)
// Provides consistent inner page structure with static backgrounds

import React from "react";
import Layout from "./Layout";
import { SectionProps } from "../../types/SharedProps";
import { backgroundImages } from "../../content";

interface SectionLayoutProps extends SectionProps {
  /** Child content to render within the section layout */
  children: React.ReactNode;
  /** Section name for background selection */
  section: keyof typeof backgroundImages;
  /** Optional custom background image (overrides section default) */
  customBackground?: string;
}

/**
 * Layout wrapper for section pages
 * Automatically applies appropriate background and inner page styling
 */
const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  section,
  customBackground,
  className,
  id,
}) => {
  const backgroundImage = customBackground || backgroundImages[section];

  return (
    <Layout
      showVideoBackground={false}
      backgroundImage={backgroundImage}
      isInnerPage={true}
      className={className}
      id={id}
    >
      {children}
    </Layout>
  );
};

export default SectionLayout;
