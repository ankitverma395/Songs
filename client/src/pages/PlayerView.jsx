import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Play, Pause } from 'lucide-react';

const PlayerView = () => {
  const { songId } = useParams();
  const { currentSong, playSong, queue, isPlaying, togglePlay, progress, duration, seekTo } = usePlayer();
  const [song, setSong] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const found = queue.find(s => s.youtubeId === songId) || currentSong;
    if (found && (!currentSong || found.youtubeId !== currentSong.youtubeId)) {
      playSong(found, queue);
    }
    setSong(found);
  }, [songId, queue, currentSong, playSong]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seekTo(percentage * duration);
  };

  if (!song) return <div className="text-center py-12">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-400">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="glass-card p-8 text-center">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-64 h-64 rounded-2xl mx-auto mb-6 shadow-2xl"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
        />
        <h1 className="text-2xl font-bold mb-2">{song.title}</h1>
        <p className="text-gray-400 mb-6">{song.artist}</p>

        <div className="space-y-4">
          <div className="flex justify-center gap-6">
            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20">
              <Heart size={24} />
            </button>
            <button onClick={togglePlay} className="p-4 rounded-full bg-purple-500 hover:bg-purple-600">
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20">
              <Share2 size={24} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="progress-bar" onClick={handleSeek}>
              <div className="progress-fill" style={{ width: `${(progress / duration) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerView;