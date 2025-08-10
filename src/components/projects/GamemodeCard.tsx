import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, Trophy, Wrench } from "lucide-react";
import { useSoundEffects } from "../../hooks/useSoundEffects";

interface GamemodeCardProps {
  gameLabel: string; // e.g., "Singleplayer"
  portfolioLabel: string; // e.g., "Solo Projects"
  description: string; // one-liner
  image: string; // background image url
  accent?: string; // css color for glow/fill/halo (optional)
  fillGradient?: [string, string]; // optional explicit gradient stops
  morphSpeed?: number; // speed multiplier for text morph (1 = default)
  className?: string;
  icon?: React.ElementType;
  onActivate?: () => void; // navigate or run action on click/Enter/Space
}

// Small inline morphing text (inspired by main menu item)
const MorphingString: React.FC<{
  fromText: string;
  toText: string;
  isHovered: boolean;
  speed?: number;
}> = ({ fromText, toText, isHovered, speed = 1 }) => {
  const [count, setCount] = React.useState(0);
  const max = Math.max(fromText.length, toText.length);

  React.useEffect(() => {
    const interval = Math.max(6, 20 / Math.max(0.25, speed));
    const id = setInterval(() => {
      setCount((c) => {
        if (isHovered) return Math.min(max, c + 1);
        return Math.max(0, c - 1);
      });
    }, interval);
    return () => clearInterval(id);
  }, [isHovered, max, speed]);

  const display = React.useMemo(() => {
    let out = "";
    for (let i = 0; i < max; i++) {
      out += i < count ? (toText[i] ?? "") : (fromText[i] ?? "");
    }
    return out;
  }, [count, fromText, toText, max]);

  return (
    <span className="inline-block">
      {display.split("").map((ch, i) => (
        <motion.span
          key={`gmorph-${i}`}
          animate={{ opacity: ch ? 1 : 0 }}
          transition={{ duration: 0.08, ease: "easeOut" }}
          className="inline-block"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
};

const GamemodeCard: React.FC<GamemodeCardProps> = ({
  gameLabel,
  portfolioLabel,
  description,
  image,
  accent,
  fillGradient,
  morphSpeed = 1.6,
  className,
  icon: Icon,
  onActivate,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const { playHover, playUnhover, playClick } = useSoundEffects();

  // Measure the widest of the two labels to prevent layout shift during morphing
  const measureARef = React.useRef<HTMLSpanElement | null>(null);
  const measureBRef = React.useRef<HTMLSpanElement | null>(null);
  const [titleWidth, setTitleWidth] = React.useState<number | null>(null);

  const measure = React.useCallback(() => {
    const wa = measureARef.current?.getBoundingClientRect().width ?? 0;
    const wb = measureBRef.current?.getBoundingClientRect().width ?? 0;
    const max = Math.ceil(Math.max(wa, wb));
    if (!titleWidth || Math.abs(titleWidth - max) > 0.5) setTitleWidth(max);
  }, [titleWidth]);

  React.useLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, gameLabel, portfolioLabel]);

  const accentColor = accent ?? "rgb(59 130 246)"; // tailwind blue-500
  const glow = accentColor;
  const ringColor = "rgba(255,255,255,0.95)"; // white outline for better edge coverage

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl select-none will-change-transform aspect-[4/5] cursor-pointer ${className ?? ""}`}
      onMouseEnter={() => {
        setHovered(true);
        playHover();
      }}
      onMouseLeave={() => {
        setHovered(false);
        setClicked(false); // Reset clicked state on mouse leave
        playUnhover();
      }}
      onClick={() => {
        setClicked(true);
        playClick();
        onActivate?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setClicked(true);
          playClick();
          onActivate?.();
        }
      }}
      onFocus={() => playHover()}
      onBlur={() => playUnhover()}
      whileHover={{ scale: 1.11 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={{
        // expose accent color to CSS via custom property for color-mix usage
        ["--accent-color" as any]: accentColor,
        // Soft glow on hover, no hard outline/lines
        boxShadow: hovered ? `0 0 24px 4px ${glow}` : "none",
        background:
          "radial-gradient(120% 120% at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.4) 100%)",
      }}
  role="button"
  aria-label={`${portfolioLabel} mode`}
  tabIndex={0}
    >
  {/* Top-left mode icon removed for a cleaner look */}
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover opacity-70 group-focus:opacity-80"
          draggable={false}
        />
  {/* vignette layer (blur removed for performance; prefer pre-blurred imagery) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
      </div>

      {/* Rising color fill (contains description) */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10"
        style={{
          backgroundImage:
            `linear-gradient(180deg, ${fillGradient?.[0] ?? 'color-mix(in srgb, var(--accent-color) 95%, transparent)'}, ${fillGradient?.[1] ?? 'color-mix(in srgb, var(--accent-color) 78%, black 22%)'}), linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 25%, rgba(0,0,0,0.10) 100%)`,
          backgroundBlendMode: "overlay, normal",
          borderRadius: "inherit",
          boxShadow:
            "inset 0 6px 10px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,0.22)",
        }}
        initial={{ height: "0%" }}
  animate={{ height: clicked ? "100%" : hovered ? "33%" : "0%" }}
        transition={{ duration: clicked ? 0.45 : 0.25, ease: "easeOut" }}
      >
        <div className="h-full w-full flex items-start justify-center p-3 md:p-4">
          <motion.p
            initial={false}
            animate={{ opacity: hovered && !clicked ? 1 : 0, y: hovered && !clicked ? 0 : 8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="text-[15px] md:text-base font-semibold text-white text-center max-w-[96%] leading-snug whitespace-pre-line break-words drop-shadow-[0_1px_2px_rgba(0,0,0,0.38)]"
          >
            {description}
          </motion.p>
        </div>
      </motion.div>

      {/* Content (title + icon) */}
      <div className="relative z-20 h-full p-4 md:p-5 flex flex-col justify-start items-center">
        <div className="relative w-full text-center mt-2 md:mt-3 overflow-visible flex flex-col items-center">
          {/* Title halo to avoid boxy glow */}
          <motion.div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.95 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            style={{
              width: "min(26rem, 88%)",
              height: "3.25rem",
              borderRadius: "9999px",
              background:
                "radial-gradient(closest-side, rgba(59,130,246,0.22), rgba(59,130,246,0.12) 45%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
          {/* Lock width to widest label to avoid jump during morph */}
          <div
            className="mx-auto"
            style={{ width: titleWidth ? `${titleWidth}px` : undefined }}
          >
            <h3
              className="game-title text-sm md:text-lg font-extrabold tracking-widest uppercase whitespace-nowrap text-white px-2 leading-tight"
              style={{ textShadow: hovered ? `0 0 4px ${glow}` : "none" }}
            >
              <MorphingString
                fromText={gameLabel}
                toText={portfolioLabel}
                isHovered={hovered}
                speed={morphSpeed}
              />
            </h3>
          </div>
          {/* Invisible measurers with identical styles */}
          <div className="absolute opacity-0 pointer-events-none select-none">
            <span
              ref={measureARef}
              className="game-title text-sm md:text-lg font-extrabold tracking-widest uppercase whitespace-nowrap px-2 leading-tight"
            >
              {gameLabel}
            </span>
            <span
              ref={measureBRef}
              className="game-title text-sm md:text-lg font-extrabold tracking-widest uppercase whitespace-nowrap px-2 leading-tight"
            >
              {portfolioLabel}
            </span>
          </div>
          {/* Centered large icon below title */}
          {Icon && (
            <div className="mt-8 flex items-center justify-center">
              <Icon size={38} strokeWidth={2.1} className="text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]" />
            </div>
          )}
        </div>
      </div>

      {/* Hover outline overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 rounded-xl"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        style={{
          boxShadow: `inset 0 0 0 2.5px ${ringColor}, 0 0 36px 10px rgba(255,255,255,0.14)`,
        }}
      />
    </motion.div>
  );
};

export default GamemodeCard;
