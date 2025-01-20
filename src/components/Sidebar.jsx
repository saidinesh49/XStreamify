import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlaySquare, MessageSquare, Settings, Heart, Users, Trophy } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: PlaySquare, label: 'Videos', path: '/videos' },
  { icon: MessageSquare, label: 'Tweets', path: '/tweets' },
  { icon: Heart, label: 'Favorites', path: '/favorites' },
  { icon: Users, label: 'Following', path: '/following' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-surface-900 shadow-lg dark:shadow-surface-900/50 transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-20'
    } ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-surface-100 dark:border-surface-800">
          <h1 className={`font-semibold text-surface-800 dark:text-white ${isOpen ? 'text-xl' : 'text-center text-sm'}`}>
            {isOpen ? 'Peaceful UI' : 'PUI'}
          </h1>
        </div>
        <nav className="flex-1 pt-4 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-surface-600 dark:text-surface-300 
                hover:bg-surface-50 dark:hover:bg-surface-800 
                hover:text-primary-600 dark:hover:text-primary-400 
                transition-colors relative group
                ${isActive ? 'bg-surface-50 dark:bg-surface-800 text-primary-600 dark:text-primary-400' : ''}
              `}
            >
              <item.icon className={`w-6 h-6 shrink-0 ${isOpen ? '' : 'mx-auto'}`} />
              {isOpen && <span className="ml-4 truncate">{item.label}</span>}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full transition-opacity duration-300 ${({ isActive }) => isActive ? 'opacity-100' : 'opacity-0'}`} />
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
