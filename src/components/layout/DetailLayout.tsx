// Detail Layout Component
// Specialized layout for the Project Detail page.
// Provides a full-bleed layout with no padding.

import React from "react";
import Layout from "./Layout";
import { SectionProps } from "../../types/SharedProps";

interface DetailLayoutProps extends SectionProps {
  /** Child content to render within the layout */
  children: React.ReactNode;
}

/**
 * Layout wrapper for the project detail page.
 * Applies a full-bleed background and removes outer padding.
 */
const DetailLayout: React.FC<DetailLayoutProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <Layout
      showVideoBackground={false}
      isInnerPage={true}
      disablePadding={true} // This is the key feature of this layout
      className={className}
      id={id}
    >
      {children}
    </Layout>
  );
};

export default DetailLayout;
