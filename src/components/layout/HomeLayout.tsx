/**
 * Home Layout Component
 * Specialized layout for the home/landing page
 * Includes video background and game-style navigation menu
 */

import React from "react";
import Layout from "./Layout";
import { SectionProps } from "../../types/SharedProps";

interface HomeLayoutProps extends SectionProps {
  /** Child content to render within the home layout */
  children: React.ReactNode;
  /** Navigation menu content */
  menu?: React.ReactNode;
}

/**
 * Layout wrapper for the home page
 * Includes video background and navigation elements positioned like the original design
 */
const HomeLayout: React.FC<HomeLayoutProps> = ({
  children,
  menu,
  className,
  id,
}) => {
  return (
    <Layout
      showVideoBackground={false}
      showSidePanels={false} // We'll handle side panels differently for home
      isInnerPage={false}
      className={className}
      id={id}
    >
      {" "}
      {/* Left Side Navigation Menu */}
      {menu}
      {/* Main Content Area */}
      <div className="relative z-10 content-area lg:ml-sidebar h-full">
        <div className="h-full px-4 md:px-6 lg:px-8 pt-6 md:pt-8 content-area flex items-center">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </Layout>
  );
};

export default HomeLayout;
