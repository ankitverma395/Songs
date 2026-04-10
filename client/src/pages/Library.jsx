import { motion } from 'framer-motion';
import { Music, Heart, Clock } from 'lucide-react';

const Library = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Your Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <Heart size={40} className="mx-auto text-purple-400 mb-3" />
          <h3 className="font-semibold">Liked Songs</h3>
          <p className="text-sm text-gray-400">Songs you've liked</p>
        </div>
        <div className="glass-card p-6 text-center">
          <Music size={40} className="mx-auto text-purple-400 mb-3" />
          <h3 className="font-semibold">Playlists</h3>
          <p className="text-sm text-gray-400">Your custom playlists</p>
        </div>
        <div className="glass-card p-6 text-center">
          <Clock size={40} className="mx-auto text-purple-400 mb-3" />
          <h3 className="font-semibold">Recently Played</h3>
          <p className="text-sm text-gray-400">Continue listening</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Library;