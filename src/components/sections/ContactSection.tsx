// Contact Section Component
// Displays contact information in a game-style chat interface
// Shows email, phone, GitHub, and location information

import React from "react";
import { personalInfo } from "../../content";
import { BackButton } from "../ui/navigation";
import { NavigableSectionProps } from "../../types/SharedProps";

interface ContactSectionProps extends NavigableSectionProps {}

/**
 * Contact section component - displays contact information in game-style format
 * @param onBack - Callback to navigate back to home
 */
const ContactSection: React.FC<ContactSectionProps> = ({ onBack, className, id }) => {
  return (
    <div className={`max-w-4xl mx-auto ${className || ""}`} id={id}>
      <BackButton onClick={onBack} label="Back to Home" />
      <h2 className="text-5xl font-bold mb-16 text-center deadlock-title">
        Global Chat
      </h2>
      <div className="theme-card rounded-lg p-8 atmospheric-glow">
        {/* User status header */}
        <div className="border-b theme-divider pb-4 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div
              className={`w-3 h-3 ${personalInfo.status.available ? "bg-green-400" : "bg-red-400"} rounded-full animate-pulse`}
            ></div>
            <span className="theme-heading font-semibold">
              {personalInfo.name}
            </span>
            <span className="theme-text-muted text-sm">@Game_Programmer</span>
          </div>
          <p className="theme-text text-sm">
            Status: {personalInfo.status.statusText}
          </p>
        </div>

        {/* Contact information cards */}
        <div className="space-y-4">
          <div className="theme-contact-card rounded-lg p-4">
            <p className="theme-heading mb-2">📧 Direct Message:</p>
            <p className="theme-text">{personalInfo.email}</p>
          </div>

          <div className="theme-contact-card rounded-lg p-4">
            <p className="theme-heading mb-2">📱 Voice Chat:</p>
            <p className="theme-text">{personalInfo.phone}</p>
          </div>

          <div className="theme-contact-card rounded-lg p-4">
            <p className="theme-heading mb-2">🐙 Guild Repository:</p>
            <p className="theme-text">{personalInfo.github}</p>
          </div>

          <div className="theme-contact-card rounded-lg p-4">
            <p className="theme-heading mb-2">📍 Server Location:</p>
            <p className="theme-text">{personalInfo.location}</p>
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-8 pt-6 border-t theme-divider">
          <p className="theme-text-muted text-sm text-center">
            Ready to join forces? Send a message and let's build something
            legendary!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
