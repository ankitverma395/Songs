import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useState } from 'react';

const SongCard = ({ song, index, showPlaylistActions = false }) => {
  const { playSong, queue } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = () => {
    if (!queue.find(s => s.youtubeId === song.youtubeId)) {
      playSong(song, [song]);
    } else {
      playSong(song, queue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.05 }}
      className="song-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full aspect-square rounded-lg object-cover shadow-md"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center gap-3"
        >
          <button onClick={handlePlay} className="player-btn-primary p-3">
            <Play size={24} className="ml-0.5" />
          </button>
          <button className="player-btn">
            <Heart size={20} />
          </button>
          {showPlaylistActions && (
            <button className="player-btn">
              <MoreHorizontal size={20} />
            </button>
          )}
        </motion.div>
      </div>
      <div className="mt-2">
        <h3 className="font-semibold text-sm truncate">{song.title}</h3>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>
    </motion.div>
  );
};

export default SongCard;