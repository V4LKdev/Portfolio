/**
 * PageTransition.tsx
 * 
 * Full page transition with black overlay and loading spinner.
 * Used for major page changes (onboarding ↔ home ↔ exit).
 * Clean implementation matching the old working system.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CornerSpinner } from './CornerSpinner';

interface PageTransitionProps {
  /** Whether to use reduced motion */
  reduceMotion: boolean;
  /** Content opacity (0-1) - controls page content visibility */
  pageOpacity: number;
  /** Overlay opacity (0-1) - controls black overlay visibility */
  overlayOpacity: number;
  /** Whether to show loading spinner */
  showSpinner: boolean;
  /** Content to display */
  children: React.ReactNode;
}

/**
 * Full page transition component - matches old working system
 * Two separate motion.div elements: one for content, one for overlay
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  reduceMotion,
  pageOpacity,
  overlayOpacity,
  showSpinner,
  children
}) => {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Page content - animated opacity */}
      <motion.div
        animate={{ opacity: pageOpacity }}
        transition={{ 
          duration: reduceMotion ? 0.15 : 0.18, 
          ease: 'linear' 
        }}
        style={{ height: '100%' }}
      >
        {children}
      </motion.div>
      
      {/* Black overlay (hidden in reduced motion mode) */}
      {!reduceMotion && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.18, ease: 'linear' }}
        />
      )}
      
      {/* Loading spinner (only shown in full animation mode) */}
      {!reduceMotion && showSpinner && <CornerSpinner />}
    </div>
  );
};

export default PageTransition;
