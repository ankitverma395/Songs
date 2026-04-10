import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Music } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const PlaylistPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const { token } = useAuth();
  const { playSong } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/playlists/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlaylist(response.data);
      } catch (error) {
        console.error('Error fetching playlist:', error);
        navigate('/profile');
      }
    };
    fetchPlaylist();
  }, [id, token, navigate]);

  const handlePlayAll = () => {
    if (playlist?.songs?.length) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  if (!playlist) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="glass-card p-6 flex flex-col md:flex-row gap-6">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
          <Music size={64} className="text-white/80" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-gray-400 mb-4">{playlist.description || 'No description'}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayAll}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-2 hover:opacity-90"
            >
              <Play size={18} /> Play All
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-4">Songs</h2>
        {playlist.songs?.length === 0 && (
          <p className="text-gray-400 text-center py-8">No songs in this playlist yet.</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlist.songs?.map((song, idx) => (
            <SongCard key={song._id} song={song} index={idx} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistPage;