// Contact Section Component
// Displays contact information in a game-style chat interface
// Shows email, phone, GitHub, and location information

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { personalInfo } from '../../content';

interface ContactSectionProps {
  onBack: () => void;
}

/**
 * Contact section component - displays contact information in game-style format
 * @param onBack - Callback to navigate back to home
 */
const ContactSection: React.FC<ContactSectionProps> = ({ onBack }) => {
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
        GLOBAL CHAT
      </h2>
      
      <div className="bg-black/70 backdrop-blur-sm border border-amber-500/30 rounded-lg p-8 atmospheric-glow">
        {/* User status header */}
        <div className="border-b border-amber-500/20 pb-4 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-3 h-3 ${personalInfo.status.available ? 'bg-green-400' : 'bg-red-400'} rounded-full animate-pulse`}></div>
            <span className="text-amber-100 font-semibold">{personalInfo.name}</span>
            <span className="text-amber-200/60 text-sm">@Game_Programmer</span>
          </div>
          <p className="text-amber-200/80 text-sm">Status: {personalInfo.status.statusText}</p>
        </div>
        
        {/* Contact information cards */}
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-amber-100 mb-2">📧 Direct Message:</p>
            <p className="text-amber-200/80">{personalInfo.email}</p>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-amber-100 mb-2">📱 Voice Chat:</p>
            <p className="text-amber-200/80">{personalInfo.phone}</p>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-amber-100 mb-2">🐙 Guild Repository:</p>
            <p className="text-amber-200/80">{personalInfo.github}</p>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-amber-100 mb-2">📍 Server Location:</p>
            <p className="text-amber-200/80">{personalInfo.location}</p>
          </div>
        </div>
        
        {/* Footer message */}
        <div className="mt-8 pt-6 border-t border-amber-500/20">
          <p className="text-amber-200/60 text-sm text-center">
            Ready to join forces? Send a message and let's build something legendary!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
