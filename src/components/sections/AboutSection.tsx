// About Section Component
// Displays personal information, education, and experience
// Shows bio, academic background, and professional experience

import React from "react";
import { ArrowLeft } from "lucide-react";
import { aboutContent } from "../../content";

interface AboutSectionProps {
  onBack: () => void;
}

/**
 * About section component - displays personal information and background
 * @param onBack - Callback to navigate back to home
 */
const AboutSection: React.FC<AboutSectionProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <h2 className="text-5xl font-bold text-amber-100 mb-16 text-center deadlock-title">
        ABOUT ME
      </h2>

      <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg p-8 atmospheric-glow">
        {/* Bio paragraphs */}
        {aboutContent.intro.map((paragraph, index) => (
          <p
            key={index}
            className="text-lg text-amber-200/80 leading-relaxed mb-6"
          >
            {paragraph}
          </p>
        ))}

        {/* Education and Experience grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3
              className="text-xl font-semibold text-amber-100 mb-3"
              style={{ fontFamily: "Good Timing, serif" }}
            >
              Education
            </h3>
            {aboutContent.education.map((edu, index) => (
              <p key={index} className="text-amber-200/70 text-sm mb-2">
                <strong>{edu.institution}</strong> - {edu.degree}
                <br />
                {edu.period}
              </p>
            ))}
          </div>
          <div>
            <h3
              className="text-xl font-semibold text-amber-100 mb-3"
              style={{ fontFamily: "Good Timing, serif" }}
            >
              Experience
            </h3>
            <p className="text-amber-200/70 text-sm">
              {aboutContent.experience}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
