
import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { Button } from './ui/button';

const AudioPlayer = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize SoundCloud Widget API using HTTPS
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const widget = SC.Widget('soundcloud-player');
      
      widget.bind(SC.Widget.Events.READY, () => {
        console.log('SoundCloud player is ready');
        widget.setVolume(100);
      });

      widget.bind(SC.Widget.Events.PLAY, () => {
        console.log('Started playing');
        setIsPlaying(true);
      });

      widget.bind(SC.Widget.Events.ERROR, () => {
        console.error('SoundCloud player error occurred');
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleMuteToggle = () => {
    const widget = SC.Widget('soundcloud-player');
    setIsMuted(!isMuted);
    widget.setVolume(isMuted ? 100 : 0);
  };

  const handlePlayClick = () => {
    const widget = SC.Widget('soundcloud-player');
    widget.play();
  };

  return (
    <>
      {!isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayClick}
            className="w-32 h-32 rounded-full bg-primary/10 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300 hover:scale-110"
          >
            <Play className="h-16 w-16 text-primary" />
          </Button>
        </div>
      )}
      
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleMuteToggle}
          className="bg-primary/10 backdrop-blur-sm hover:bg-primary/20"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-primary" />
          ) : (
            <Volume2 className="h-5 w-5 text-primary" />
          )}
        </Button>
      </div>

      <div className="fixed top-4 right-4 z-40 invisible">
        <iframe 
          id="soundcloud-player"
          width="300" 
          height="80" 
          scrolling="no" 
          frameBorder="no" 
          allow="autoplay" 
          className="rounded-lg shadow-lg"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1470306682&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
        />
      </div>
    </>
  );
};

export default AudioPlayer;
