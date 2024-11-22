import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import About from './components/About';
import Newsletter from './components/Newsletter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0b14] text-gray-900 dark:text-gray-100 transition-colors">
          <Navbar />
          <main className="flex-grow pt-20 pb-16">
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;