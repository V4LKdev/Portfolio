import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/onboarding.css";
import SocialMediaIcons from "../components/media/SocialMediaIcons";
import { exitContent } from "../content/onboarding-exit";

const ExitPage: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    // Blur any focused element on mount to prevent blue text cursor/caret
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // Hide text caret globally for this page
    const style = document.createElement("style");
    style.innerHTML = "* { caret-color: transparent !important; }";
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center onboarding-background p-4 select-none cursor-default"
      tabIndex={-1}
    >
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
        {/* Exit Header */}
        <div className="flex flex-col items-center mb-10 w-full text-center">
          <span
            className="onboarding-title block w-full text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-extrabold tracking-widest text-[#3b82f6] drop-shadow-lg uppercase leading-tight select-none focus:outline-none"
            style={{ letterSpacing: "0.10em" }}
            tabIndex={-1}
            aria-hidden="true"
            onMouseDown={(e) => e.preventDefault()}
          >
            {exitContent.title}
          </span>
        </div>
        {/* Exit Message */}
        <div className="flex flex-col items-center mb-8 w-full">
          <span className="text-xl sm:text-2xl text-white/90 text-center max-w-2xl px-4 font-semibold mb-2">
            {exitContent.subtitle}
          </span>
          <span className="text-lg text-white/70 text-center max-w-2xl px-4 leading-relaxed">
            {exitContent.description.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br className="hidden sm:inline" />
              </React.Fragment>
            ))}
          </span>
        </div>
        {/* Actions */}
        <div className="flex flex-col items-center w-full mt-8 gap-6">
          <button
            onClick={() => navigate("/", { replace: true })}
            className="w-full sm:w-80 bg-white/10 text-white px-8 py-4 font-extrabold text-xl tracking-wider uppercase shadow-xl hover:bg-white/20 hover:text-blue-200 hover:scale-[1.03] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-black rounded-md"
            style={{ boxShadow: "0 4px 32px 0 rgba(100,116,139,0.10)" }}
          >
            RETURN TO HOMEPAGE
          </button>
          <button
            onClick={() => navigate("/onboarding", { replace: true })}
            className="w-full sm:w-80 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white px-8 py-4 font-extrabold text-xl tracking-wider uppercase shadow-xl hover:from-blue-600 hover:to-blue-700 hover:scale-[1.03] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black backdrop-blur-sm bg-opacity-90 border border-blue-400 rounded-md"
            style={{ boxShadow: "0 4px 32px 0 rgba(59,130,246,0.18)" }}
          >
            {exitContent.returnButton}
          </button>
          <span className="text-white/50 text-sm mt-6 text-center w-full">
            {exitContent.closeTab}
          </span>
        </div>
        {/* Divider and Social Media Icons at the bottom */}
        <div className="w-full flex flex-col items-center mt-12">
          <div className="h-px w-2/3 bg-white/10 mb-8" />
          <SocialMediaIcons />
        </div>
      </div>
    </div>
  );
};

export default ExitPage;
