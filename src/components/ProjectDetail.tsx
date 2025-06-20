// Project Detail Component
// Displays detailed information about a selected project
// Features tabbed navigation for Design, Code, and Implementation sections

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { type Project } from '../content';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

type ProjectTab = 'design' | 'code' | 'implementation';

/**
 * Project detail component with tabbed content sections
 * @param project - The project to display details for
 * @param onBack - Callback to navigate back to projects list
 */
const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<ProjectTab>('design');

  const tabs = [
    { id: 'design' as ProjectTab, label: 'Design', icon: '🎨' },
    { id: 'code' as ProjectTab, label: 'Code', icon: '💻' },
    { id: 'implementation' as ProjectTab, label: 'Implementation', icon: '⚡' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'design':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-amber-100 mb-4">Design Process</h3>
            <p className="text-amber-200/80">
              Design content will be populated from your previous version...
            </p>
          </div>
        );
      
      case 'code':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-amber-100 mb-4">Technical Implementation</h3>
            <p className="text-amber-200/80">
              Code details and technical documentation will be added here...
            </p>
          </div>
        );
      
      case 'implementation':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-amber-100 mb-4">Development Journey</h3>
            <p className="text-amber-200/80">
              Implementation details and development process will be shown here...
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto transition-all duration-500 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Projects</span>
      </button>

      {/* Project Header */}
      <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg overflow-hidden atmospheric-glow mb-8">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-amber-500/20 text-amber-200 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-amber-100 mb-4 deadlock-title">
            {project.title}
          </h1>
          <p className="text-xl text-amber-200/80 mb-4">
            {project.description}
          </p>
          <div className="text-amber-400">
            {project.details}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg atmospheric-glow">
        <div className="flex border-b border-amber-500/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-center transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-100 border-b-2 border-amber-500'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-500/10'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">{tab.icon}</span>
                <span className="font-semibold">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
