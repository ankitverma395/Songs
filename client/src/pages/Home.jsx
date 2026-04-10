import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import axios from 'axios';
import { Clock, TrendingUp, Music, Play, Heart, ChevronRight } from 'lucide-react';
import SongCard from '../components/SongCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [dailyMixes, setDailyMixes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 infinite scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const { user } = useAuth();
  const { playSong } = usePlayer();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (page > 1) loadMoreTrending();
  }, [page]);

  const fetchInitialData = async () => {
    try {
      const [trendingRes, recRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/youtube/trending?page=1`),
        axios.get(`${import.meta.env.VITE_API_URL}/youtube/search?q=popular music&page=1`)
      ]);

      // ✅ FIXED (important)
      setTrending(trendingRes.data.songs);
      setRecommendations(recRes.data.songs.slice(0, 10));
      setHasMore(trendingRes.data.hasMore);

      // Daily mixes
      const mixes = trendingRes.data.songs.slice(0, 6).map((song, idx) => ({
        id: idx,
        name: `Daily Mix ${idx + 1}`,
        description: `${song.artist} and more`,
        songs: [song],
        image: song.thumbnail
      }));
      setDailyMixes(mixes);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Load more trending (infinite scroll)
  const loadMoreTrending = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/youtube/trending?page=${page}`
      );

      setTrending(prev => [...prev, ...res.data.songs]);
      setHasMore(res.data.hasMore);

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 observer (no UI change)
  const lastSongRef = (node) => {
    if (!hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-10 pb-32">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 md:h-80 rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}, {user?.username}!
          </h1>
          <p className="text-base md:text-lg opacity-90">
            Discover new music and enjoy your favorite tracks
          </p>
        </div>
      </motion.div>

      {/* Made For You */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Made For You</h2>
          <button className="text-sm text-purple-400 flex items-center gap-1 hover:gap-2 transition-all">
            Show all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dailyMixes.map((mix, idx) => (
            <SongCard key={mix.id} song={mix.songs[0]} index={idx} />
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp size={24} className="text-purple-400" /> Trending Now
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trending.map((song, idx) => {
            // 👇 attach observer only to LAST item
            if (trending.length === idx + 1) {
              return (
                <div ref={lastSongRef} key={song.youtubeId}>
                  <SongCard song={song} index={idx} />
                </div>
              );
            }

            return (
              <SongCard key={song.youtubeId} song={song} index={idx} />
            );
          })}
        </div>
      </section>

      {/* Recommended */}
      <section>
        <h2 className="text-2xl font-bold mb-5">Recommended For You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recommendations.slice(0, 6).map((song, idx) => (
            <SongCard key={song.youtubeId} song={song} index={idx} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;