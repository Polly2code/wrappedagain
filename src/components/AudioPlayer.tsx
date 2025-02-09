
import { useState, useEffect } from 'react';

const AudioPlayer = () => {
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

  return (
    <div className="fixed top-4 right-4 z-50">
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
  );
};

export default AudioPlayer;
