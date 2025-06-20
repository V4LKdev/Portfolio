// Skills Section Component
// Displays technical skills, tools, and soft skills
// Organized in a grid layout with different categories

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { skillsContent } from '../../content';

interface SkillsSectionProps {
  onBack: () => void;
}

/**
 * Skills section component - displays technical and soft skills
 * @param onBack - Callback to navigate back to home
 */
const SkillsSection: React.FC<SkillsSectionProps> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>
      
      <h2 className="text-5xl font-bold text-amber-100 mb-16 text-center deadlock-title">
        SKILLS & TOOLS
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Software & Tools */}
        <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg p-6 atmospheric-glow">
          <h3 className="text-2xl font-semibold text-amber-100 mb-4" style={{ fontFamily: 'Good Timing, serif' }}>
            Software
          </h3>
          <ul className="space-y-2">
            {skillsContent.software.map((skill, index) => (
              <li key={index} className="text-amber-200/80">• {skill}</li>
            ))}
          </ul>
        </div>

        {/* Programming Languages */}
        <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg p-6 atmospheric-glow">
          <h3 className="text-2xl font-semibold text-amber-100 mb-4" style={{ fontFamily: 'Good Timing, serif' }}>
            Programming Languages
          </h3>
          <ul className="space-y-2">
            {skillsContent.programmingLanguages.map((lang, index) => (
              <li key={index} className="text-amber-200/80">• {lang}</li>
            ))}
          </ul>
        </div>

        {/* Unreal Engine Skills */}
        <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg p-6 atmospheric-glow">
          <h3 className="text-2xl font-semibold text-amber-100 mb-4" style={{ fontFamily: 'Good Timing, serif' }}>
            Unreal Engine
          </h3>
          <ul className="space-y-2">
            {skillsContent.unrealEngine.map((skill, index) => (
              <li key={index} className="text-amber-200/80">• {skill}</li>
            ))}
          </ul>
        </div>

        {/* Soft Skills */}
        <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg p-6 atmospheric-glow md:col-span-2 lg:col-span-3">
          <h3 className="text-2xl font-semibold text-amber-100 mb-4" style={{ fontFamily: 'Good Timing, serif' }}>
            Soft Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {skillsContent.softSkills.map((skill, index) => (
              <div key={index} className="text-amber-200/80">• {skill}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
