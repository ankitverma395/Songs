import { createContext, useContext, useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const onReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    if (isPlaying) playerRef.current.playVideo();
  };

  const onStateChange = (event) => {
    if (event.data === 1) {
      // playing
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const current = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          setProgress(current);
          setDuration(dur);
        }
      }, 1000);
    } else if (event.data === 2) {
      // paused
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else if (event.data === 0) {
      // ended
      nextSong();
    }
  };

  const playSong = (song, newQueue = null) => {
    if (newQueue) setQueue(newQueue);
    setCurrentSong(song);
    setIsPlaying(true);
    if (playerRef.current) {
      playerRef.current.loadVideoById(song.youtubeId);
      playerRef.current.playVideo();
    }
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    if (queue.length === 0) return;
    let currentIndex = queue.findIndex(s => s.youtubeId === currentSong?.youtubeId);
    if (currentIndex === -1) currentIndex = 0;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      if (isLoop) nextIndex = 0;
      else return;
    }
    playSong(queue[nextIndex], queue);
  };

  const previousSong = () => {
    if (queue.length === 0) return;
    let currentIndex = queue.findIndex(s => s.youtubeId === currentSong?.youtubeId);
    if (currentIndex === -1) currentIndex = 0;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) return;
    playSong(queue[prevIndex], queue);
  };

  const seekTo = (seconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
      setProgress(seconds);
    }
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    if (playerRef.current) playerRef.current.setVolume(newVolume);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentSong, queue, isPlaying, progress, duration, volume, isShuffle, isLoop,
      playSong, togglePlay, nextSong, previousSong, seekTo, changeVolume,
      setIsShuffle, setIsLoop, onReady, onStateChange, playerRef
    }}>
      {children}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <YouTube
              videoId={currentSong.youtubeId}
              opts={{
                width: '0',
                height: '0',
                playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0 }
              }}
              onReady={onReady}
              onStateChange={onStateChange}
              className="hidden"
            />
          </div>
        </div>
      )}
    </PlayerContext.Provider>
  );
};