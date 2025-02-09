
interface SoundCloudWidget {
  Events: {
    READY: string;
    PLAY: string;
    PAUSE: string;
    FINISH: string;
    LOAD_PROGRESS: string;
    PLAY_PROGRESS: string;
    ERROR: string;
  };
  Widget: (iframe: string | HTMLIFrameElement) => {
    bind: (event: string, callback: () => void) => void;
    unbind: (event: string) => void;
    load: (url: string, options?: object) => void;
    play: () => void;
    pause: () => void;
    toggle: () => void;
    seekTo: (milliseconds: number) => void;
    setVolume: (volume: number) => void;
    getVolume: (callback: (volume: number) => void) => void;
    getCurrentSound: (callback: (sound: object) => void) => void;
    getDuration: (callback: (duration: number) => void) => void;
    getCurrentPosition: (callback: (position: number) => void) => void;
    setColor: (color: string) => void;
  };
}

declare const SC: SoundCloudWidget;
