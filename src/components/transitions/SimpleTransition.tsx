/**
 * SimpleTransition.tsx
 * 
 * A simple fade transition component with no complex state.
 * Purely prop-driven - no closures or internal state to cause issues.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SimpleTransitionProps {
  /** Whether to use reduced motion */
  reduceMotion: boolean;
  /** Content opacity (0-1) */
  opacity: number;
  /** Transition duration override (optional) */
  duration?: number;
  /** Content to display */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Transition style */
  style?: React.CSSProperties;
}

/**
 * Simple fade transition - just opacity animation
 * No internal state, purely controlled by props
 */
export const SimpleTransition: React.FC<SimpleTransitionProps> = ({
  reduceMotion,
  opacity,
  duration,
  children,
  className = '',
  style = {}
}) => {
  // Calculate duration based on reduce motion preference
  const transitionDuration = duration ?? (reduceMotion ? 0.1 : 0.3);

  return (
    <motion.div
      animate={{ opacity }}
      transition={{ 
        duration: transitionDuration, 
        ease: 'linear' 
      }}
      className={className}
      style={{ 
        height: '100%', 
        width: '100%',
        ...style 
      }}
    >
      {children}
    </motion.div>
  );
};

export default SimpleTransition;
