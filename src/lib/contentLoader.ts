import { projects, type Project } from "../content/projects";
import { deriveGamemode, type GamemodeSlug } from "../content/gamemodes";
import { skillsContent } from "../content/skills";

export type NormalizedProject = Project & {
  slug: string;
  gamemode: GamemodeSlug;
  cover: string;
};

export const getProjects = async (): Promise<NormalizedProject[]> => {
  // Normalize projects with derived fields for consumers
  const normalized: NormalizedProject[] = projects.map((p) => normalizeProject(p));
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

export function normalizeProject(p: Project): NormalizedProject {
  const slug = p.slug || slugify(p.title || p.id);
  const gm = (p.gamemode as GamemodeSlug) || deriveGamemode(p);
  const cover = p.cover || p.image;
  return { ...p, slug, gamemode: gm, cover } as NormalizedProject;
}

export async function getProjectsByMode(
  mode: GamemodeSlug,
): Promise<NormalizedProject[]> {
  const all = await getProjects();
  return all.filter((p) => p.gamemode === mode);
}

/** Load a single project by its mode + slug (normalized). */
export async function getProjectByModeAndSlug(
  mode: GamemodeSlug,
  slug: string,
): Promise<NormalizedProject | null> {
  const all = await getProjects();
  return (
    all.find(
      (p) => p.gamemode === mode && p.slug.toLowerCase() === slug.toLowerCase(),
    ) || null
  );
}

/** Load a project by slug only (first match across modes). */
export async function getProjectBySlug(
  slug: string,
): Promise<NormalizedProject | null> {
  const all = await getProjects();
  return (
    all.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null
  );
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
  const all = await getProjects();
  const withDates = all.map((p) => {
    let date = 0;
    if (p.createdAt) {
      date = Date.parse(p.createdAt);
    } else if (p.year) {
      date = Date.parse(`${p.year}-01-01`);
    }
    return { p, date };
  });
  // Featured first (sorted by newest)
  const featured = withDates
    .filter(({ p }) => !!p.featured)
    .sort((a, b) => b.date - a.date)
    .map(({ p }) => ({
      id: p.id,
      kind: "featured" as const,
      title: p.title,
      subtitle: p.description,
  image: p.cover,
  mode: p.gamemode,
  slug: p.slug,
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
  image: p.cover,
  mode: p.gamemode,
  slug: p.slug,
      tags: p.tags || [],
    }));
  const combined = [...featured, ...newestFill].slice(0, 3);
  return combined;
}
