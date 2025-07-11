// SocialMediaIcons.tsx
// Game-style social media icons for the bottom right of the main page
// Horizontal layout without borders, positioned over video background

import * as React from "react";

interface SocialMediaIconsProps {
  className?: string;
}

/**
 * Social media icons component styled as a clean horizontal bar
 * Features subtle hover effects and game-style transitions
 */
const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({
  className = "",
}) => {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/V4LKdev", // Replace with your actual GitHub
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/nicolas-martin-dev", // Replace with your actual LinkedIn
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "The Rookies",
      url: "https://www.therookies.co/u/your-profile", // Replace with your actual The Rookies profile
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L3.09 8.26l1.82 1.54L12 4.52l7.09 5.28l1.82-1.54L12 2zM12 7.3l-6.91 5.14v8.42c0 .66.54 1.2 1.2 1.2h11.42c.66 0 1.2-.54 1.2-1.2v-8.42L12 7.3zm-3.6 9.6v-3.6h7.2v3.6h-7.2z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@your-channel", // Replace with your actual YouTube channel
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];
  return (
    <div
      className={`flex items-center lg:flex-row flex-col lg:space-x-4 lg:space-y-0 space-y-2 ${className}`}
    >
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-2 transition-all duration-300 hover:scale-110"
          title={social.name}
        >
          {" "}
          {/* Icon with hover glow */}
          <div
            className="transition-all duration-300 group-hover:scale-105"
            style={{
              color: "var(--theme-social-icon, rgb(253 230 138 / 0.6))",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                "var(--theme-social-icon-hover, rgb(254 243 199))";
              e.currentTarget.style.filter =
                "drop-shadow(0 0 8px var(--theme-social-glow, rgba(251, 191, 36, 0.6)))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                "var(--theme-social-icon, rgb(253 230 138 / 0.6))";
              e.currentTarget.style.filter = "none";
            }}
          >
            {social.icon}
          </div>
        </a>
      ))}
    </div>
  );
};

export default SocialMediaIcons;
