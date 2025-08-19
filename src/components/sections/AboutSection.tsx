// About Section Component
// Displays personal information, education, and experience
// Shows bio, academic background, and professional experience


import { BackButton } from "../ui/navigation";
import { NavigableSectionComponent } from "../../types/SharedProps";
import { Link } from "react-router-dom";

const avatarUrl = "/public/placeholder.svg"; // Replace with your image if available

const milestones = [
  { year: "2018", text: "Started programming" },
  { year: "2023", text: "Graduated high school" },
  { year: "2024", text: "Began Game Programming studies" },
];

const AboutSection: NavigableSectionComponent = ({ onBack, className, id }) => {
  return (
    <div className={`max-w-6xl mx-auto px-4 py-16 text-selectable ${className ?? ""}`} id={id}>
      <BackButton onClick={onBack} label="Back to Home" />
      <div className="theme-card-static rounded-2xl p-14 flex flex-col md:flex-row items-start shadow-2xl border border-accent/30 bg-zinc-900/95 gap-12">
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <img
            src={avatarUrl}
            alt="Portrait"
            className="w-56 h-56 rounded-full object-cover border-4 border-accent shadow-xl mb-8 flex-shrink-0"
          />
          <div className="w-full">
            <h3 className="text-2xl font-semibold mb-4 text-accent text-center md:text-left">Key Milestones</h3>
            <ul className="flex flex-col gap-4 w-full max-w-lg mx-auto md:mx-0">
              {milestones.map((m) => (
                <li key={m.year} className="flex items-center gap-5 text-lg theme-text-muted">
                  <span className="font-bold text-accent w-20 text-right">{m.year}</span>
                  <span className="flex-1">{m.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start w-full md:w-2/3">
          <h2 className="text-6xl font-extrabold mb-8 game-title tracking-wide text-accent text-center md:text-left">About Me</h2>
          <p className="text-2xl theme-text mb-8 max-w-2xl text-center md:text-left">
            Hi! I'm Nicolas Martin, a student game programmer passionate about Unreal Engine, C++, and multiplayer systems. I love solving technical challenges and building tools that empower other developers. Currently studying Game Programming at CGSpectrum Institute.
          </p>
          <div className="mb-8 w-full">
            <h3 className="text-2xl font-semibold mb-4 text-accent">Quick Facts</h3>
            <ul className="flex flex-col gap-3 w-full max-w-lg">
              <li className="theme-text-muted text-lg">Based in Lindau, Bavaria</li>
              <li className="theme-text-muted text-lg">Enjoys game jams and collaborative projects</li>
              <li className="theme-text-muted text-lg">Favorite genres: Platformers, Puzzle, Multiplayer</li>
              <li className="theme-text-muted text-lg">Always learning and experimenting with new tech</li>
            </ul>
          </div>
          <div className="w-full border-t border-white/10 pt-6 flex flex-col items-center md:items-start">
            <span className="theme-text-muted text-base mb-3">Explore More</span>
            <div className="flex flex-wrap gap-4">
              <Link to="/skills" className="theme-btn-accent theme-btn text-base font-bold px-6 py-2 rounded-xl shadow-md border-2 border-white transition-colors duration-200 hover:bg-white hover:text-zinc-900">Skills</Link>
              <Link to="/cv" className="theme-btn-accent theme-btn text-base font-bold px-6 py-2 rounded-xl shadow-md border-2 border-white transition-colors duration-200 hover:bg-white hover:text-zinc-900">CV</Link>
              <Link to="/contact" className="theme-btn-accent theme-btn text-base font-bold px-6 py-2 rounded-xl shadow-md border-2 border-white transition-colors duration-200 hover:bg-white hover:text-zinc-900">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
