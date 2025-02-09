
import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const AudioPlayer = () => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize SoundCloud Widget API
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const widget = SC.Widget('soundcloud-player');
      
      widget.bind(SC.Widget.Events.READY, () => {
        console.log('SoundCloud player is ready');
        widget.setVolume(100);
        widget.play();
      });

      widget.bind(SC.Widget.Events.PLAY, () => {
        console.log('Started playing');
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

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleMuteToggle}
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
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
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1470306682&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
        />
      </div>
    </>
  );
};

export default AudioPlayer;
