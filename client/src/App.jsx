import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import Navbar from './components/Navbar'   // ✅ ADD THIS
import Home from './pages/Home'
import Search from './pages/Search'
import PlaylistPage from './pages/PlaylistPage'
import PlayerView from './pages/PlayerView'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import Library from './pages/Library'
import { useAuth } from './context/AuthContext'
import { AnimatePresence } from 'framer-motion'

function App() {
  const { token, loading } = useAuth()

  // 🔄 Loading Screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // 🔐 Auth Routes
  if (!token) {
    return (
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </AnimatePresence>
    )
  }

  // 🎧 Main App Layout
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      {/* ✅ TOP NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden pt-16 md:pt-20">
        
        {/* SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-32 md:ml-64">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />
              <Route path="/player/:songId" element={<PlayerView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>

      {/* PLAYER BAR */}
      <PlayerBar />
    </div>
  )
}

export default App