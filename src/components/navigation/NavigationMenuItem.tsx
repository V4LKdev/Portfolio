/**
 * NavigationMenuItem.tsx
 *
 * Enhanced navigation menu item component with advanced text animations and game-style styling.
 * Features dynamic spacing, icon support, letter-morphing animations, instant reveal, and theme integration.
 *
 * Animation Types:
 * - letter-morph: Characters change in place letter by letter (Valorant-style)
 * - instant-reveal: Immediate clear then reveal from left with clip-path
 * - fade: Simple crossfade between text states
 * - instant: No animation - immediate swap
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Newspaper } from "lucide-react";
import { useSoundEffects } from "../../hooks/useSoundEffects";

export interface NavigationMenuItemProps {
  /** Unique identifier for the menu item */
  id: string;
  /** Display label for normal state */
  gameLabel: string;
  /** Display label for hover state */
  hoverLabel: string;
  /** Visual hierarchy level affecting size and spacing */
  hierarchy: "primary" | "secondary" | "tertiary" | "quit" | "patchnotes";
  /** Target section to navigate to */
  section: string;
  /** Whether this item is currently active */
  isActive: boolean;
  /** Click handler for navigation */
  onClick: (sectionId: string) => void;
  /** Animation type for text transitions */
  animationType?: "letter-morph" | "instant-reveal" | "fade" | "instant";
  /** Animation speed multiplier (default: 1.2 for enhanced feel) */
  animationSpeed?: number;
  /** Enable enhanced animations (default: true) */
  enableEnhancedAnimations?: boolean;
  /** Show icon for special buttons */
  hasIcon?: boolean;
}

/**
 * Character morph component for letter-by-letter transitions
 * Provides smooth character-level animation for the letter-morph effect
 */
interface MorphingCharProps {
  fromChar: string;
  toChar: string;
  index: number;
  isHovered: boolean;
  animationSpeed: number;
}

const MorphingChar: React.FC<MorphingCharProps> = ({
  fromChar,
  toChar,
  index,
  isHovered,
  animationSpeed,
}) => {
  const [currentChar, setCurrentChar] = useState(fromChar);
  const delay = (index * 0.02) / animationSpeed; // Reduced for faster response

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
      transition={{ duration: 0.06 / animationSpeed }} // Reduced for snappier feel
      style={{ display: "inline-block" }}
    >
      {currentChar === " " ? "\u00A0" : currentChar}
    </motion.span>
  );
};

/**
 * Gets appropriate spacing classes based on menu item hierarchy
 * Uses viewport-aware dynamic spacing that adapts to available screen real estate:
 * - Automatically scales with screen height and resolution
 * - Ensures content fits on 1080p while utilizing space on 1440p+
 * - CSS clamp() provides fluid scaling between min/max bounds
 */
const getButtonSpacing = (hierarchy: string): string => {
  if (hierarchy === "primary") return "mb-[clamp(2rem,4vh,5rem)]"; // Primary section: 32px-80px based on viewport
  if (hierarchy === "patchnotes")
    return "mt-[clamp(2rem,4vh,5rem)] mb-[clamp(0.5rem,1vh,1rem)]"; // Large space before, small after
  if (hierarchy === "quit") return "mb-[clamp(0.5rem,1vh,1rem)]"; // Small consistent space
  if (hierarchy === "secondary") return "mb-[clamp(1.5rem,3vh,3rem)]"; // Secondary: 24px-48px
  return "mb-[clamp(1.25rem,2.5vh,2.5rem)]"; // Tertiary: 20px-40px
};

/**
 * Individual navigation menu item with enhanced hover effects and advanced text animations
 *
 * @param props - Menu item configuration, animation settings, and event handlers
 * @returns JSX element for the navigation menu item with advanced animations
 */
const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  id,
  gameLabel,
  hoverLabel,
  hierarchy,
  section,
  isActive,
  onClick,
  animationType = "letter-morph",
  animationSpeed = 1.2,
  enableEnhancedAnimations = true,
  hasIcon = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressedDown, setIsPressedDown] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const { playHover, playUnhover, playClick, playFeedback } = useSoundEffects();

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsActivated(false);
    playUnhover();
  };

  const handleMouseDown = () => {
    setIsPressedDown(true);
    setIsActivated(true);
  };

  const handleMouseUp = () => {
    setIsPressedDown(false);
  };

  const handleClick = () => {
    playClick();
    setTimeout(() => {
      playFeedback();
    }, 100);

    setIsActivated(true);
    onClick(section);
  };

  /**
   * Render animated text based on selected animation type
   */
  const renderAnimatedText = () => {
    const currentText =
      isHovered && gameLabel !== hoverLabel ? hoverLabel : gameLabel;
    const shouldAnimate = gameLabel !== hoverLabel && enableEnhancedAnimations;

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
              animationSpeed={animationSpeed}
            />
          ))}
        </span>
      );
    }

    if (animationType === "instant-reveal") {
      return (
        <AnimatePresence mode="wait">
          <motion.span
            key={currentText}
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.16 / animationSpeed, ease: "easeOut" }}
            className="block"
          >
            {currentText}
          </motion.span>
        </AnimatePresence>
      );
    }

    // Default: fade animation
    return (
      <AnimatePresence mode="wait">
        <motion.span
          key={currentText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 / animationSpeed, ease: "easeOut" }}
          className="block"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    );
  };

  /**
   * Render the Patchnotes button with icon animation
   */
  const renderPatchnotesButton = () => (
    <motion.div
      className="relative flex items-center gap-3"
      style={{ transformOrigin: "left center" }}
      animate={{
        scale: isPressedDown || isActivated ? 1.08 : 1,
      }}
      transition={{
        scale: { type: "spring", stiffness: 700, damping: 20 },
      }}
    >
      <motion.span
        className="mr-1"
        animate={{
          rotate:
            isHovered || isPressedDown || isActivated
              ? [0, -12, 12, -8, 8, 0]
              : 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Newspaper
          className="w-4 h-4 md:w-5 md:h-5 transition-colors duration-300"
          style={{
            color: isHovered
              ? "var(--theme-patchnotes-hover)"
              : "var(--theme-patchnotes-color)",
          }}
        />
      </motion.span>
      <span
        className="transition-colors duration-300"
        style={{
          color: isHovered
            ? "var(--theme-patchnotes-hover)"
            : "var(--theme-patchnotes-color)",
        }}
      >
        {renderAnimatedText()}
      </span>
    </motion.div>
  );

  /**
   * Render the Quit button with icon animation
   */
  const renderQuitButton = () => (
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
          className="mr-1"
          animate={{
            scale:
              isHovered || isPressedDown || isActivated
                ? [1, 1.18, 0.92, 1.12, 1]
                : 1,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <LogOut
            className="w-4 h-4 md:w-5 md:h-5 transition-colors duration-300"
            style={{
              color: isHovered
                ? "var(--theme-quit-hover)"
                : "var(--theme-quit-color)",
            }}
          />
        </motion.span>
      )}
      <span
        className="transition-colors duration-300"
        style={{
          color: isHovered
            ? "var(--theme-quit-hover)"
            : "var(--theme-quit-color)",
        }}
      >
        {gameLabel}
      </span>
    </motion.div>
  );

  /**
   * Render enhanced animated text with visual effects
   */
  const renderEnhancedText = () => (
    <motion.span
      className="relative inline-block align-bottom"
      animate={{
        color:
          isPressedDown || isActivated ? "rgba(0, 0, 0, 0.9)" : "currentColor",
      }}
      transition={{ color: { duration: 0.1, ease: "linear" } }}
    >
      <span className="block relative z-10">{renderAnimatedText()}</span>
      {/* Press fill effect */}
      <AnimatePresence>
        {(isPressedDown || isActivated) && (
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
      {/* Hover underline */}
      <AnimatePresence>
        {isHovered && !isPressedDown && !isActivated && (
          <motion.div
            className="absolute left-0 bottom-0 h-0.5 will-change-transform rounded-sm"
            style={{
              pointerEvents: "none",
              background: "var(--theme-menu-hover)",
            }}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            exit={{ width: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.span>
  );

  /**
   * Render fallback text with theme-aware transitions
   */
  const renderFallbackText = () => (
    <>
      <span className="block w-full min-w-0 text-left group-hover:opacity-0 transition-opacity duration-300 no-select">
        {gameLabel}
      </span>
      <span className="absolute top-0 left-0 w-full min-w-0 text-left group-hover:opacity-100 opacity-0 transition-opacity duration-300 no-select">
        {hoverLabel}
      </span>
    </>
  );

  /**
   * Render main menu items with enhanced animations
   */
  const renderMainMenuItem = () => (
    <div className="relative flex items-center gap-3">
      <div className="relative will-change-transform w-full">
        <div className="relative z-10 w-full min-w-0">
          {enableEnhancedAnimations && animationType !== "instant"
            ? renderEnhancedText()
            : renderFallbackText()}
        </div>
      </div>
    </div>
  );

  /**
   * Get the appropriate content based on hierarchy
   */
  const getButtonContent = () => {
    if (hierarchy === "patchnotes") return renderPatchnotesButton();
    if (hierarchy === "quit") return renderQuitButton();
    return renderMainMenuItem();
  };
  return (
    <motion.button
      key={id}
      className={`game-menu-item menu-${hierarchy} menu-button transition-all duration-300 relative block w-full text-left no-select text-2xl md:text-3xl lg:text-4xl ${
        isActive ? "theme-text text-shadow-glow" : ""
      } ${getButtonSpacing(hierarchy)}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      type="button"
      tabIndex={0}
      aria-current={isActive ? "page" : undefined}
    >
      {getButtonContent()}
    </motion.button>
  );
};

export default NavigationMenuItem;
