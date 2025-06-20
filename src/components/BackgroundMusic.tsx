
import React, { useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isMuted, onToggleMute }) => {
  const audioRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Handle mute/unmute functionality
    if (audioRef.current) {
      const iframe = audioRef.current;
      if (isMuted) {
        iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
      } else {
        iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
      }
    }
  }, [isMuted]);

  return (
    <>
      {/* Hidden background music iframe */}
      <iframe
        ref={audioRef}
        className="hidden"
        src={`https://www.youtube.com/embed/OuRvOCf9mJ4?autoplay=${isMuted ? '0' : '1'}&mute=0&loop=1&playlist=OuRvOCf9mJ4&controls=0&showinfo=0&rel=0&iv_load_policy=3`}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
      
      {/* Audio control button */}
      <button
        onClick={onToggleMute}
        className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 hover:bg-amber-500/20 group"
        title={isMuted ? "Unmute background music" : "Mute background music"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-amber-200 group-hover:text-amber-100" />
        ) : (
          <Volume2 className="w-5 h-5 text-amber-200 group-hover:text-amber-100" />
        )}
      </button>
    </>
  );
};

export default BackgroundMusic;
