/**
 * ButtonDemoPage.tsx
 *
 * Experimental game-inspired text button styles demo page
 * Features: Large interactive text elements inspired by modern FPS games
 * Style: No borders, prominent text, hierarchy-based sizing, various text animations
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { getAvailableThemes, applyTheme, getStoredTheme } from "@/lib/themes";
import { LogOut, Newspaper } from "lucide-react";

// Character morph component for letter-by-letter transitions
const MorphingChar: React.FC<{
  fromChar: string;
  toChar: string;
  index: number;
  isHovered: boolean;
  animationSpeed: number;
}> = ({ fromChar, toChar, index, isHovered, animationSpeed }) => {
  const [currentChar, setCurrentChar] = useState(fromChar);
  const delay = (index * 0.02) / animationSpeed; // Reduced from 0.05 to 0.02 for faster response

  React.useEffect(() => {
    const targetChar = isHovered ? toChar : fromChar;
    const timer = setTimeout(() => {
      setCurrentChar(targetChar);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isHovered, fromChar, toChar, delay]);

  return (
    <motion.span
      key={`char-${index}`}
      animate={{ opacity: currentChar ? 1 : 0 }}
      transition={{ duration: 0.06 / animationSpeed }} // Reduced from 0.1 to 0.06 for snappier feel
      style={{ display: "inline-block" }}
    >
      {currentChar === " " ? "\u00A0" : currentChar}
    </motion.span>
  );
};
const styleVariants = [
  {
    id: "overwatch",
    name: "Overwatch Clean",
    description: "Pure white text, clean and minimal",
  },
  {
    id: "valorant",
    name: "Valorant Sharp",
    description: "Sharp red accents with tactical precision",
  },
];

// Clean, essential text animations (keep only 3-5)
const animationTypes = [
  {
    id: "instant",
    name: "Instant",
    description: "No animation - immediate swap",
  },
  {
    id: "hero-fade",
    name: "Fade",
    description: "Simple crossfade between text states",
  },
  {
    id: "tactical-instant",
    name: "Instant Reveal",
    description: "Immediate clear then reveal from left",
  },
  {
    id: "letter-morph",
    name: "Letter Morph",
    description: "Characters change in place letter by letter",
  },
  // Add a fifth if you want, or keep at 4 for now
];

// Exact navigation data from your main menu
const demoButtons = [
  {
    gameLabel: "Play",
    hoverLabel: "Projects",
    hierarchy: "primary" as const,
  },
  {
    gameLabel: "Profile",
    hoverLabel: "About Me",
    hierarchy: "secondary" as const,
  },
  {
    gameLabel: "Social",
    hoverLabel: "Contact",
    hierarchy: "secondary" as const,
  },
  {
    gameLabel: "Achievements",
    hoverLabel: "Skills & CV",
    hierarchy: "secondary" as const,
  },
  {
    gameLabel: "Extras",
    hoverLabel: "Hobbies",
    hierarchy: "tertiary" as const,
  },
  {
    gameLabel: "Patchnotes",
    hoverLabel: "News",
    hierarchy: "patchnotes" as const,
    hasIcon: true,
  },
  {
    gameLabel: "Quit",
    hoverLabel: "Quit",
    hierarchy: "quit" as const,
    hasIcon: true,
  },
];

interface GameTextButtonProps {
  gameLabel: string;
  hoverLabel: string;
  hierarchy: "primary" | "secondary" | "tertiary" | "quit" | "patchnotes";
  hasIcon?: boolean;
  variant: string;
  animationType: string;
  animationSpeed: number;
  onClick?: () => void;
}

const GameTextButton: React.FC<GameTextButtonProps> = ({
  gameLabel,
  hoverLabel,
  hierarchy,
  hasIcon,
  variant,
  animationType,
  animationSpeed,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  // Removed unused isPressed and clickAnimation state
  const [isPressedDown, setIsPressedDown] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const { playHover, playUnhover, playClick, playFeedback } = useSoundEffects({
    enabled: true,
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsActivated(false); // Reset activation on mouse leave
    playUnhover();
  };

  const handleMouseDown = () => {
    // setIsPressed(true); // removed unused state
    setIsPressedDown(true);
    setIsActivated(true); // Activate on press
  };

  const handleMouseUp = () => {
    // setIsPressed(false); // removed unused state
    setIsPressedDown(false);
  };

  // Helper function to get quit button color
  // Removed unused getQuitButtonColor

  // Overwatch style now uses theme system classes for main menu consistency
  // No custom glow logic needed

  const handleClick = () => {
    playClick();
    setTimeout(() => {
      playFeedback();
    }, 100);

    // Activate the button (stays active until mouse leave)
    setIsActivated(true);

    // If not currently pressed down, trigger click animation (removed)

    onClick?.();
  };

  // --- Button spacing and sizing helpers ---
  const getButtonSpacing = (): string => {
    if (hierarchy === "primary") return "mb-6 md:mb-8";
    if (hierarchy === "patchnotes") return ""; // No margin, handled by wrapper
    if (hierarchy === "quit") return ""; // No margin for quit
    return "mb-3 md:mb-4";
  };
  const getTextSize = (): string => {
    if (hierarchy === "primary") return "text-3xl md:text-4xl lg:text-5xl";
    if (hierarchy === "quit") return "text-lg md:text-xl";
    return "text-xl md:text-2xl lg:text-3xl";
  };

  // --- Variant styling helper ---
  // Overwatch uses theme system classes for consistency with main menu
  // Valorant uses custom color/hover logic
  const getVariantStyles = (): string => {
    if (variant === "overwatch") {
      return `game-menu-item menu-${hierarchy} group menu-button transition-colors duration-100`;
    }
    // Valorant style: REMOVE transition-colors and duration-100 from button
    const baseClasses =
      "relative block w-full text-left cursor-pointer select-none font-semibold";
    if (hierarchy === "quit") {
      return `${baseClasses} text-gray-500 tracking-wide relative group`;
    }
    return `${baseClasses} text-white tracking-wide hover:text-white`;
  };

  /**
   * Render animated text for the button, based on selected animation type
   */
  const renderAnimatedText = () => {
    const currentText =
      isHovered && gameLabel !== hoverLabel ? hoverLabel : gameLabel;
    const shouldAnimate = gameLabel !== hoverLabel;
    if (animationType === "instant" || !shouldAnimate) {
      return <span className="block">{currentText}</span>;
    }
    if (animationType === "letter-morph") {
      const fromText = gameLabel;
      const toText = hoverLabel;
      const maxLength = Math.max(fromText.length, toText.length);
      return (
        <span className="block">
          {Array.from({ length: maxLength }).map((_, index) => (
            <MorphingChar
              key={`morph-${fromText[index] ?? ""}-${toText[index] ?? ""}-${index}`}
              fromChar={fromText[index] ?? ""}
              toChar={toText[index] ?? ""}
              index={index}
              isHovered={isHovered}
              animationSpeed={animationSpeed || 1.0}
            />
          ))}
        </span>
      );
    }
    if (animationType === "tactical-instant") {
      return (
        <AnimatePresence mode="wait">
          <motion.span
            key={currentText}
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 0.16 / (animationSpeed || 1.0),
              ease: "easeOut" as const,
            }}
            className="block"
          >
            {currentText}
          </motion.span>
        </AnimatePresence>
      );
    }
    // Default: hero-fade
    return (
      <AnimatePresence mode="wait">
        <motion.span
          key={currentText}
          {...getAnimationProps()}
          className="block"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    );
  };

  // Split animation props into smaller functions for complexity
  const getBasicAnimations = (baseSpeed: number) => {
    switch (animationType) {
      case "hero-fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.15 / baseSpeed, ease: "easeOut" as const },
        };

      case "valorant-precision":
        return {
          initial: {
            opacity: 0,
            scaleX: 0.3,
            transformOrigin: "left center",
          },
          animate: {
            opacity: 1,
            scaleX: 1,
            transformOrigin: "left center",
          },
          exit: {
            opacity: 0,
            scaleX: 0.3,
            transformOrigin: "left center",
          },
          transition: {
            duration: 0.18 / baseSpeed,
            ease: "easeInOut" as const,
          },
        };

      case "tactical-reveal":
        return {
          initial: {
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
          },
          animate: {
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
          },
          exit: {
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
          },
          transition: {
            duration: 0.16 / baseSpeed,
            ease: "easeOut" as const,
          },
        };
      case "tactical-instant":
        return {
          initial: {
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
          },
          animate: {
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
          },
          transition: {
            duration: 0.16 / baseSpeed,
            ease: "easeOut" as const,
          },
        };

      default:
        return null;
    }
  };

  const getAdvancedAnimations = (baseSpeed: number) => {
    if (animationType === "breach-entry") {
      return {
        initial: {
          opacity: 0,
          x: -20,
          scaleX: 0.8,
          transformOrigin: "left center",
        },
        animate: {
          opacity: 1,
          x: 0,
          scaleX: 1,
          transformOrigin: "left center",
        },
        exit: {
          opacity: 0,
          x: -15,
          scaleX: 0.9,
          transformOrigin: "left center",
        },
        transition: {
          duration: 0.14 / baseSpeed,
          ease: "easeOut" as const,
        },
      };
    }

    return null;
  };

  const getComplexAnimations = (baseSpeed: number) => {
    if (animationType === "precision-type") {
      return {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.03 / baseSpeed,
            delayChildren: 0.02 / baseSpeed,
          },
        },
        exit: {
          opacity: 0,
          transition: {
            staggerChildren: 0.02 / baseSpeed,
            staggerDirection: -1,
          },
        },
      };
    }

    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15 / baseSpeed },
    };
  };

  const getAnimationProps = () => {
    const baseSpeed = animationSpeed || 1.0;

    return (
      getBasicAnimations(baseSpeed) ||
      getAdvancedAnimations(baseSpeed) ||
      getComplexAnimations(baseSpeed)
    );
  };

  // Removed unused animatedButtonColor

  return (
    <motion.button
      className={`${getVariantStyles()} ${getTextSize()} ${getButtonSpacing()}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      style={{
        // Add theme-aware text glow for Valorant primary buttons on hover
        textShadow:
          variant === "valorant" && hierarchy === "primary" && isHovered
            ? "0 0 8px var(--theme-menu-glow)"
            : undefined,
      }}
      // For Overwatch, use group for hover/active effects
    >
      {/* Quit button wrapper */}
      {hierarchy === "patchnotes" ? (
        <motion.div
          className="relative flex items-center gap-3 text-gray-500 text-lg md:text-xl force-no-color-transition"
          style={{ transformOrigin: "left center" }}
          animate={{
            scale: isPressedDown || isActivated ? 1.08 : 1,
          }}
          transition={{
            scale: { type: "spring", stiffness: 700, damping: 20 },
          }}
        >
          <motion.span
            className="force-no-color-transition mr-1"
            animate={{
              rotate:
                isHovered || isPressedDown || isActivated
                  ? [0, -12, 12, -8, 8, 0]
                  : 0,
              color:
                variant === "valorant" &&
                (isHovered || isPressedDown || isActivated)
                  ? "var(--theme-menu-hover)"
                  : undefined,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Newspaper className="w-4 h-4 md:w-5 md:h-5 align-text-bottom" />
          </motion.span>
          <span
            className="force-no-color-transition"
            style={{
              color:
                variant === "valorant" &&
                (isHovered || isPressedDown || isActivated)
                  ? "var(--theme-menu-hover)"
                  : undefined,
            }}
          >
            {renderAnimatedText()}
          </span>
        </motion.div>
      ) : hierarchy === "quit" ? (
        <motion.div
          className="relative flex items-center gap-3 mt-2"
          style={{ transformOrigin: "left center" }}
          animate={{
            scale: isPressedDown || isActivated ? 1.08 : 1,
          }}
          transition={{
            scale: { type: "spring", stiffness: 700, damping: 20 },
          }}
        >
          {hasIcon && (
            <motion.span
              className="transition-colors duration-150 force-no-color-transition mr-1"
              animate={{
                scale:
                  isHovered || isPressedDown || isActivated
                    ? [1, 1.18, 0.92, 1.12, 1]
                    : 1,
                color:
                  variant === "valorant" &&
                  (isHovered || isPressedDown || isActivated)
                    ? "#ef4444"
                    : "currentColor",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5 align-text-bottom" />
            </motion.span>
          )}
          <span
            className="force-no-color-transition"
            style={{
              color:
                variant === "valorant" &&
                (isHovered || isPressedDown || isActivated)
                  ? "#ef4444"
                  : undefined,
            }}
          >
            {gameLabel}
          </span>
        </motion.div>
      ) : (
        <div className="relative flex items-center gap-3">
          {/* Remove overflow-hidden for Overwatch so glow isn't clipped */}
          <div className="relative will-change-transform w-full">
            <div className="relative z-10 w-full min-w-0">
              {variant === "overwatch" ? (
                // Use theme-aware text transitions for Overwatch
                <>
                  <span className="block w-full min-w-0 text-left group-hover:opacity-0 transition-opacity duration-300 no-select">
                    {gameLabel}
                  </span>
                  <span className="absolute top-0 left-0 w-full min-w-0 text-left group-hover:opacity-100 opacity-0 transition-opacity duration-300 no-select">
                    {hoverLabel}
                  </span>
                </>
              ) : (
                // Valorant: wrap animated text in relative span for underline/fill
                <motion.span
                  className="relative inline-block align-bottom force-no-color-transition"
                  animate={{
                    color:
                      variant === "valorant" &&
                      (isPressedDown || isActivated) &&
                      (hierarchy === "primary" ||
                        hierarchy === "secondary" ||
                        hierarchy === "tertiary")
                        ? "rgba(0, 0, 0, 0.9)"
                        : "currentColor",
                  }}
                  transition={{ color: { duration: 0.1, ease: "linear" } }}
                >
                  <span className="block relative z-10">
                    {renderAnimatedText()}
                  </span>
                  {/* Press fill for Valorant (text only, theme-aware) */}
                  <AnimatePresence>
                    {variant === "valorant" &&
                      (hierarchy === "primary" ||
                        hierarchy === "secondary" ||
                        hierarchy === "tertiary") &&
                      (isPressedDown || isActivated) && (
                        <motion.div
                          className="absolute left-0 bottom-0 w-full z-0 will-change-transform rounded-sm"
                          style={{
                            height: "100%",
                            pointerEvents: "none",
                            background: "var(--theme-menu-hover)",
                          }}
                          initial={{ height: "2px", opacity: 1 }}
                          animate={{ height: "100%", opacity: 1 }}
                          exit={{ height: "2px", opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        />
                      )}
                  </AnimatePresence>
                  {/* Hover underline for Valorant (text only, theme-aware) */}
                  <AnimatePresence>
                    {variant === "valorant" &&
                      isHovered &&
                      (hierarchy === "primary" ||
                        hierarchy === "secondary" ||
                        hierarchy === "tertiary") &&
                      !isPressedDown &&
                      !isActivated && (
                        <motion.div
                          className="absolute left-0 bottom-0 h-0.5 will-change-transform rounded-sm"
                          style={{
                            pointerEvents: "none",
                            background: "var(--theme-menu-hover)",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          exit={{ width: 0 }}
                          transition={{
                            duration: 0.15,
                            ease: "easeOut" as const,
                          }}
                        />
                      )}
                  </AnimatePresence>
                </motion.span>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.button>
  );
};

const ButtonDemoPage: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState("valorant");
  const [selectedAnimation, setSelectedAnimation] = useState("letter-morph");
  const [animationSpeed, setAnimationSpeed] = useState(1.0); // 0.5x to 2x speed multiplier
  const themes = getAvailableThemes();
  const [activeTheme, setActiveTheme] = useState(() => getStoredTheme());

  // Apply theme on mount and when changed
  React.useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  // Split buttons into main and bottom groups
  const mainButtons = demoButtons.filter(
    (b) => b.hierarchy !== "patchnotes" && b.hierarchy !== "quit",
  );
  const bottomButtons = demoButtons.filter(
    (b) => b.hierarchy === "patchnotes" || b.hierarchy === "quit",
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="fixed inset-0 bg-gradient-radial from-gray-900/20 via-black to-black" />

      <div className="relative z-10 container mx-auto px-8 py-12">
        {/* TEMP: Theme Switcher */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2 bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-2">
            <span className="text-xs text-gray-400">Theme:</span>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-150 border ${
                  activeTheme === theme.id
                    ? "bg-blue-700/40 text-blue-100 border-blue-400"
                    : "bg-transparent text-gray-300 border-gray-600 hover:bg-gray-800"
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Gaming Text Buttons
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Essential animations with enhanced Valorant quit button that turns
            red on hover and grows on press
          </p>
        </motion.div>

        {/* Controls */}
        <div className="mb-16 space-y-8">
          {/* Style Variant Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-300">
              Game Style
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {styleVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    selectedVariant === variant.id
                      ? "text-white border-white/30 shadow-lg"
                      : "text-gray-400 border-gray-700/50 hover:text-gray-300 hover:border-gray-600/60"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
            {styleVariants.find((v) => v.id === selectedVariant) && (
              <motion.p
                key={selectedVariant}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 text-sm mt-4"
              >
                {
                  styleVariants.find((v) => v.id === selectedVariant)
                    ?.description
                }
              </motion.p>
            )}
          </motion.div>

          {/* Animation Type Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-300">
              Text Animation
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {animationTypes.map((animation) => (
                <button
                  key={animation.id}
                  onClick={() => setSelectedAnimation(animation.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedAnimation === animation.id
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "bg-gray-800/30 text-gray-400 border border-gray-700/40 hover:bg-gray-700/50"
                  }`}
                >
                  {animation.name}
                </button>
              ))}
            </div>
            {animationTypes.find((a) => a.id === selectedAnimation) && (
              <motion.p
                key={selectedAnimation}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 text-sm mt-3"
              >
                {
                  animationTypes.find((a) => a.id === selectedAnimation)
                    ?.description
                }
              </motion.p>
            )}
          </motion.div>

          {/* Animation Speed Control */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-300">
              Animation Speed
            </h2>
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-12">0.5x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={animationSpeed}
                  onChange={(e) =>
                    setAnimationSpeed(parseFloat(e.target.value))
                  }
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-400 w-12">2.0x</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-sm text-gray-300">
                  {animationSpeed.toFixed(1)}x speed
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Button Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-black/40 border border-gray-800/50 rounded-2xl p-12 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-8 text-center text-gray-300">
              Interactive Demo
            </h3>

            {/* Button List - Vertical like game menus */}
            <div className="space-y-2">
              {/* Main buttons */}
              {mainButtons.map((button, index) => (
                <motion.div
                  key={`${button.gameLabel}-${selectedVariant}-${selectedAnimation}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GameTextButton
                    gameLabel={button.gameLabel}
                    hoverLabel={button.hoverLabel}
                    hierarchy={button.hierarchy}
                    hasIcon={button.hasIcon || false}
                    variant={selectedVariant}
                    animationType={selectedAnimation}
                    animationSpeed={animationSpeed}
                    onClick={() => console.log(`Clicked: ${button.hoverLabel}`)}
                  />
                </motion.div>
              ))}
              {/* Bottom group: Patchnotes and Quit */}
              <div>
                {bottomButtons.map((button, index) => (
                  <motion.div
                    key={`${button.gameLabel}-${selectedVariant}-${selectedAnimation}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (mainButtons.length + index) }}
                    className={button.hierarchy === "patchnotes" ? "mt-10" : ""}
                  >
                    <GameTextButton
                      gameLabel={button.gameLabel}
                      hoverLabel={button.hoverLabel}
                      hierarchy={button.hierarchy}
                      hasIcon={button.hasIcon ?? false}
                      variant={selectedVariant}
                      animationType={selectedAnimation}
                      animationSpeed={animationSpeed}
                      onClick={() =>
                        console.log(`Clicked: ${button.hoverLabel}`)
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info boxes removed as requested */}

        {/* Navigation Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-gray-800/40 border border-gray-600/40 rounded-lg
                     hover:bg-gray-700/60 hover:border-gray-500/60 transition-all duration-200
                     text-gray-300 text-base font-medium"
          >
            ← Back to Portfolio
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ButtonDemoPage;
