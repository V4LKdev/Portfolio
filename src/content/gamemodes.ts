// Gamemode metadata and helpers
// Centralizes labels, descriptions, and validation for project modes

export type GamemodeSlug =
  | "singleplayer"
  | "multiplayer"
  | "competitive"
  | "sandbox";

export interface GamemodeMeta {
  slug: GamemodeSlug;
  gameLabel: string; // e.g., Singleplayer
  portfolioLabel: string; // e.g., Solo Projects
  description: string;
  accent: string; // CSS color string
  iconKey: "user" | "users" | "trophy" | "wrench"; // UI decides actual icon
}

export const GAMEMODES: Record<GamemodeSlug, GamemodeMeta> = {
  singleplayer: {
    slug: "singleplayer",
    gameLabel: "Singleplayer",
    portfolioLabel: "Solo Projects",
    description: "Personal projects focused on gameplay, audio, and tools.",
    accent: "rgb(59 130 246)", // blue
    iconKey: "user",
  },
  multiplayer: {
    slug: "multiplayer",
    gameLabel: "Multiplayer",
    portfolioLabel: "Group Projects",
    description: "Team-based works: networking, systems, collaboration.",
    accent: "rgb(234 179 8)", // amber
    iconKey: "users",
  },
  competitive: {
    slug: "competitive",
    gameLabel: "Competitive",
    portfolioLabel: "Game Jams",
    description: "Rapid, focused prototypes built under time pressure.",
    accent: "rgb(168 85 247)", // purple
    iconKey: "trophy",
  },
  sandbox: {
    slug: "sandbox",
    gameLabel: "Sandbox",
    portfolioLabel: "Engine & Tools",
    description: "Engine mods, editor tooling, audio & tech exploration.",
    accent: "rgb(34 197 94)", // green
    iconKey: "wrench",
  },
};

export const GAMEMODE_SLUGS = Object.keys(GAMEMODES) as GamemodeSlug[];

export const isGamemodeSlug = (v: string): v is GamemodeSlug =>
  GAMEMODE_SLUGS.includes(v as GamemodeSlug);

// Non-invasive helper: derive a gamemode from existing project fields
// without changing the Project interface yet.
import type { Project } from "./projects";

export function deriveGamemode(project: Project): GamemodeSlug {
  const lcTags = project.tags.map((t) => t.toLowerCase());
  const lcCat = project.category.toLowerCase();

  if (lcTags.some((t) => t.includes("jam"))) return "competitive";
  if (project.type === "solo") return "singleplayer";
  if (project.type === "team") return "multiplayer";
  if (
    lcCat.includes("engine") ||
    lcCat.includes("tool") ||
    lcTags.some(
      (t) => t.includes("tool") || t.includes("editor") || t.includes("audio"),
    )
  ) {
    return "sandbox";
  }
  return "singleplayer";
}
