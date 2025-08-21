// Contact Section Component
// Displays contact information in a game-style chat interface
// Shows email, phone, GitHub, and location information

import React, { useEffect, useState } from "react";
import { personalInfo } from "../../content";
import { BackButton } from "../ui/navigation";
import { NavigableSectionComponent } from "../../types/SharedProps";

/**
 * Contact section component - displays contact information in game-style format
 * @param onBack - Callback to navigate back to home
 */
const ContactSection: NavigableSectionComponent = ({
  onBack,
  className,
  id,
}) => {
  const [berlinTime, setBerlinTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Berlin" })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setBerlinTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Berlin" }));
    }, 1000 * 30); // update every 30s
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`max-w-3xl mx-auto px-4 py-16 text-selectable ${className ?? ""}`} id={id}>
      <BackButton onClick={onBack} label="Back to Home" />
      <div className="theme-card-static rounded-2xl p-10 shadow-2xl border border-accent/30 bg-zinc-900/95">
        <div className="flex flex-col items-center text-center gap-3">
          <h2 className="text-4xl font-extrabold game-title tracking-wide text-accent">Contact</h2>
          <p className="theme-text text-base">
            Based in <span className="font-semibold text-white/90">{personalInfo.location}</span>; open to opportunities.
          </p>
          <div className="flex items-center gap-3">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${personalInfo.status.available ? "bg-green-400" : "bg-red-400"}`}></span>
            <span className="theme-text-muted text-sm">{personalInfo.status.availabilityText}</span>
            <span className="theme-text-muted text-sm">• {berlinTime} CET</span>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10" />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-accent/90">Email</h3>
              <a href={`mailto:${personalInfo.email}`} className="theme-text-link text-base font-mono underline underline-offset-4">
                {personalInfo.email}
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-accent/90">GitHub</h3>
              <a
                href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-text-link text-base font-mono underline underline-offset-4"
              >
                {personalInfo.github.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>

          {/* Phone - full width row beneath email + github */}
          <div className="md:col-span-2 flex justify-center">
            <div className="text-center">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-accent/90">Phone</h3>
              <a href={`tel:${personalInfo.phone.replace(/\s|\(|\)|-/g, "")}`} className="theme-text-link text-base font-mono">
                {personalInfo.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
