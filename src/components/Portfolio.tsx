// Portfolio.tsx
// Main portfolio component for Nicolas Martin's website
// Uses modern responsive design principles with Tailwind CSS breakpoints
// Optimized for mobile, tablet, and desktop viewing experiences
//
// Sections: Home, Projects, About, Skills, Contact, Additional, Exit
// Features: Responsive navigation, video background, server stats, social icons

import * as React from 'react';
import { useState } from 'react';
import { Menu, X, ArrowLeft, Pause, Play, Volume2, VolumeX, Settings, Sun, Moon } from 'lucide-react';
import LocalVideoBackground from './LocalVideoBackground';
import ServerConnectionPanel from './ServerConnectionPanel';
import SocialMediaIcons from './SocialMediaIcons';
import HomeSection from './sections/HomeSection';
import ProjectsSection from './sections/ProjectsSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';
import ProjectDetail from './ProjectDetail';
import { VideoPreferences } from '../lib/cookies';
import { 
  backgroundImages,
  navigationItems,
  videoConfig,
  type Project 
} from '../content';

const Portfolio = () => {  // --- State Management ---
  // Controls for video, menu, and navigation
  const [isMuted, setIsMuted] = useState(() => VideoPreferences.getMuted()); // Video mute from cookies
  const [isPaused, setIsPaused] = useState(() => VideoPreferences.getPaused()); // Video pause from cookies
  const [isManuallyPaused, setIsManuallyPaused] = useState(() => VideoPreferences.getPaused()); // Track manual pause from cookies
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile nav menu
  const [currentSection, setCurrentSection] = useState('home'); // Current visible section
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Selected project for detail view
  const [projectFilter, setProjectFilter] = useState('all'); // Project filter (all/team/solo/academic)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Settings panel state
  const [websiteTheme, setWebsiteTheme] = useState<'dark' | 'light'>('dark'); // Website theme

  // --- Navigation Menu Items ---
  // Navigation items are now imported from content files
  const menuItems = navigationItems;

  // --- Navigation Handlers ---
  // Handles section switching and project selection
  const handleMenuClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    setSelectedProject(null);
    setIsMobileMenuOpen(false);
    
    // Pause video when navigating away from home for memory optimization
    if (sectionId !== 'home') {
      setIsPaused(true);
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    if (selectedProject) {
      setSelectedProject(null);
    } else {
      setCurrentSection('home');
      // Always resume video when returning to home, unless user manually paused it
      if (!isManuallyPaused) {
        setTimeout(() => setIsPaused(false), 100); // Small delay to ensure component is ready
      }
    }
  };

  // --- Video Controls ---
  // Controls for video playback and muting
  const toggleVideoPlayback = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    setIsManuallyPaused(newPausedState);
    VideoPreferences.setPaused(newPausedState); // Save to cookies
  };

  const toggleVideoMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    VideoPreferences.setMuted(newMutedState); // Save to cookies
  };

  // Auto-resume video when returning to home section (unless manually paused)
  React.useEffect(() => {
    if (currentSection === 'home' && !isManuallyPaused) {
      setIsPaused(false);
    }
  }, [currentSection, isManuallyPaused]);

  // --- Section Backgrounds ---
  // Returns a static background image for each section
  const getStaticBackground = (section: string) => {
    return backgroundImages[section as keyof typeof backgroundImages] ?? backgroundImages.projects;
  };

  // --- Main Content Renderer ---
  // Renders the main content area based on current section or selected project
  const renderContent = () => {
    if (selectedProject) {
      return (
        <ProjectDetail 
          project={selectedProject}
          onBack={handleBackClick}
        />
      );
    }

    switch (currentSection) {
      case 'home':
        return (
          <HomeSection 
            onNavigateToProjects={() => setCurrentSection('projects')}
          />
        );

      case 'projects':
        return (
          <ProjectsSection
            onBack={() => setCurrentSection('home')}
            onProjectClick={handleProjectClick}
            projectFilter={projectFilter}
            onFilterChange={setProjectFilter}
          />
        );

      case 'about':
        return (
          <AboutSection 
            onBack={() => setCurrentSection('home')}
          />
        );

      case 'skills':
        return (
          <SkillsSection 
            onBack={() => setCurrentSection('home')}
          />
        );

      case 'contact':
        return (
          <ContactSection 
            onBack={() => setCurrentSection('home')}
          />
        );

      case 'additional':
        return (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setCurrentSection('home')}
              className="mb-8 flex items-center space-x-2 text-amber-200 hover:text-amber-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <h2 className="text-3xl md:text-5xl font-bold text-amber-100 mb-8 md:mb-16 text-center deadlock-title">
              ADDITIONAL CONTENT
            </h2>
            <div className="bg-black/50 backdrop-blur-sm border border-amber-500/20 rounded-lg p-6 md:p-8 atmospheric-glow text-center">
              <p className="text-lg md:text-xl text-amber-200/80 mb-6 md:mb-8">
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
            <h2 className="text-3xl md:text-5xl font-bold text-amber-100 mb-6 md:mb-8 deadlock-title">
              GOODBYE
            </h2>
            <p className="text-lg md:text-xl text-amber-200/80 mb-6 md:mb-8">
              Thanks for visiting my portfolio. May your games be legendary!
            </p>
            <button
              onClick={() => setCurrentSection('home')}
              className="px-6 md:px-8 py-3 md:py-4 bg-amber-500/20 border-2 border-amber-500/50 rounded-lg text-amber-100 font-semibold hover:bg-amber-500/30 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
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
      {/* Shows local video on home, static image on other sections */}
      {!isInnerPage ? (
        <div className="fixed inset-0 z-0">
          <LocalVideoBackground
            videoSrc={videoConfig.localVideoSrc}
            posterSrc={videoConfig.posterSrc}
            isPaused={isPaused}
            isMuted={isMuted}
            className="video-responsive"
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

      {/* Mobile Menu Button */}
      {!isInnerPage && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 md:top-6 md:left-6 z-50 lg:hidden bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-amber-100" />
          ) : (
            <Menu className="w-6 h-6 text-amber-100" />
          )}
        </button>
      )}      {/* Left Navigation Menu - Responsive Design */}
      {!isInnerPage && (
        <nav className={`fixed left-0 top-0 h-full w-88 md:w-[28rem] z-40 transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="h-full bg-gradient-to-r from-black/95 via-black/70 via-black/30 to-transparent">{/* Game Logo Area - Responsive padding */}
            <div className="pt-14 md:pt-20 pb-7 md:pb-10 px-8 md:px-12">
              <h1 className="deadlock-title mb-1 text-3xl md:text-4xl lg:text-5xl">NICOLAS MARTIN</h1>
              <p className="text-amber-200/80 text-base md:text-lg lg:text-xl tracking-wide font-medium" style={{ fontFamily: 'Good Timing, serif' }}>
                Game Programmer
              </p>
            </div>

            {/* Menu Items - Responsive spacing */}
            <div className="px-6 md:px-8 space-y-4 md:space-y-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.section)}
                  className={`deadlock-menu-item group cursor-pointer transition-all duration-300 relative block w-full text-left text-sm md:text-base ${
                    currentSection === item.section ? 'text-amber-100 text-shadow-glow' : ''
                  }`}
                  type="button"
                  tabIndex={0}
                  aria-current={currentSection === item.section ? 'page' : undefined}
                >
                  {/* Game-style text with hover effect - both texts occupy same space */}
                  <span className="block group-hover:opacity-0 transition-opacity duration-300">
                    {item.gameLabel}
                  </span>
                  <span className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.hoverLabel}
                  </span>
                </button>
              ))}
            </div>            {/* Bottom Controls - Just Settings Button */}
            <div className="absolute bottom-6 md:bottom-8 left-8 md:left-12">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 hover:bg-amber-500/20 hover:scale-110"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-amber-200" />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Server Connection Panel - Hidden on mobile and tablets, visible on desktop */}
      {!isInnerPage && (
        <ServerConnectionPanel className="fixed top-6 md:top-8 right-6 md:right-8 z-30 hidden xl:block" />
      )}

      {/* Social Media Icons - Responsive positioning and layout */}
      {!isInnerPage && (
        <SocialMediaIcons className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-30" />
      )}      {/* Settings Mini Menu */}
      {isSettingsOpen && !isInnerPage && (
        <>
          {/* Settings Overlay */}
          <button 
            className="fixed inset-0 bg-transparent z-50"
            onClick={() => setIsSettingsOpen(false)}
            aria-label="Close settings menu"
            type="button"
          />          {/* Small Settings Menu Above Button */}
          <div className="fixed bottom-20 md:bottom-22 left-8 md:left-12 z-[60]">
            <div className="bg-black/90 backdrop-blur-sm border border-amber-500/40 rounded-lg p-2 shadow-xl">
              <div className="flex space-x-2">
                {/* Theme Toggle */}
                <button
                  onClick={() => setWebsiteTheme(websiteTheme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors border border-amber-500/30 hover:border-amber-500/60"
                  title={`Switch to ${websiteTheme === 'dark' ? 'light' : 'dark'} theme`}
                >
                  {websiteTheme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-200" />
                  ) : (
                    <Moon className="w-4 h-4 text-amber-200" />
                  )}
                </button>
                
                {/* Video Toggle */}
                <button
                  onClick={toggleVideoPlayback}
                  className="p-2 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors border border-amber-500/30 hover:border-amber-500/60"
                  title={isPaused ? "Play background video" : "Pause background video"}
                >
                  {isPaused ? (
                    <Play className="w-4 h-4 text-amber-200" />
                  ) : (
                    <Pause className="w-4 h-4 text-amber-200" />
                  )}
                </button>
                
                {/* Audio Toggle */}
                <button
                  onClick={toggleVideoMute}
                  className="p-2 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors border border-amber-500/30 hover:border-amber-500/60"
                  title={isMuted ? "Unmute video audio" : "Mute video audio"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-amber-200" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-amber-200" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area - Responsive margins and padding */}
      <div className={`relative z-10 ${!isInnerPage ? 'lg:ml-[22rem] xl:ml-[28rem]' : ''}`}>
        <div className="min-h-screen flex items-start justify-center px-4 md:px-6 lg:px-8 pt-6 md:pt-8">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && !isInnerPage && (
        <button
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close mobile menu overlay"
          tabIndex={0}
          type="button"
          style={{ cursor: 'pointer' }}
        />
      )}
    </div>
  );
};

export default Portfolio;
