/**
 * NavigationMenuItem.tsx
 *
 * Menu item with advanced text animations and game-style styling.
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Newspaper } from "lucide-react";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import { ANIMATION_CONFIG, SPACING_CONFIG } from "../../config";

export interface NavigationMenuItemProps {
  id: string;
  gameLabel: string;
  hoverLabel: string;
  hierarchy: "primary" | "secondary" | "tertiary" | "quit" | "patchnotes";
  section: string;
  isActive: boolean;
  onClick: (sectionId: string, hierarchy: string) => void;
  animationType?: "letter-morph" | "instant-reveal" | "fade" | "instant";
  animationSpeed?: number;
  enableEnhancedAnimations?: boolean;
  hasIcon?: boolean;
}

const MorphingString: React.FC<{
  fromText: string;
  toText: string;
  isHovered: boolean;
  animationSpeed: number;
}> = ({ fromText, toText, isHovered, animationSpeed }) => {
  const maxLength = Math.max(fromText.length, toText.length);
  const [morphedCharacters, setMorphedCharacters] = useState(0);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const step = () => {
      setMorphedCharacters(prev => {
        if (isHovered && prev < maxLength) return prev + 1;
        if (!isHovered && prev > 0) return prev - 1;
        return prev;
      });
    };

    if ((isHovered && morphedCharacters < maxLength) || (!isHovered && morphedCharacters > 0)) {
      timeoutId = setTimeout(
        step,
        (ANIMATION_CONFIG.CHAR_DELAY_MULTIPLIER / animationSpeed) * 1000
      );
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isHovered, morphedCharacters, animationSpeed, maxLength]);

  const displayText = useMemo(() => {
    let result = "";
    for (let i = 0; i < maxLength; i++) {
      result += i < morphedCharacters ? toText[i] ?? "" : fromText[i] ?? "";
    }
    return result;
  }, [morphedCharacters, fromText, toText, maxLength]);

  return (
    <span className="inline-block">
      {displayText.split("").map((char, idx) => (
        <motion.span
          key={`morph-${fromText}-${toText}-${idx}`}
          animate={{ opacity: char ? 1 : 0 }}
          transition={{
            duration: ANIMATION_CONFIG.MORPH_CHAR_OPACITY_DURATION / animationSpeed,
            ease: ANIMATION_CONFIG.EASE_OUT,
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

const validateHierarchy = (hierarchy: string): boolean => {
  const validHierarchies = [
    "primary",
    "secondary",
    "tertiary",
    "quit",
    "patchnotes",
  ];
  return validHierarchies.includes(hierarchy);
};

const getButtonSpacing = (hierarchy: string): string => {
  if (!validateHierarchy(hierarchy)) {
    return SPACING_CONFIG.NAVIGATION.TERTIARY;
  }

  const spacingMap: Record<string, string> = {
    primary: SPACING_CONFIG.NAVIGATION.PRIMARY,
    patchnotes: SPACING_CONFIG.NAVIGATION.PATCHNOTES,
    quit: SPACING_CONFIG.NAVIGATION.QUIT,
    secondary: SPACING_CONFIG.NAVIGATION.SECONDARY,
    tertiary: SPACING_CONFIG.NAVIGATION.TERTIARY,
  };

  return spacingMap[hierarchy] ?? SPACING_CONFIG.NAVIGATION.TERTIARY;
};

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

  const animationConfigs = useMemo(
    () => ({
      instantReveal: {
        duration: ANIMATION_CONFIG.INSTANT_REVEAL_DURATION / animationSpeed,
        ease: ANIMATION_CONFIG.EASE_OUT,
      },
      fade: {
        duration: ANIMATION_CONFIG.FADE_DURATION / animationSpeed,
        ease: ANIMATION_CONFIG.EASE_OUT,
      },
      scale: {
        type: "spring" as const,
        stiffness: ANIMATION_CONFIG.SCALE_SPRING_STIFFNESS,
        damping: ANIMATION_CONFIG.SCALE_SPRING_DAMPING,
      },
      iconRotation: {
        duration: ANIMATION_CONFIG.ICON_ROTATION_DURATION,
        ease: ANIMATION_CONFIG.EASE_IN_OUT,
      },
      iconScale: {
        duration: ANIMATION_CONFIG.ICON_SCALE_DURATION,
        ease: ANIMATION_CONFIG.EASE_IN_OUT,
      },
      fillEffect: {
        duration: ANIMATION_CONFIG.FILL_EFFECT_DURATION,
        ease: ANIMATION_CONFIG.EASE_OUT,
      },
      underline: {
        duration: ANIMATION_CONFIG.UNDERLINE_DURATION,
        ease: ANIMATION_CONFIG.EASE_OUT,
      },
    }),
    [animationSpeed],
  );

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
    setIsActivated(true);
    
    onClick(section, hierarchy);
    
    setTimeout(() => {
      playFeedback();
      setIsActivated(false);
    }, ANIMATION_CONFIG.FEEDBACK_DELAY);
  };

  const renderAnimatedText = () => {
    const currentText =
      isHovered && gameLabel !== hoverLabel ? hoverLabel : gameLabel;
    const shouldAnimate = gameLabel !== hoverLabel && enableEnhancedAnimations;

    if (animationType === "instant" || !shouldAnimate) {
      return <span className="block">{currentText}</span>;
    }

    if (animationType === "letter-morph") {
      return (
        <MorphingString
          fromText={gameLabel}
          toText={hoverLabel}
          isHovered={isHovered}
          animationSpeed={animationSpeed}
        />
      );
    }

    if (animationType === "instant-reveal") {
      return (
        <AnimatePresence mode="wait">
          <motion.span
            key={currentText}
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={animationConfigs.instantReveal}
            className="block"
          >
            {currentText}
          </motion.span>
        </AnimatePresence>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.span
          key={currentText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={animationConfigs.fade}
          className="block"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    );
  };

  const renderPatchnotesButton = () => (
    <motion.div
      className="relative flex items-center gap-3"
      style={{ transformOrigin: "left center" }}
      animate={{
        scale:
          isPressedDown || isActivated
            ? ANIMATION_CONFIG.BUTTON_SCALE_FACTOR
            : 1,
      }}
      transition={animationConfigs.scale}
    >
      <motion.span
        className="mr-1"
        animate={{
          rotate:
            isHovered || isPressedDown || isActivated
              ? [0, -12, 12, -8, 8, 0]
              : 0,
        }}
        transition={animationConfigs.iconRotation}
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

  const renderQuitButton = () => (
    <motion.div
      className="relative flex items-center gap-3 mt-2"
      style={{ transformOrigin: "left center" }}
      animate={{
        scale:
          isPressedDown || isActivated
            ? ANIMATION_CONFIG.BUTTON_SCALE_FACTOR
            : 1,
      }}
      transition={animationConfigs.scale}
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
          transition={animationConfigs.iconScale}
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

  const renderEnhancedText = () => (
    <motion.span
      className="relative inline-block align-bottom"
      style={{
        color: (isPressedDown || isActivated)
          ? "rgba(0, 0, 0, 0.9)"
          : undefined,
      }}
    >
      <span className="block relative z-10">{renderAnimatedText()}</span>
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
            transition={animationConfigs.fillEffect}
          />
        )}
      </AnimatePresence>
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
            transition={animationConfigs.underline}
          />
        )}
      </AnimatePresence>
    </motion.span>
  );

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

  const renderTertiaryMenuItem = () => (
    <div className="relative flex items-center gap-3">
      <div className="relative will-change-transform w-full">
        <div className="relative z-10 w-full min-w-0">
          <span
            className="transition-colors duration-300"
            style={{
              color: isHovered
                ? "var(--theme-menu-hover)"
                : "var(--theme-patchnotes-color)",
            }}
          >
            {enableEnhancedAnimations && animationType !== "instant"
              ? renderEnhancedText()
              : renderFallbackText()}
          </span>
        </div>
      </div>
    </div>
  );

  const getButtonContent = () => {
    if (hierarchy === "patchnotes") return renderPatchnotesButton();
    if (hierarchy === "quit") return renderQuitButton();
    if (hierarchy === "tertiary") return renderTertiaryMenuItem();
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