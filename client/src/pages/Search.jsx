import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Loader, Filter, X } from 'lucide-react';
import axios from 'axios';
import SongCard from '../components/SongCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/youtube/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="input-glass pl-12 pr-10"
            />
            {query && (
              <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <X size={18} className="text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader className="animate-spin" size={20} /> : 'Search'}
          </button>
        </form>
      </motion.div>

      {results.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{results.length} results</p>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded-full text-xs ${filter === 'all' ? 'bg-purple-500' : 'bg-white/10'}`} onClick={() => setFilter('all')}>All</button>
              <button className={`px-3 py-1 rounded-full text-xs ${filter === 'songs' ? 'bg-purple-500' : 'bg-white/10'}`} onClick={() => setFilter('songs')}>Songs</button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {results.map((song, idx) => (
              <SongCard key={song.youtubeId} song={song} index={idx} />
            ))}
          </motion.div>
        </>
      )}

      {query && !loading && results.length === 0 && (
        <div className="text-center py-16 glass-card">
          <SearchIcon size={48} className="mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400">No results found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-1">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  );
};

export default Search;