import { motion } from 'framer-motion';
import { Music, Users, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

const PlaylistCard = ({ playlist, index }) => {
  const { playSong } = usePlayer();
  const gradientColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
  ];
  const gradient = gradientColors[index % gradientColors.length];

  const handlePlayAll = (e) => {
    e.preventDefault();
    if (playlist.songs?.length) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: (index || 0) * 0.05 }}
      className="song-card group"
    >
      <Link to={`/playlist/${playlist._id}`}>
        <div className="relative">
          <div className={`w-full aspect-square bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-lg`}>
            <Music size={48} className="text-white/80" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center"
          >
            <button onClick={handlePlayAll} className="player-btn-primary p-3">
              <Play size={24} className="ml-0.5" />
            </button>
          </motion.div>
        </div>
        <div className="mt-2">
          <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
          <p className="text-xs text-gray-400">{playlist.songs?.length || 0} songs</p>
          {playlist.isPublic && <Users size={12} className="text-gray-400 mt-1" />}
        </div>
      </Link>
    </motion.div>
  );
};

export default PlaylistCard;