import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';

function Navbar() {
  const { darkMode, toggleDarkMode } = React.useContext(ThemeContext);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0a0b14]/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-colors animate-slide-down">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-glow bg-clip-text text-transparent hover:opacity-90 transition-opacity"
          >
            Aditya Rasal
          </Link>
          
          <div className="flex items-center space-x-8">
            {[
              { path: '/', label: 'Blog' },
              { path: '/about', label: 'About' },
              { path: '/newsletter', label: 'Newsletter' }
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative py-1 transition-colors ${
                  isActive(path)
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'hover:text-blue-500 dark:hover:text-blue-400'
                } hover:animate-float ${
                  location.pathname === path ? 'text-blue-500 dark:text-blue-400' : ''
                }`}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                )}
              </Link>
            ))}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group animate-fade-in"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun size={20} className="text-amber-500 hover:text-amber-400 transition-colors animate-scale-up" />
              ) : (
                <Moon size={20} className="text-blue-500 hover:text-blue-400 transition-colors animate-scale-up" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;