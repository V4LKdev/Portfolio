import React, { useState, useEffect } from "react";
import { useVideoControls } from "../../hooks/useVideoControls";
import { useSoundSettings } from "../../hooks/useSoundSettings";
import { useLoginOnboarding } from "../../hooks/useLoginOnboarding";

interface LoginOnboardingOverlayProps {
  availableThemes: string[];
}

const FAKE_LOADING_MESSAGES = [
  "Initializing portfolio modules...",
  "Compiling shaders...",
  "Establishing connection to server...",
  "Loading project data...",
  "Calibrating UI elements...",
  "Finalizing...",
];

// Theme color mapping for circular theme selectors
const getThemeColors = (themeName: string): string => {
  const themeMap: { [key: string]: string } = {
    "Default": "linear-gradient(45deg, #3b82f6 50%, #1e293b 50%)",
    "Dark": "linear-gradient(45deg, #000000 50%, #374151 50%)",
    "Light": "linear-gradient(45deg, #ffffff 50%, #f3f4f6 50%)",
    "Synthwave": "linear-gradient(45deg, #ff00ff 50%, #00ffff 50%)",
    "Valorant": "linear-gradient(45deg, #ff4654 50%, #0f1419 50%)",
    "Overwatch": "linear-gradient(45deg, #f99e1a 50%, #282828 50%)",
    "Destiny": "linear-gradient(45deg, #4a90e2 50%, #2c3e50 50%)",
  };
  return themeMap[themeName] ?? "linear-gradient(45deg, #6b7280 50%, #374151 50%)";
};

const LoginOnboardingOverlay: React.FC<LoginOnboardingOverlayProps> = ({ availableThemes }) => {
  // Hooks for settings and onboarding
  const { showOnboarding, completeOnboarding } = useLoginOnboarding();
  const { soundEnabled, setSoundEnabled } = useSoundSettings();
  const { isMuted, setMuted } = useVideoControls();
  
  // Local state for loading simulation
  const [loadingMessage, setLoadingMessage] = useState(FAKE_LOADING_MESSAGES[0]);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Theme state (not persisted for now as per requirements)
  const [theme, setTheme] = useState(availableThemes[0] ?? "");

  // Loading simulation effect
  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % FAKE_LOADING_MESSAGES.length;
      setLoadingMessage(FAKE_LOADING_MESSAGES[messageIndex]);
    }, 1500); // Change message every 1.5 seconds

    // Auto "login" after 4 seconds
    const loginTimeout = setTimeout(() => {
      setIsLoggedIn(true);
      clearInterval(interval);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(loginTimeout);
    };
  }, []);

  // Handle keyboard events for "press any key to continue"
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore mouse events and modifier keys
      if (event.key === 'Meta' || event.key === 'Control' || event.key === 'Alt' || event.key === 'Shift') {
        return;
      }
      handleEnterPortfolio();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLoggedIn]);

  // Handle entering the portfolio
  const handleEnterPortfolio = () => {
    completeOnboarding();
  };

  // Handle sound toggle
  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Handle video toggle
  const handleVideoToggle = () => {
    setMuted(!isMuted);
  };

  // Don't render if onboarding is already completed
  if (!showOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#181c24] animate-fade-in p-4">
      {/* Enhanced radial gradient overlay for extra depth, now darker */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none" style={{
        background: 'radial-gradient(ellipse at 60% 40%, rgba(60,80,120,0.10) 0%, rgba(40,50,80,0.08) 40%, rgba(24,28,36,0.0) 80%)'
      }} />
      {/* Moving White Geometric Background Elements */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
        {/* Floating code bracket */}
        <div style={{ top: '5%', left: '10%', position: 'absolute', animation: 'float-triangle-1 22s infinite linear' }}>
          <svg width="64" height="64" style={{ animation: 'shape-fade 22s infinite linear' }} fill="none" viewBox="0 0 64 64">
            <path d="M24 8 L8 32 L24 56" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.18"/>
            <path d="M40 8 L56 32 L40 56" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.18"/>
          </svg>
        </div>
        {/* Floating gear */}
        <div style={{ top: '55%', right: '15%', position: 'absolute', animation: 'float-triangle-2 28s infinite linear' }}>
          <svg width="48" height="48" style={{ animation: 'shape-fade 28s infinite linear' }} fill="none" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="10" stroke="white" strokeWidth="4" opacity="0.15"/>
            <g opacity="0.15">
              <rect x="22" y="2" width="4" height="10" rx="2" fill="white"/>
              <rect x="22" y="36" width="4" height="10" rx="2" fill="white"/>
              <rect x="2" y="22" width="10" height="4" rx="2" fill="white"/>
              <rect x="36" y="22" width="10" height="4" rx="2" fill="white"/>
              <rect x="9.5" y="9.5" width="4" height="10" rx="2" transform="rotate(-45 9.5 9.5)" fill="white"/>
              <rect x="34.5" y="34.5" width="4" height="10" rx="2" transform="rotate(-45 34.5 34.5)" fill="white"/>
              <rect x="9.5" y="34.5" width="4" height="10" rx="2" transform="rotate(45 9.5 34.5)" fill="white"/>
              <rect x="34.5" y="9.5" width="4" height="10" rx="2" transform="rotate(45 34.5 9.5)" fill="white"/>
            </g>
          </svg>
        </div>
        {/* Floating pixel heart */}
        <div style={{ bottom: '25%', left: '5%', position: 'absolute', animation: 'float-triangle-3 32s infinite linear' }}>
          <svg width="80" height="80" style={{ animation: 'shape-fade 32s infinite linear' }} fill="none" viewBox="0 0 80 80">
            <rect x="30" y="20" width="20" height="20" fill="white" opacity="0.13"/>
            <rect x="20" y="30" width="40" height="20" fill="white" opacity="0.13"/>
            <rect x="30" y="50" width="20" height="10" fill="white" opacity="0.13"/>
          </svg>
        </div>
        {/* Floating gamepad */}
        <div style={{ top: '20%', right: '5%', position: 'absolute', animation: 'float-circle-1 18s infinite linear' }}>
          <svg width="56" height="56" style={{ animation: 'shape-fade 18s infinite linear' }} fill="none" viewBox="0 0 56 56">
            <rect x="8" y="28" width="40" height="16" rx="8" fill="white" opacity="0.13"/>
            <circle cx="16" cy="36" r="3" fill="white" opacity="0.18"/>
            <circle cx="40" cy="36" r="3" fill="white" opacity="0.18"/>
            <rect x="26" y="34" width="4" height="4" rx="2" fill="white" opacity="0.18"/>
          </svg>
        </div>
        {/* Floating cursor */}
        <div style={{ bottom: '10%', right: '25%', position: 'absolute', animation: 'float-circle-2 26s infinite linear' }}>
          <svg width="70" height="70" style={{ animation: 'shape-fade 26s infinite linear' }} fill="none" viewBox="0 0 70 70">
            <polygon points="10,10 60,35 35,40 40,60" fill="white" opacity="0.13"/>
          </svg>
        </div>
        {/* Floating code block */}
        <div style={{ top: '35%', left: '2%', position: 'absolute', animation: 'float-line-1 20s infinite linear' }}>
          <svg width="100" height="32" style={{ animation: 'shape-fade 20s infinite linear' }} fill="none" viewBox="0 0 100 32">
            <rect x="0" y="8" width="100" height="16" rx="8" fill="white" opacity="0.10"/>
            <rect x="10" y="12" width="10" height="8" rx="2" fill="white" opacity="0.18"/>
            <rect x="80" y="12" width="10" height="8" rx="2" fill="white" opacity="0.18"/>
          </svg>
        </div>
        {/* Floating gear (small) */}
        <div style={{ top: '10%', right: '35%', position: 'absolute', animation: 'float-hex-1 34s infinite linear' }}>
          <svg width="64" height="64" style={{ animation: 'shape-fade 34s infinite linear' }} fill="none" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="14" stroke="white" strokeWidth="4" opacity="0.12"/>
            <g opacity="0.12">
              <rect x="30" y="2" width="4" height="12" rx="2" fill="white"/>
              <rect x="30" y="50" width="4" height="12" rx="2" fill="white"/>
              <rect x="2" y="30" width="12" height="4" rx="2" fill="white"/>
              <rect x="50" y="30" width="12" height="4" rx="2" fill="white"/>
              <rect x="13.5" y="13.5" width="4" height="12" rx="2" transform="rotate(-45 13.5 13.5)" fill="white"/>
              <rect x="46.5" y="46.5" width="4" height="12" rx="2" transform="rotate(-45 46.5 46.5)" fill="white"/>
              <rect x="13.5" y="46.5" width="4" height="12" rx="2" transform="rotate(45 13.5 46.5)" fill="white"/>
              <rect x="46.5" y="13.5" width="4" height="12" rx="2" transform="rotate(45 46.5 13.5)" fill="white"/>
            </g>
          </svg>
        </div>
        {/* Floating pixel heart (small) */}
        <div style={{ bottom: '30%', left: '55%', position: 'absolute', animation: 'float-hex-2 38s infinite linear' }}>
          <svg width="48" height="48" style={{ animation: 'shape-fade 38s infinite linear' }} fill="none" viewBox="0 0 48 48">
            <rect x="18" y="8" width="12" height="12" fill="white" opacity="0.13"/>
            <rect x="12" y="18" width="24" height="12" fill="white" opacity="0.13"/>
            <rect x="18" y="30" width="12" height="6" fill="white" opacity="0.13"/>
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
        {/* Game-inspired, professional title */}
        <div className="flex flex-col items-center mb-10 select-none w-full text-center">
          <span className="block w-full text-[3rem] sm:text-[4rem] md:text-[5rem] font-extrabold tracking-widest text-accent drop-shadow-lg uppercase game-title leading-tight" style={{ letterSpacing: '0.10em' }}>WELCOME</span>
        </div>

        {/* Greeter message */}
        <div className="flex flex-col items-center mb-10 w-full">
          <span className="text-xl sm:text-2xl text-white/90 text-center max-w-2xl px-4 font-semibold mb-2">
            Nicolas Martin - Game Developer Portfolio
          </span>
          <span className="text-lg text-muted-foreground text-center max-w-2xl px-4">
            Set your preferences below for the best experience.
          </span>
        </div>

        {/* Preferences - redesigned with angular, modern UI */}
        <div className="w-full max-w-2xl mx-auto mb-12 bg-black/20 p-8 border-t-2 border-b-2 border-accent/30">
          <div className="flex flex-col md:flex-row justify-around items-center gap-8">
            {/* Left side toggles */}
            <div className="flex flex-col gap-6">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div
                  role="switch"
                  aria-checked={soundEnabled}
                  tabIndex={0}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:ring-2 focus:ring-accent focus:outline-none select-none ${
                    soundEnabled ? 'bg-accent' : 'bg-gray-600'
                  }`}
                  onClick={handleSoundToggle}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleSoundToggle()}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
                <span className={`text-base sm:text-lg transition-colors duration-300 inline-block w-[90px] text-left align-middle whitespace-nowrap ${
                  soundEnabled ? 'text-white' : 'text-white/60'
                }`}>
                  {soundEnabled ? 'Sounds ON' : 'Sounds OFF'}
                </span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <div
                  role="switch"
                  aria-checked={!isMuted}
                  tabIndex={0}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:ring-2 focus:ring-accent focus:outline-none select-none ${
                    !isMuted ? 'bg-accent' : 'bg-gray-600'
                  }`}
                  onClick={handleVideoToggle}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleVideoToggle()}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                    !isMuted ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
                <span className={`text-base sm:text-lg transition-colors duration-300 inline-block w-[90px] text-left align-middle whitespace-nowrap ${
                  !isMuted ? 'text-white' : 'text-white/60'
                }`}>
                  {!isMuted ? 'Video ON' : 'Video OFF'}
                </span>
              </label>
            </div>

            {/* Right side theme selector */}
            <div className="flex flex-col gap-4 relative">
              <div className="flex items-center gap-3">
                <span className="text-base sm:text-lg text-white/90">Theme:</span>
                <span className="text-base sm:text-lg text-accent font-semibold inline-block w-[80px] text-left">{theme}</span>
              </div>
              <div className="flex gap-2 justify-center md:justify-start">
                {availableThemes.map((t) => (
                  <div key={t} className="relative">
                    <button
                      onClick={() => setTheme(t)}
                      onMouseEnter={() => setHoveredTheme(t)}
                      onMouseLeave={() => setHoveredTheme(null)}
                      className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 overflow-hidden relative ${
                        theme === t ? 'ring-2 ring-accent shadow-lg shadow-accent/30' : 'ring-2 ring-white/30'
                      }`}
                    >
                      <div 
                        className="w-full h-full rounded-full"
                        style={{
                          background: getThemeColors(t)
                        }}
                      />
                      {/* Selected indicator */}
                      {theme === t && (
                        <div className="absolute inset-0 flex items-center justify-center">
                        </div>
                      )}
                    </button>
                    {/* Custom themed tooltip below */}
                    {hoveredTheme === t && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/90 text-white text-sm rounded-lg border border-accent/50 whitespace-nowrap z-50">
                        {t}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fake loading sequence or login button */}
        <div className="flex flex-col items-center mt-8 w-full h-[140px] justify-center">
          {!isLoggedIn ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-accent/50 border-t-accent rounded-full animate-spin mb-4"></div>
              <span className="text-muted-foreground text-center h-[24px] flex items-center px-4">{loadingMessage}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <span className="text-accent text-base font-medium h-[22px] flex items-center mb-8 mt-[-8px]">✓ Logged in successfully</span>
              <div className="relative w-full flex items-center justify-center">
                <button 
                  onClick={handleEnterPortfolio}
                  className="px-8 py-3 bg-accent text-accent-foreground font-bold text-xl tracking-wide uppercase rounded-lg shadow-lg hover:bg-accent/90 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
                >
                  ENTER PORTFOLIO
                </button>
              </div>
              <span className="text-muted-foreground text-sm animate-pulse h-[20px] flex items-center">
                or press any key to continue
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginOnboardingOverlay;
