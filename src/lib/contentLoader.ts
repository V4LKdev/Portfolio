import { projects, type Project } from "../content/projects";
import { skillsContent } from "../content/skills";

export const getProjects = async (): Promise<Project[]> => {
  return Promise.resolve(projects);
};

export const getSkills = async (): Promise<typeof skillsContent> => {
  return Promise.resolve(skillsContent);
};
