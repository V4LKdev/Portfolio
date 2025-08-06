import React from "react";
import LocalVideoBackground from "../media/LocalVideoBackground";
import SocialMediaIcons from "../media/SocialMediaIcons";
import SettingsPanel from "../panels/SettingsPanel";
import { SectionProps } from "../../types/SharedProps";
import { useVideoControls } from "../../hooks/useVideoControls";
import { videoConfig } from "../../content";

interface LayoutProps extends SectionProps {
  children: React.ReactNode;
  showVideoBackground?: boolean;
  showSidePanels?: boolean;
  backgroundImage?: string;
  isInnerPage?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  id,
  showVideoBackground = true,
  showSidePanels = true,
  backgroundImage,
  isInnerPage = false,
}) => {
  const { isPaused, isMuted, lastVideoTime, setLastVideoTime } =
    useVideoControls();
  return (
    <div
      className={`h-screen bg-black text-foreground overflow-hidden ${className ?? ""}`}
      id={id}
    >
      {showVideoBackground && !backgroundImage && (
        <div className="fixed inset-0 z-0">
          <LocalVideoBackground
            videoSrc={videoConfig.localVideoSrc}
            posterSrc={videoConfig.posterSrc}
            isPaused={isPaused}
            isMuted={isMuted}
            lastPlaybackTime={lastVideoTime}
            setLastPlaybackTime={setLastVideoTime}
            className="video-responsive"
          />
          <div className="absolute inset-0 video-overlay" />
        </div>
      )}
      {backgroundImage && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 video-overlay" />
        </div>
      )}
      {showSidePanels && (
        <>
          <SocialMediaIcons className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-30" />

          {!isInnerPage && (
            <SettingsPanel className="absolute bottom-12 md:bottom-14 left-8 md:left-12" />
          )}
        </>
      )}
      <div
        className={`relative z-20 h-full ${isInnerPage ? "p-8 overflow-y-auto" : "p-4 md:p-8"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
