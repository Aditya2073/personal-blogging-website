import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const { darkMode, toggleDarkMode } = React.useContext(ThemeContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/newsletter', label: 'Newsletter' }
  ];

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav 
      initial={false}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0
      }}
      transition={{ duration: 0.2 }}
      className={`fixed w-full top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0a0b14]/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-colors ${
        isMenuOpen ? 'bg-white dark:bg-[#0a0b14]' : ''
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-glow bg-clip-text text-transparent hover:opacity-90 transition-opacity"
          >
            Aditya Rasal
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative py-1 px-2 transition-colors ${
                  isActive(path)
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'hover:text-blue-500 dark:hover:text-blue-400'
                } hover:animate-float`}
              >
                {label}
                {isActive(path) && (
                  <motion.span 
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                  />
                )}
              </Link>
            ))}
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group animate-fade-in"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                {darkMode ? (
                  <Sun size={20} className="text-amber-500 hover:text-amber-400 transition-colors" />
                ) : (
                  <Moon size={20} className="text-blue-500 hover:text-blue-400 transition-colors" />
                )}
              </motion.div>
            </button>
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun size={20} className="text-amber-500" />
              ) : (
                <Moon size={20} className="text-blue-500" />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <motion.div
                animate={isMenuOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 90 },
                  closed: { rotate: 0 }
                }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <X size={24} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu size={24} className="text-gray-600 dark:text-gray-300" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4"
            >
              <motion.div 
                className="flex flex-col space-y-2 py-4"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 }
                  }
                }}
              >
                {navLinks.map(({ path, label }) => (
                  <motion.div
                    key={path}
                    variants={{
                      open: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          y: { stiffness: 1000, velocity: -100 }
                        }
                      },
                      closed: {
                        y: 50,
                        opacity: 0,
                        transition: {
                          y: { stiffness: 1000 }
                        }
                      }
                    }}
                  >
                    <Link
                      to={path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3 px-4 rounded-lg transition-colors ${
                        isActive(path)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;