import { projects, type Project } from "../content/projects";
import { deriveGamemode, type GamemodeSlug } from "../content/gamemodes";
import { skillsContent } from "../content/skills";

export const getProjects = async (): Promise<Project[]> => {
  // Normalize projects with derived fields for consumers
  const normalized = projects.map((p) => normalizeProject(p));
  return Promise.resolve(normalized);
};

export const getSkills = async (): Promise<typeof skillsContent> => {
  return Promise.resolve(skillsContent);
};

// ---------- Helpers ----------

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function normalizeProject(p: Project): Project & {
  slug: string;
  gamemode: GamemodeSlug;
  cover: string;
} {
  const slug = p.slug || slugify(p.title || p.id);
  const gm = (p.gamemode as GamemodeSlug) || deriveGamemode(p);
  const cover = p.cover || p.image;
  return { ...p, slug, gamemode: gm, cover };
}

export async function getProjectsByMode(
  mode: GamemodeSlug,
): Promise<
  (Project & { slug: string; gamemode: GamemodeSlug; cover: string })[]
> {
  const all = await getProjects();
  return all
    .map(normalizeProject)
    .filter((p) => ((p as any).gamemode as GamemodeSlug) === mode);
}

export type FeaturedSlide = {
  id: string;
  kind: "featured" | "new";
  title: string;
  subtitle?: string;
  image: string;
  mode: GamemodeSlug;
  slug: string;
  tags: string[];
};

export async function getFeaturedSlides(): Promise<FeaturedSlide[]> {
  const all = (await getProjects()).map(normalizeProject);
  const withDates = all.map((p) => ({
    p,
    date: p.createdAt
      ? Date.parse(p.createdAt)
      : p.year
        ? Date.parse(`${p.year}-01-01`)
        : 0,
  }));
  // Featured first (sorted by newest)
  const featured = withDates
    .filter(({ p }) => !!p.featured)
    .sort((a, b) => b.date - a.date)
    .map(({ p }) => ({
      id: p.id,
      kind: "featured" as const,
      title: p.title,
      subtitle: p.description,
      image: (p as any).cover,
      mode: (p as any).gamemode,
      slug: (p as any).slug,
      tags: p.tags || [],
    }));
  // Fill with newest (excluding those already featured) to ensure at least 3
  const featuredIds = new Set(featured.map((f) => f.id));
  const newestFill = withDates
    .filter(({ p }) => !featuredIds.has(p.id))
    .sort((a, b) => b.date - a.date)
    .map(({ p }) => ({
      id: p.id,
      kind: "new" as const,
      title: p.title,
      subtitle: p.description,
      image: (p as any).cover,
      mode: (p as any).gamemode,
      slug: (p as any).slug,
      tags: p.tags || [],
    }));
  const combined = [...featured, ...newestFill].slice(0, 3);
  return combined;
}
