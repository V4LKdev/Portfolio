/**
 * contentLoader.ts
 *
 * A module for asynchronously loading content from the local file system.
 * This abstracts the data source from the components, allowing for easier
 * migration to a CMS or other data source in the future.
 */
import { projects, type Project } from "../content/projects";
import { skillsContent } from "../content/skills";

/**
 * Fetches the list of projects.
 * @returns A promise that resolves to an array of projects.
 */
export const getProjects = async (): Promise<Project[]> => {
  // Simulate async loading
  return Promise.resolve(projects);
};

/**
 * Fetches the list of skills.
 * @returns A promise that resolves to the skills content object.
 */
export const getSkills = async (): Promise<typeof skillsContent> => {
  // Simulate async loading
  return Promise.resolve(skillsContent);
};
