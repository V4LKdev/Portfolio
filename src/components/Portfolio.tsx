// Portfolio.tsx
// Main portfolio component that routes between Desktop and Mobile versions
// Uses screen size detection to provide optimal experience for each device type

import * as React from 'react';
import { useEffect, useState } from 'react';
import DesktopPortfolio from './desktop/DesktopPortfolio';
import MobilePortfolio from './mobile/MobilePortfolio';

const Portfolio = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen is mobile-sized
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Initial check
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Render appropriate component based on screen size
  return isMobile ? <MobilePortfolio /> : <DesktopPortfolio />;
};

export default Portfolio;
