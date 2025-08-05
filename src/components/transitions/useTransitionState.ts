/**
 * useTransitionState.ts
 *
 * Custom hook that manages route transition state and animations.
 * Supports both full animation mode and reduced motion mode for accessibility.
 */

import { useState, useEffect } from 'react';
import type { Location } from 'react-router-dom';

type TransitionState = 'idle' | 'fadingOut' | 'loading' | 'fadingIn';

interface UseTransitionStateProps {
  location: Location;
  displayedLocation: Location;
  setDisplayedLocation: (location: Location) => void;
  reduceMotion: boolean;
}

interface UseTransitionStateReturn {
  transitionState: TransitionState;
  pageOpacity: number;
  overlayOpacity: number;
  showSpinner: boolean;
  handleLocationChange: () => void;
}

export const useTransitionState = ({
  location,
  displayedLocation: _displayedLocation,
  setDisplayedLocation,
  reduceMotion
}: UseTransitionStateProps): UseTransitionStateReturn => {
  const [transitionState, setTransitionState] = useState<TransitionState>('idle');
  const [pageOpacity, setPageOpacity] = useState(1);
  const [showSpinner, setShowSpinner] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<Location | null>(null);

  // Unified fade logic for both modes: state machine always used
  const handleLocationChange = () => {
    setPendingLocation(location);
    setTransitionState('fadingOut');
    setPageOpacity(1);
    setTimeout(() => setPageOpacity(0), 10);
  };

  // State machine for both modes, with different timings and spinner for reduced motion
  useEffect(() => {
    if (transitionState !== 'fadingOut') return;
    const duration = reduceMotion ? 80 : 180;
    const timer = setTimeout(() => {
      setTransitionState('loading');
      if (!reduceMotion) setShowSpinner(true);
      setPageOpacity(0);
    }, duration);
    return () => clearTimeout(timer);
  }, [transitionState, reduceMotion]);

  useEffect(() => {
    if (transitionState !== 'loading' || !pendingLocation) return;
    const duration = reduceMotion ? 120 : 800;
    const timer = setTimeout(() => {
      setTransitionState('fadingIn');
      setDisplayedLocation(pendingLocation);
      setShowSpinner(false);
      setPageOpacity(0);
      setTimeout(() => setPageOpacity(1), 10);
      setPendingLocation(null);
    }, duration);
    return () => clearTimeout(timer);
  }, [transitionState, pendingLocation, setDisplayedLocation, reduceMotion]);

  useEffect(() => {
    if (transitionState !== 'fadingIn') return;
    const duration = reduceMotion ? 80 : 180;
    const timer = setTimeout(() => {
      setTransitionState('idle');
    }, duration);
    return () => clearTimeout(timer);
  }, [transitionState, reduceMotion]);

  // Calculate overlay opacity (only used in full animation mode)
  let overlayOpacity = 0;
  if (!reduceMotion) {
    if (transitionState === 'fadingOut') overlayOpacity = 1;
    if (transitionState === 'loading') overlayOpacity = 1;
    if (transitionState === 'fadingIn') overlayOpacity = 1;
  }

  return {
    transitionState,
    pageOpacity,
    overlayOpacity,
    showSpinner: !reduceMotion && showSpinner,
    handleLocationChange
  };
};
