// AppProviders.tsx
// Consolidated global providers for navigation and video state

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { type Project } from "../content";
import { VideoPreferences } from "../lib/cookies";

// -------------------- Video Control Context & Provider --------------------

interface VideoState {
  isPaused: boolean;
  isMuted: boolean;
  isManuallyPaused: boolean;
}

interface VideoActions {
  togglePlayback: () => void;
  toggleMute: () => void;
  setManualPause: (paused: boolean) => void;
}

export interface VideoControlContextType extends VideoState, VideoActions {}

export const VideoControlContext =
  createContext<VideoControlContextType | null>(null);

// -------------------- Navigation Context & Provider --------------------

interface NavigationState {
  currentSection: string;
  selectedProject: Project | null;
  projectFilter: string;
  isMobileMenuOpen: boolean;
}

interface NavigationActions {
  setCurrentSection: (section: string) => void;
  setSelectedProject: (project: Project | null) => void;
  setProjectFilter: (filter: string) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleMenuClick: (sectionId: string) => void;
  handleProjectClick: (project: Project) => void;
  handleBackClick: () => void;
}

export interface NavigationContextType
  extends NavigationState,
    NavigationActions {}

export const NavigationContext = createContext<NavigationContextType | null>(
  null,
);

// -------------------- AppProviders Component --------------------

interface AppProvidersProps {
  readonly children: React.ReactNode;
}

/**
 * AppProviders
 *
 * Consolidated global providers for navigation and video state management.
 * Provides all context needed for the portfolio application:
 *
 * Video Features:
 * - Cookie-based preference persistence (remembers user settings across sessions)
 * - Auto-pause when navigating away from home (for performance)
 * - Auto-resume when returning to home (respects user's manual pause intent)
 * - Tab visibility handling (auto-resumes when tab becomes visible)
 * - Media session integration (responds to hardware media keys)
 * - Keyboard controls (space bar, media keys)
 * - Video element synchronization
 *
 * Navigation Features:
 * - Section navigation (home, projects, about, skills, contact)
 * - Project detail navigation
 * - Mobile menu state management
 * - Project filtering
 *
 * @param children - Child components that need access to global state
 */
export function AppProviders({ children }: AppProvidersProps) {
  // --- Video State ---
  const [isPaused, setIsPaused] = useState(() => VideoPreferences.getPaused());
  const [isMuted, setIsMuted] = useState(() => VideoPreferences.getMuted());
  const [isManuallyPaused, setIsManuallyPaused] = useState(() =>
    VideoPreferences.getPaused(),
  );

  const togglePlayback = useCallback(() => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    setIsManuallyPaused(newPausedState);
    VideoPreferences.setPaused(newPausedState);
  }, [isPaused]);

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    VideoPreferences.setMuted(newMutedState);
  }, [isMuted]);
  const setManualPause = useCallback((paused: boolean) => {
    setIsPaused(paused);
    setIsManuallyPaused(paused);
    VideoPreferences.setPaused(paused);
  }, []);

  // Media Session Integration
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => {
        if (isPaused) togglePlayback();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        if (!isPaused) togglePlayback();
      });
      return () => {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
      };
    }
  }, [isPaused, togglePlayback]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shouldHandleSpace =
        event.code === "Space" && event.target === document.body;
      const shouldHandleMediaKey =
        event.code === "MediaPlayPause" ||
        (event.code === "MediaPlay" && isPaused) ||
        (event.code === "MediaPause" && !isPaused);
      if (shouldHandleSpace || shouldHandleMediaKey) {
        event.preventDefault();
        togglePlayback();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, togglePlayback]);

  // Video Element Sync
  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) return;
    const handlePlay = () => {
      if (isPaused) {
        setIsPaused(false);
        setIsManuallyPaused(false);
      }
    };
    const handlePause = () => {
      if (!isPaused) {
        setIsPaused(true);
        setIsManuallyPaused(true);
      }
    };
    const handleVolumeChange = () => {
      if (video.muted !== isMuted) {
        setIsMuted(video.muted);
      }
    };
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [isPaused, isMuted]); // Tab Visibility Resume Logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const shouldBePaused = VideoPreferences.getPaused();
        setIsPaused(shouldBePaused);
        setIsManuallyPaused(shouldBePaused);
        if (!shouldBePaused) {
          const video = document.querySelector("video");
          if (video?.paused) {
            video.play().catch(() => {});
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const videoValue = useMemo<VideoControlContextType>(
    () => ({
      isPaused,
      isMuted,
      isManuallyPaused,
      togglePlayback,
      toggleMute,
      setManualPause,
    }),
    [
      isPaused,
      isMuted,
      isManuallyPaused,
      togglePlayback,
      toggleMute,
      setManualPause,
    ],
  );
  // --- Navigation State ---
  const [currentSection, setCurrentSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);  // Track the user's pause state before navigation to restore it later
  const [pauseStateBeforeNavigation, setPauseStateBeforeNavigation] =
    React.useState<boolean | null>(null);
  
  // Use a ref to track the current manual pause state for capture
  const manualPauseRef = React.useRef(isManuallyPaused);
  React.useEffect(() => {
    manualPauseRef.current = isManuallyPaused;
  }, [isManuallyPaused]);
  // Auto-pause when leaving home, auto-resume when returning
  useEffect(() => {
    console.log("🔄 Navigation effect - currentSection:", currentSection, "pauseStateBeforeNavigation:", pauseStateBeforeNavigation);
    
    if (currentSection !== "home") {      // Only store the state if we haven't already (avoid overwriting on subsequent navigations)
      if (pauseStateBeforeNavigation === null) {
        const currentManualState = manualPauseRef.current;
        console.log("🚀 Leaving home - storing pause state:", currentManualState);
        setPauseStateBeforeNavigation(currentManualState);
      }
      // Auto-pause when leaving home (but don't update manual pause state)
      if (!isPaused) {
        console.log("⏸️ Auto-pausing video on navigation away from home");
        setIsPaused(true);
      }
    } else if (currentSection === "home" && pauseStateBeforeNavigation !== null) {
      // Restore the user's original pause intent when returning to home
      const shouldResume = !pauseStateBeforeNavigation;
      console.log("🏠 Returning to home - restoring pause state:", pauseStateBeforeNavigation, "shouldResume:", shouldResume);
      
      // Update all the states
      setIsPaused(pauseStateBeforeNavigation);
      setIsManuallyPaused(pauseStateBeforeNavigation);
      VideoPreferences.setPaused(pauseStateBeforeNavigation);
      
      // Clear the stored state
      setPauseStateBeforeNavigation(null);
      
      // If we should resume, try to play the video element directly
      if (shouldResume) {
        // Use a small delay to ensure the video component has processed the state change
        setTimeout(() => {
          const video = document.querySelector("video");
          console.log("🎥 Attempting to resume video, video element:", video, "paused:", video?.paused);
          if (video?.paused) {
            video.play().catch((error) => {
              console.warn("🚫 Video resume failed:", error);
            });
          }
        }, 200);
      }
    }
  }, [currentSection]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: We intentionally omit pauseStateBeforeNavigation and isPaused from deps to avoid loops

  const handleMenuClick = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
    setSelectedProject(null);
    setIsMobileMenuOpen(false);
  }, []);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleBackClick = useCallback(() => {
    if (selectedProject) {
      setSelectedProject(null);
    } else {
      setCurrentSection("home");
    }
  }, [selectedProject]);

  const navigationValue = useMemo<NavigationContextType>(
    () => ({
      currentSection,
      selectedProject,
      projectFilter,
      isMobileMenuOpen,
      setCurrentSection,
      setSelectedProject,
      setProjectFilter,
      setIsMobileMenuOpen,
      handleMenuClick,
      handleProjectClick,
      handleBackClick,
    }),
    [
      currentSection,
      selectedProject,
      projectFilter,
      isMobileMenuOpen,
      handleMenuClick,
      handleProjectClick,
      handleBackClick,
    ],
  );

  return (
    <VideoControlContext.Provider value={videoValue}>
      <NavigationContext.Provider value={navigationValue}>
        {children}
      </NavigationContext.Provider>
    </VideoControlContext.Provider>
  );
}
