
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

  const updateMuteState = () => {
    const widget = SC.Widget('soundcloud-player');
    widget.getVolume((volume: number) => {
      widget.setVolume(isMuted ? 0 : 100);
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    updateMuteState();
  };

  return (
    <>
      <iframe
        id="soundcloud-player"
        title="SoundCloud Player"
        width="0"
        height="0"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1519010947&auto_play=true&show_artwork=false&show_comments=false&show_user=false&show_reposts=false&visual=false"
      />
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50"
        onClick={toggleMute}
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6 text-primary" />
        ) : (
          <Volume2 className="h-6 w-6 text-primary" />
        )}
      </Button>
    </>
  );
};

export default AudioPlayer;
