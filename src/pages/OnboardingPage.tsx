/**
 * OnboardingPage.tsx
 *
 * Guides first-time visitors through setting preferences before entering the portfolio.
 * Features:
 * - Video autoplay toggle (ON by default)
 * - Sound effects toggle (OFF by default)
 * - Loading simulation (3 seconds)
 * - Blue Moonlight theme styling
 * - Responsive design
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserPreferences } from "../lib/cookies";
import { onboardingContent } from "../content/onboarding-exit";
import "../styles/onboarding.css";
import { useVideo } from "../hooks/useVideo";
import { useAudio } from "../hooks/useAudio";
import { useSoundEffects } from "../hooks/useSoundEffects";

const LOADING_MESSAGES = onboardingContent.loadingMessages;

// Animation and timing constants
const LOADING_MESSAGE_INTERVAL = 550; // ms
const LOADING_TIMEOUT = 3000; // ms

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const { videoEnabled, toggleVideo } = useVideo();
  const { sfxEnabled, toggleSfx, unlockAudio } = useAudio();
  const { playHover, playUnhover, playClick } = useSoundEffects();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  // Loading simulation with cycling messages
  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, LOADING_MESSAGE_INTERVAL);

    // Complete loading after timeout
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      clearInterval(messageInterval);
    }, LOADING_TIMEOUT);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Handle entering the portfolio
  const handleEnterPortfolio = useCallback(() => {
    if (sfxEnabled) {
      unlockAudio();
    }
    // Mark onboarding as completed
    UserPreferences.setShowOnboarding(false);
    window.dispatchEvent(new CustomEvent("onboardingComplete"));
    navigate("/", { replace: true });
  }, [navigate, sfxEnabled, unlockAudio]);

  // Handle keyboard events for "press any key to continue"
  useEffect(() => {
    if (isLoading) return;
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore modifier keys
      if (
        event.key === "Meta" ||
        event.key === "Control" ||
        event.key === "Alt" ||
        event.key === "Shift"
      ) {
        return;
      }
      handleEnterPortfolio();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isLoading, handleEnterPortfolio]);

  // Hide text caret globally for this page
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = "* { caret-color: transparent !important; }";
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center onboarding-background p-4 select-none">
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col items-center mb-10 w-full text-center">
          <span
            className="onboarding-title block w-full text-[3rem] sm:text-[4rem] md:text-[5rem] font-extrabold tracking-widest text-[#3b82f6] drop-shadow-lg uppercase leading-tight"
            style={{ letterSpacing: "0.10em" }}
          >
            {onboardingContent.title}
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col items-center mb-6 w-full">
          <span className="text-xl sm:text-2xl text-white/90 text-center max-w-2xl px-4 font-semibold mb-2">
            Nicolas Martin - Game Dev Portfolio
          </span>
          <span className="text-lg text-white/70 text-center max-w-2xl px-4 leading-relaxed">
            {onboardingContent.description.split("\n").map((line) => (
              <React.Fragment key={line}>
                {line}
                <br className="hidden sm:inline" />
              </React.Fragment>
            ))}
          </span>
        </div>

        {/* Preferences */}
        <div className="w-full max-w-xl mx-auto mb-4 bg-black/20 p-8 border-t-2 border-b-2 border-[#3b82f6]/40">
          <div className="flex flex-col items-center gap-4">
            <span className="text-lg sm:text-xl text-[#3b82f6] font-bold mb-2 tracking-wide uppercase">
              {onboardingContent.preferences}
            </span>
            <div className="flex flex-row gap-8 items-center justify-center w-full mt-2">
              {/* Video Autoplay Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  role="switch"
                  aria-checked={videoEnabled}
                  tabIndex={0}
                  className={`relative w-12 h-6 rounded-full flex items-center transition-all duration-300 focus:ring-2 focus:ring-[#3b82f6] focus:outline-none select-none ${
                    videoEnabled ? "bg-[#3b82f6]" : "bg-gray-600"
                  }`}
                  onClick={() => {
                    playClick();
                    toggleVideo();
                  }}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && (playClick(), toggleVideo())
                  }
                  onMouseEnter={playHover}
                  onMouseLeave={playUnhover}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                      videoEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                    style={{ top: "2px" }}
                  />
                </div>
                <span
                  className={`text-base sm:text-lg transition-colors duration-300 inline-block w-[90px] text-left align-middle whitespace-nowrap ${
                    videoEnabled ? "text-white" : "text-white/60"
                  }`}
                >
                  {videoEnabled
                    ? onboardingContent.videoToggleOn
                    : onboardingContent.videoToggleOff}
                </span>
              </label>
              {/* Sound Effects Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  role="switch"
                  aria-checked={sfxEnabled}
                  tabIndex={0}
                  className={`relative w-12 h-6 rounded-full flex items-center transition-all duration-300 focus:ring-2 focus:ring-[#3b82f6] focus:outline-none select-none ${
                    sfxEnabled ? "bg-[#3b82f6]" : "bg-gray-600"
                  }`}
                  onClick={() => {
                    playClick();
                    if (!sfxEnabled) {
                      unlockAudio();
                    }
                    toggleSfx();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      playClick();
                      if (!sfxEnabled) {
                        unlockAudio();
                      }
                      toggleSfx();
                    }
                  }}
                  onMouseEnter={playHover}
                  onMouseLeave={playUnhover}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                      sfxEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                    style={{ top: "2px" }}
                  />
                </div>
                <span
                  className={`text-base sm:text-lg transition-colors duration-300 inline-block w-[90px] text-left align-middle whitespace-nowrap ${
                    sfxEnabled ? "text-white" : "text-white/60"
                  }`}
                >
                  {sfxEnabled
                    ? onboardingContent.sfxToggleOn
                    : onboardingContent.sfxToggleOff}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Loading or Enter Button */}
        <div className="flex flex-col items-center mt-4 w-full h-[140px] justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="loading-spinner mb-4"></div>
              <span className="text-white/70 text-center h-[24px] flex items-center px-4">
                {loadingMessage}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <span className="text-[#3b82f6] text-base font-medium h-[22px] flex items-center mb-8">
                <span style={{ fontFamily: 'Arial, Segoe UI, sans-serif', marginRight: 6 }}>✓</span> Ready to proceed
              </span>
              <button
                onClick={() => {
                  playClick();
                  handleEnterPortfolio();
                }}
                onMouseEnter={playHover}
                onMouseLeave={playUnhover}
                className="bg-[#3b82f6] text-white px-6 py-3 font-bold text-xl tracking-wide uppercase rounded-lg shadow-lg hover:bg-[#2563eb] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-black mb-3"
                style={{ boxShadow: "0 2px 16px 0 rgba(59,130,246,0.18)" }}
              >
                {onboardingContent.enterButton}
              </button>
              <span className="text-white/50 text-sm animate-pulse h-[20px] flex items-center">
                {onboardingContent.pressAnyKey}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
