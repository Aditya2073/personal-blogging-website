import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { darkMode } = React.useContext(ThemeContext);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookieConsent');
    
    // If no consent is stored, show the banner
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} shadow-lg`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Cookie className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <p className={`text-gray-600 ${darkMode ? 'text-gray-300' : ''}`}>
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDecline}
                className={`px-4 py-2 text-gray-600 ${darkMode ? 'text-gray-300' : ''} hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} rounded-lg transition-colors`}
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => setShowConsent(false)}
                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} rounded-lg transition-colors sm:hidden`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
