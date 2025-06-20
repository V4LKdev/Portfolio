// MobilePortfolio.tsx
// Mobile-specific portfolio component for Nicolas Martin's website
// Optimized layout and navigation for mobile/touch devices
//
// TODO: Implement mobile-friendly layout, touch navigation, and responsive design
// This component will be used when screen size is below desktop breakpoint

import * as React from 'react';

const MobilePortfolio = () => {
  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Placeholder for mobile portfolio implementation */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-100 mb-4">
            Nicolas Martin
          </h1>
          <p className="text-amber-200/80 text-lg mb-8">
            Mobile Portfolio Coming Soon
          </p>
          <p className="text-amber-200/60 text-sm">
            This mobile-optimized version is currently under development.
            <br />
            Please visit on desktop for the full experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobilePortfolio;
