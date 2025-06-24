// LocalVideoBackground.tsx
// Efficient local video background with smart scaling, fallbacks, and memory management
// Replaces YouTube iframe with native HTML5 video for better performance and control

import * as React from "react";
import { useRef, useState, useEffect } from "react";

interface LocalVideoBackgroundProps {
  videoSrc: string;
  posterSrc?: string;
  isPaused: boolean;
  isMuted: boolean;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: () => void;
  className?: string;
}

/**
 * Local video background component with smart scaling and fallback handling
 * Features:
 * - Object-fit: cover for natural scaling without stretching
 * - Fallback poster image for loading/error states
 * - Memory management and cleanup
 * - Browser visibility detection for better performance
 * - Proper aspect ratio handling
 */
const LocalVideoBackground: React.FC<LocalVideoBackgroundProps> = ({
  videoSrc,
  posterSrc,
  isPaused,
  isMuted,
  onLoadStart,
  onLoadComplete,
  onError,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [wasPlayingBeforeHidden, setWasPlayingBeforeHidden] = useState(false);
  // Handle browser visibility changes for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video || hasError) return;

      if (document.hidden) {
        // Browser tab is hidden - pause video to save resources
        if (!video.paused) {
          setWasPlayingBeforeHidden(true);
          video.pause();
        }
      } else if (wasPlayingBeforeHidden && !isPaused) {
        // Browser tab is visible again - resume if it was playing before
        setWasPlayingBeforeHidden(false);
        video.play().catch(console.warn);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPaused, hasError, wasPlayingBeforeHidden]); // Handle play/pause state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError) return;

    if (isPaused) {
      video.pause();
      setShowPoster(true);
    } else {
      // Hide poster immediately when resuming
      setShowPoster(false);
      video.play().catch((error) => {
        console.warn("Video autoplay failed:", error);
        setHasError(true);
        onError?.();
      });
    }
  }, [isPaused, hasError, onError]);

  // Handle mute state changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  // Video event handlers
  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setShowPoster(true);
    onError?.();
    if (process.env.NODE_ENV !== "production") {
      console.error("Video failed to load:", videoSrc);
    }
  };

  const handleLoadedData = () => {
    if (!isPaused) {
      setShowPoster(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {" "}
      {/* Video Element */}{" "}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
        poster={posterSrc}
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-label="Background video"
        aria-hidden="true"
        tabIndex={-1}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onLoadedData={handleLoadedData}
        style={{
          opacity: isLoading || hasError || showPoster ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <track kind="captions" src="" label="No captions available" />
      </video>
      {/* Poster/Fallback Image */}
      {(isLoading || hasError || showPoster) && posterSrc && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${posterSrc})`,
            transition: "opacity 0.5s ease-in-out",
          }}
          aria-hidden="true"
        />
      )}
      {/* Loading Indicator - Centered for better UX */}
      {isLoading && !hasError && (
        <output
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          aria-live="polite"
        >
          <div className="flex items-center space-x-3 text-amber-200 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-200 border-t-transparent"></div>
            <span className="text-sm font-medium">Loading video...</span>
          </div>
        </output>
      )}
      {/* Error State - Centered bottom for better visibility */}
      {hasError && (
        <output
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/90 backdrop-blur-sm border border-red-500/50 rounded-lg px-4 py-2 shadow-lg"
          aria-live="assertive"
        >
          <p className="text-red-200 text-sm font-medium">
            ⚠️ Video unavailable - showing fallback image
          </p>
        </output>
      )}
    </div>
  );
};

export default LocalVideoBackground;
