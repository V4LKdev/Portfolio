// Skills Section Component
// Displays technical skills, tools, and soft skills
// Organized in a grid layout with different categories

import React from "react";
import { skillsContent } from "../../content";
import { BackButton } from "../ui/navigation";
import { NavigableSectionComponent } from "../../types/SharedProps";

/**
 * Skills section component - displays technical and soft skills
 * @param onBack - Callback to navigate back to home
 */
const SkillsSection: NavigableSectionComponent = ({
  onBack,
  className,
  id,
}) => {
  return (
    <div className={`max-w-6xl mx-auto px-4 py-16 text-selectable ${className ?? ""}`} id={id}>
      <BackButton onClick={onBack} label="Back to Home" />

      <div className="theme-card-static rounded-2xl p-14 flex flex-col gap-6 shadow-2xl border border-white/10 bg-zinc-900/95">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h2 className="text-5xl font-bold mb-0 game-title">Skills & Tools</h2>
          <div className="flex items-center gap-3">
            <a
              href="/resume.pdf"
              download
              className="theme-btn-accent theme-btn text-base font-bold px-4 py-2 rounded-xl shadow-md border-2 border-white transition-colors duration-200 hover:bg-white hover:text-zinc-900"
            >
              Download CV
            </a>
          </div>
        </div>

        <p className="theme-text-muted">This section is currently under development — content and layout may change.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Software & Tools */}
          <div className="theme-card rounded-lg p-6 atmospheric-glow">
            <h3 className="game-section-heading text-2xl theme-heading mb-4">
              Software
            </h3>
            <ul className="space-y-2">
              {skillsContent.software.map((skill) => (
                <li key={skill} className="theme-text">
                  • {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Programming Languages */}
          <div className="theme-card rounded-lg p-6 atmospheric-glow">
            <h3 className="game-section-heading text-2xl theme-heading mb-4">
              Programming Languages
            </h3>
            <ul className="space-y-2">
              {skillsContent.programmingLanguages.map((lang) => (
                <li key={lang} className="theme-text">
                  • {lang}
                </li>
              ))}
            </ul>
          </div>

          {/* Unreal Engine Skills */}
          <div className="theme-card rounded-lg p-6 atmospheric-glow">
            <h3 className="game-section-heading text-2xl theme-heading mb-4">
              Unreal Engine
            </h3>
            <ul className="space-y-2">
              {skillsContent.unrealEngine.map((skill) => (
                <li key={skill} className="theme-text">
                  • {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Soft Skills with short clarifying descriptions */}
          <div className="theme-card rounded-lg p-6 atmospheric-glow md:col-span-2 lg:col-span-3">
            <h3 className="game-section-heading text-2xl theme-heading mb-4">
              Soft Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillsContent.softSkills.map((skill) => {
                const descriptions: Record<string, string> = {
                  "Collaboration & teamwork": "Works effectively in teams; clear roles and mutual support.",
                  "Clear and empathetic communication": "Conveys ideas and listens to feedback with respect and clarity.",
                  "Problem solving & debugging": "Breaks down problems, isolates causes, and implements reliable fixes.",
                  "Analytical thinking & design": "Applies structured thinking to design systems and evaluate trade-offs.",
                  "Rapid learning & adaptability": "Picks up new tools and concepts quickly and adapts to change.",
                  "Time management & reliability": "Delivers on schedule and prioritises work effectively.",
                };
                return (
                  <div key={skill} className="theme-text bg-black/5 rounded p-3">
                    <div className="font-semibold text-white">{skill}</div>
                    <div className="text-sm theme-text-muted mt-1">{descriptions[skill] ?? "Collaborative and dependable contributor."}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm theme-text-muted italic">If you want a different résumé format or richer CV details here, tell me and I’ll add it.</div>
      </div>
    </div>
  );
};

export default SkillsSection;
