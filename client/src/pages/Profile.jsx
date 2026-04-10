import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import PlaylistCard from '../components/PlaylistCard';
import { User, Mail, Calendar, Plus, Music, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user, token } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/playlists`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlaylists(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlaylists();
  }, [token]);

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/playlists`, {
        name: newPlaylistName,
        description: '',
        isPublic: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists([...playlists, response.data]);
      setNewPlaylistName('');
      setShowCreateModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-6 flex-wrap">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
            <User size={48} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{user?.username}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-400">
              <span className="flex items-center gap-1 text-sm"><Mail size={16} /> {user?.email}</span>
              <span className="flex items-center gap-1 text-sm"><Calendar size={16} /> Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
            <button className="mt-3 text-sm text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
              <Edit2 size={14} /> Edit profile
            </button>
          </div>
        </div>
      </motion.div>

      {/* Playlists Section */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Music size={24} className="text-purple-400" /> Your Playlists
        </h2>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Music size={48} className="mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400">No playlists yet</p>
          <button onClick={() => setShowCreateModal(true)} className="mt-4 text-purple-400">Create your first playlist</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist, idx) => (
            <PlaylistCard key={playlist._id} playlist={playlist} index={idx} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="input-glass mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg hover:bg-white/10 transition">
                Cancel
              </button>
              <button onClick={createPlaylist} className="btn-primary px-5 py-2">
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;