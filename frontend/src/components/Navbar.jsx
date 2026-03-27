import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const Navbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchNotificationCount = async () => {
      try {
        const response = await axiosInstance.get('/notifications');
        if (response.data.success && Array.isArray(response.data.data)) {
          const count = response.data.data.filter(n => !n.isRead).length;
          setUnreadCount(count);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000);
    
    const handleReadEvent = () => setUnreadCount(0);
    window.addEventListener('notificationsRead', handleReadEvent);
    
    return () => {
        clearInterval(interval);
        window.removeEventListener('notificationsRead', handleReadEvent);
    };
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-secondary flex items-center justify-between px-4 z-50">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-secondary rounded-full lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <div onClick={() => navigate('/')} className="flex items-center gap-1 cursor-pointer">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-background text-xl">V</div>
          <span className="font-bold text-xl hidden sm:block">videoadda</span>
        </div>
      </div>

      {/* Center */}
      <div className="flex-1 max-w-2xl px-4">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border border-transparent focus:border-accent rounded-full py-2 pl-4 pr-10 outline-none transition-all placeholder:text-gray-500"
          />
          <button type="submit" className="absolute right-3 top-2.5 group">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-accent hover:text-white transition-colors" />
          </button>
        </form>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={() => navigate('/notifications')}
          className="p-2 hover:bg-secondary rounded-full relative group transition-all"
        >
          <Bell className="w-6 h-6 group-hover:text-accent transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <div className="group relative">
            <div className="w-10 h-10 rounded-full border-2 border-accent p-0.5 cursor-pointer overflow-hidden">
                <img src={user?.avatar} alt={user?.username} className="w-full h-full object-cover rounded-full" />
            </div>
            
            {/* Dropdown */}
            <div className="absolute right-0 top-12 w-48 bg-secondary border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="font-bold truncate text-sm">{user?.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">@{user?.username}</p>
                </div>
                <button 
                  onClick={() => navigate(`/c/${user?.username}`)}
                  className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-sm transition-all"
                >
                  My Channel
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-3 py-2 hover:bg-red-500/10 text-red-500 rounded-lg text-sm transition-all mt-1"
                >
                  Sign Out
                </button>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
