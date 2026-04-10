import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Heart, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PlayerBar = () => {
  const {
    currentSong, isPlaying, progress, duration, volume, isShuffle, isLoop,
    togglePlay, nextSong, previousSong, seekTo, changeVolume, setIsShuffle, setIsLoop
  } = usePlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  if (!currentSong) return null;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${mins}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-40"
      >
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
            {/* Song info */}
            <div className="flex items-center gap-3 w-64 min-w-0">
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/player/${currentSong.youtubeId}`} className="font-medium text-sm hover:underline truncate block">
                  {currentSong.title}
                </Link>
                <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
              </div>
              <button onClick={() => setIsLiked(!isLiked)} className="player-btn">
                <Heart size={18} className={isLiked ? 'fill-purple-500 text-purple-500' : 'text-gray-400'} />
              </button>
            </div>

            {/* Center controls */}
            <div className="flex-1 max-w-md">
              <div className="flex justify-center items-center gap-2 mb-1">
                <button onClick={() => setIsShuffle(!isShuffle)} className={`player-btn ${isShuffle ? 'text-purple-500' : 'text-gray-400'}`}>
                  <Shuffle size={18} />
                </button>
                <button onClick={previousSong} className="player-btn">
                  <SkipBack size={22} />
                </button>
                <button onClick={togglePlay} className="player-btn-primary p-3">
                  {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                </button>
                <button onClick={nextSong} className="player-btn">
                  <SkipForward size={22} />
                </button>
                <button onClick={() => setIsLoop(!isLoop)} className={`player-btn ${isLoop ? 'text-purple-500' : 'text-gray-400'}`}>
                  <Repeat size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-10 text-right">{formatTime(progress)}</span>
                <div className="flex-1 progress-bar group" onClick={handleSeek}>
                  <div className="progress-fill relative" style={{ width: `${(progress / duration) * 100}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 w-32 justify-end">
              <div className="relative">
                <button onClick={() => setIsVolumeOpen(!isVolumeOpen)} className="player-btn">
                  {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                {isVolumeOpen && (
                  <div className="absolute bottom-10 right-0 glass p-3 rounded-xl">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => changeVolume(parseInt(e.target.value))}
                      className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      orientation="vertical"
                    />
                  </div>
                )}
              </div>
              <Link to={`/player/${currentSong.youtubeId}`} className="player-btn hidden sm:flex">
                <Maximize2 size={16} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlayerBar;