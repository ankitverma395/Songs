import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Library, User, BarChart3, LogOut, Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/library', icon: Library, label: 'Your Library' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-64 glass-sidebar z-30 hidden md:flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            MusicStream
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''}`
            }
          >
            <item.icon size={22} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-gray-400 truncate">Free Plan</p>
          </div>
        </div>
        <button onClick={logout} className="nav-item w-full justify-center text-red-400 hover:bg-red-500/10">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;