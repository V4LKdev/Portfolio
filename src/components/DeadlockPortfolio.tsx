// DeadlockPortfolio.tsx
// Main portfolio component for Nicolas Martin's website
// Handles navigation, section rendering, and layout for all main content sections
//
// Sections: Home, Projects, About, Skills, Contact, Additional, Exit
// Uses Tailwind CSS for styling and custom UI components for interactivity

import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Menu, X, ArrowLeft, Pause, Play } from 'lucide-react';
import ProjectFilter from './ProjectFilter';
import BackgroundMusic from './BackgroundMusic';
import MenuButton from './MenuButton';
import { 
  projects, 
  personalInfo, 
  aboutContent, 
  skillsContent, 
  backgroundImages,
  navigationItems,
  videoConfig,
  type Project 
} from '../content';

const DeadlockPortfolio = () => {
  // --- State Management ---
  // Controls for music, video, menu, and navigation
  const [isMuted, setIsMuted] = useState(videoConfig.defaultMuted); // YouTube video mute
  const [isMusicMuted, setIsMusicMuted] = useState(true); // Background music mute
  const [isPaused, setIsPaused] = useState(videoConfig.defaultPaused); // YouTube video pause
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile nav menu
  const [currentSection, setCurrentSection] = useState('home'); // Current visible section
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Selected project for detail view
  const [projectFilter, setProjectFilter] = useState('all'); // Project filter (all/team/solo/academic)

  // --- Navigation Menu Items ---
  // Navigation items are now imported from content files
  const menuItems = navigationItems;

  // --- Project Data ---
  // Project data is now imported from content file for easier editing
  // Located in: src/content/portfolioData.ts

  // --- Project Filtering ---
  // Filters projects based on selected filter
  const filteredProjects = projects.filter(project => {
    if (projectFilter === 'all') return true;
    if (projectFilter === 'team') return project.type === 'team';
    if (projectFilter === 'solo') return project.type === 'solo';
    if (projectFilter === 'academic') return project.type === 'academic';
    return true;
  });

  // --- Navigation Handlers ---
  // Handles section switching and project selection
  const handleMenuClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    setSelectedProject(null);
    setIsMobileMenuOpen(false);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    if (selectedProject) {
      setSelectedProject(null);
    } else {
      setCurrentSection('home');
    }
  };

  // --- Video Controls ---
  // Pauses/plays the background YouTube video
  const toggleVideoPlayback = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      setIsPaused(!isPaused);
    }
  };

  // --- Section Backgrounds ---
  // Returns a static background image for each section
  const getStaticBackground = (section: string) => {
    return backgroundImages[section as keyof typeof backgroundImages] || backgroundImages.projects;
  };

  // --- Project Detail Renderer ---
  // Renders the detail view for a selected project
  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    return (
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBackClick}
          className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Projects</span>
        </button>
        
        <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg overflow-hidden atmospheric-glow">
          <img
            src={selectedProject.image}
            alt={selectedProject.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedProject.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-amber-500/20 text-amber-200 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-amber-100 mb-4 deadlock-title">
              {selectedProject.title}
            </h1>
            <p className="text-xl text-amber-200/80 mb-6">
              {selectedProject.description}
            </p>
            <div className="text-amber-400">
              {selectedProject.details}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Content Renderer ---
  // Renders the main content area based on current section or selected project
  const renderContent = () => {
    if (selectedProject) {
      return (
        <div className="max-w-6xl mx-auto transition-all duration-500 animate-fade-in">
          <button
            onClick={handleBackClick}
            className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </button>
          
          <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg overflow-hidden atmospheric-glow">
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-amber-500/20 text-amber-200 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold text-amber-100 mb-4 deadlock-title">
                {selectedProject.title}
              </h1>
              <p className="text-xl text-amber-200/80 mb-6">
                {selectedProject.description}
              </p>
              <div className="text-amber-400">
                {selectedProject.details}
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (currentSection) {
      case 'home':
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
              onClick={() => setCurrentSection('projects')}
            />
          </div>
        );

      case 'projects':
        return (
          <div className="max-w-6xl mx-auto transition-all duration-500 animate-fade-in">
            <button
              onClick={handleBackClick}
              className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <h2 className="text-5xl font-bold text-amber-100 mb-8 text-center deadlock-title">
              FEATURED PROJECTS
            </h2>
            <p className="text-center text-amber-400 mb-12 text-lg" style={{ fontFamily: 'Good Timing, serif' }}>
              Portfolio of Game Development Work
            </p>
            
            <ProjectFilter 
              activeFilter={projectFilter}
              onFilterChange={setProjectFilter}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg overflow-hidden hover:border-amber-500/50 transition-all duration-300 atmospheric-glow hover:scale-105 cursor-pointer"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-amber-500/20 text-amber-200 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-amber-100 mb-2" style={{ fontFamily: 'Good Timing, serif' }}>
                      {project.title}
                    </h3>
                    <p className="text-amber-200/70 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="text-amber-400 text-xs">
                      {project.details}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBackClick}
              className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <h2 className="text-5xl font-bold text-amber-100 mb-16 text-center deadlock-title">
              ABOUT ME
            </h2>
            
            <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg p-8 atmospheric-glow">
              {aboutContent.intro.map((paragraph, index) => (
                <p key={index} className="text-lg text-amber-200/80 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-xl font-semibold text-amber-100 mb-3" style={{ fontFamily: 'Good Timing, serif' }}>Education</h3>
                  {aboutContent.education.map((edu, index) => (
                    <p key={index} className="text-amber-200/70 text-sm mb-2">
                      <strong>{edu.institution}</strong> - {edu.degree}<br/>
                      {edu.period}
                    </p>
                  ))}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-100 mb-3" style={{ fontFamily: 'Good Timing, serif' }}>Experience</h3>
                  <p className="text-amber-200/70 text-sm">
                    {aboutContent.experience}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="max-w-6xl mx-auto">
            <button
              onClick={handleBackClick}
              className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <h2 className="text-5xl font-bold text-amber-100 mb-16 text-center deadlock-title">
              SKILLS & TOOLS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      case 'contact':
        return (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBackClick}
              className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <h2 className="text-5xl font-bold text-amber-100 mb-16 text-center deadlock-title">
              GLOBAL CHAT
            </h2>
            <div className="bg-black/70 backdrop-blur-sm border border-amber-500/30 rounded-lg p-8 atmospheric-glow">
              <div className="border-b border-amber-500/20 pb-4 mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-amber-100 font-semibold">Nicolas Martin</span>
                  <span className="text-amber-200/60 text-sm">@Game_Programmer</span>
                </div>
                <p className="text-amber-200/80 text-sm">Status: Available for new projects</p>
              </div>
              
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
              
              <div className="mt-8 pt-6 border-t border-amber-500/20">
                <p className="text-amber-200/60 text-sm text-center">
                  Ready to join forces? Send a message and let's build something legendary!
                </p>
              </div>
            </div>
          </div>
        );

      case 'additional':
        return (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBackClick}
              className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <h2 className="text-5xl font-bold text-amber-100 mb-16 text-center deadlock-title">
              ADDITIONAL CONTENT
            </h2>
            <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg p-8 atmospheric-glow text-center">
              <p className="text-xl text-amber-200/80 mb-8">
                This section is reserved for future content including music career, creative projects, and other endeavors beyond programming.
              </p>
              <p className="text-amber-200/60">
                Coming soon...
              </p>
            </div>
          </div>
        );

      case 'exit':
        return (
          <div className="text-center max-w-4xl">
            <h2 className="text-5xl font-bold text-amber-100 mb-8 deadlock-title">
              GOODBYE
            </h2>
            <p className="text-xl text-amber-200/80 mb-8">
              Thanks for visiting my portfolio. May your games be legendary!
            </p>
            <button
              onClick={() => setCurrentSection('home')}
              className="px-8 py-4 bg-amber-500/20 border-2 border-amber-500/50 rounded-lg text-amber-100 font-semibold hover:bg-amber-500/30 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            >
              Return Home
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // --- Layout Logic ---
  // Determines if we are on a subpage (not home)
  const isInnerPage = currentSection !== 'home';

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden">
      {/* Background Video or Static Image */}
      {/* Shows YouTube video on home, static image on other sections */}
      {!isInnerPage ? (
        <div className="fixed inset-0 z-0">
          <iframe
            className="absolute inset-0 w-full h-full object-cover video-responsive"
            src={`https://www.youtube.com/embed/${videoConfig.youtubeVideoId}?autoplay=${isPaused ? '0' : '1'}&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${videoConfig.youtubeVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="absolute inset-0 video-overlay" />
        </div>
      ) : (
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: `url(${getStaticBackground(currentSection)})` }}
        >
          <div className="absolute inset-0 video-overlay" />
        </div>
      )}

      {/* Background Music */}
      <BackgroundMusic 
        isMuted={isMusicMuted}
        onToggleMute={() => setIsMusicMuted(!isMusicMuted)}
      />

      {/* Mobile Menu Button */}
      {!isInnerPage && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-6 left-6 z-50 lg:hidden bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-amber-100" />
          ) : (
            <Menu className="w-6 h-6 text-amber-100" />
          )}
        </button>
      )}

      {/* Left Navigation Menu (desktop & mobile) */}
      {!isInnerPage && (
        <nav className={`fixed left-0 top-0 h-full w-80 z-40 transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="h-full bg-black/70 backdrop-blur-sm border-r border-amber-500/20 atmospheric-glow">
            {/* Game Logo Area */}
            <div className="pt-16 pb-8 px-8">
              <h1 className="deadlock-title mb-2">PORTFOLIO</h1>
              <p className="text-amber-200/60 text-sm tracking-wide font-light">
                NICOLAS MARTIN WORKSPACE
              </p>
            </div>

            {/* Menu Items */}
            <div className="px-8 space-y-6">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleMenuClick(item.section)}
                  className={`deadlock-menu-item group cursor-pointer transition-all duration-300 relative ${
                    currentSection === item.section ? 'text-amber-100 text-shadow-glow' : ''
                  }`}
                >
                  {/* Game-style text with hover effect - both texts occupy same space */}
                  <div className="relative">
                    <span className="block group-hover:opacity-0 transition-opacity duration-300">
                      {item.gameLabel}
                    </span>
                    <span className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.hoverLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-8 flex items-center space-x-4">
              <BackgroundMusic 
                isMuted={isMusicMuted}
                onToggleMute={() => setIsMusicMuted(!isMusicMuted)}
              />
              <button
                onClick={toggleVideoPlayback}
                className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 hover:bg-amber-500/20"
              >
                {isPaused ? (
                  <Play className="w-5 h-5 text-amber-200" />
                ) : (
                  <Pause className="w-5 h-5 text-amber-200" />
                )}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Availability Status Box (home only) */}
      {!isInnerPage && (
        <div className="fixed bottom-8 right-8 z-30 bg-black/70 backdrop-blur-sm border border-amber-500/30 rounded-lg p-4 atmospheric-glow">
          <div className="text-amber-100 font-semibold text-sm mb-1">
            Available for Freelance
          </div>
          <div className="text-amber-200/80 text-xs">
            Mon-Fri 9AM-6PM CET
          </div>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-400 text-xs">Currently Available</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`relative z-10 ${!isInnerPage ? 'lg:ml-80' : ''}`}>
        <div className="min-h-screen flex items-start justify-center px-8 pt-8">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && !isInnerPage && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DeadlockPortfolio;
