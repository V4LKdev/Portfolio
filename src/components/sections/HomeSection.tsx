// Home Section Component
// Landing page content with hero text and call-to-action
// Displays personal information and main navigation button

import React from 'react';
import { personalInfo } from '../../content';
import MenuButton from '../MenuButton';

interface HomeSectionProps {
  onNavigateToProjects: () => void;
}

/**
 * Home section component - main landing page content
 * @param onNavigateToProjects - Callback to navigate to projects section
 */
const HomeSection: React.FC<HomeSectionProps> = ({ onNavigateToProjects }) => {
  return (
    <div className="text-left max-w-4xl pt-8 transition-all duration-500 animate-fade-in">
      <h1 className="text-3xl lg:text-5xl font-bold text-amber-100 mb-3 deadlock-title">
        {personalInfo.name}
      </h1>
      <h2 className="text-xl lg:text-2xl font-bold text-amber-200 mb-4" style={{ fontFamily: 'Good Timing, serif' }}>
        {personalInfo.title}
      </h2>
      <p className="text-base lg:text-lg text-amber-200/80 mb-6 font-light leading-relaxed max-w-2xl">
        {personalInfo.tagline}
      </p>
      <MenuButton
        label="View My Work"
        hoverLabel="Explore Projects"
        onClick={onNavigateToProjects}
      />
    </div>
  );
};

export default HomeSection;
