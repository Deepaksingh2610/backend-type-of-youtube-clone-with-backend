import React from 'react';
import { Home, Download, History, ThumbsUp, PlaySquare, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-accent text-black font-bold' : 'hover:bg-secondary text-gray-400 hover:text-white'
    }`}
  >
    <Icon className="w-6 h-6" />
    <span className="hidden lg:block">{label}</span>
  </Link>
);

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-background border-r border-secondary p-2 z-40 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } lg:w-64`}
    >
      <div className="flex flex-col gap-2">
        <SidebarItem icon={Home} label="Home" to="/" active={location.pathname === '/'} />
        <SidebarItem icon={Download} label="Downloads" to="/downloads" active={location.pathname === '/downloads'} />
        <SidebarItem icon={History} label="History" to="/history" active={location.pathname === '/history'} />
        <SidebarItem icon={ThumbsUp} label="Liked Videos" to="/liked" active={location.pathname === '/liked'} />
        <SidebarItem icon={PlaySquare} label="Your Content" to={user ? `/c/${user.username}` : '#'} active={location.pathname === `/c/${user?.username}`} />
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
      </div>
    </aside>
  );
};

export default Sidebar;
