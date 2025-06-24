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
    <div className={`max-w-6xl mx-auto ${className || ""}`} id={id}>
      <BackButton onClick={onBack} label="Back to Home" />
      <h2 className="text-5xl font-bold mb-16 text-center deadlock-title">
        Skills & Tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Software & Tools */}
        <div className="theme-card rounded-lg p-6 atmospheric-glow">
          <h3
            className="text-2xl font-semibold theme-heading mb-4"
            style={{ fontFamily: "Good Timing, serif" }}
          >
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
          <h3
            className="text-2xl font-semibold theme-heading mb-4"
            style={{ fontFamily: "Good Timing, serif" }}
          >
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
          <h3
            className="text-2xl font-semibold theme-heading mb-4"
            style={{ fontFamily: "Good Timing, serif" }}
          >
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

        {/* Soft Skills */}
        <div className="theme-card rounded-lg p-6 atmospheric-glow md:col-span-2 lg:col-span-3">
          <h3
            className="text-2xl font-semibold theme-heading mb-4"
            style={{ fontFamily: "Good Timing, serif" }}
          >
            Soft Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {skillsContent.softSkills.map((skill) => (
              <div key={skill} className="theme-text">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
