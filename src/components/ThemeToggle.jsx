import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-surface-600 dark:text-surface-400" />
      ) : (
        <Sun className="w-5 h-5 text-surface-400" />
      )}
    </button>
  );
}