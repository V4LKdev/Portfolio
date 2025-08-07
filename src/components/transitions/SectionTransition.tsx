/**
 * SectionTransition.tsx
 * 
 * Section-to-section transition for inner-page navigation.
 * Used for home ↔ projects/about/skills/contact transitions.
 * Purely prop-driven - no internal state or closures.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SectionTransitionProps {
  /** Whether to use reduced motion */
  reduceMotion: boolean;
  /** Content opacity (0-1) */
  opacity: number;
  /** Optional scale effect (0-1, where 1 = normal size) */
  scale?: number;
  /** Content to display */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Transition duration override (optional) */
  duration?: number;
}

/**
 * Section transition component
 * Features cross-fade with optional scale effect for inner-page navigation
 * Can be enhanced with slide/blur effects in future iterations
 */
export const SectionTransition: React.FC<SectionTransitionProps> = ({
  reduceMotion,
  opacity,
  scale = 1,
  children,
  className = '',
  duration
}) => {
  // Calculate duration based on reduce motion preference
  const transitionDuration = duration ?? (reduceMotion ? 0.1 : 0.3);

  return (
    <motion.div
      animate={{ 
        opacity,
        scale
      }}
      transition={{ 
        duration: transitionDuration, 
        ease: reduceMotion ? 'linear' : 'easeInOut'
      }}
      className={className}
      style={{ 
        height: '100%', 
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  );
};

export default SectionTransition;
