import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import AdminPanel from './components/AdminPanel';
import About from './components/About';
import Newsletter from './components/Newsletter';
import NewsletterManager from './components/NewsletterManager';
import ConfirmSubscription from './components/ConfirmSubscription';
import Login from './components/Login';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/patterns.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen text-gray-900 dark:text-white transition-colors flex flex-col">
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/newsletter" element={<NewsletterManager />} />
              <Route path="/about" element={<About />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/confirm-subscription" element={<ConfirmSubscription />} />
              <Route path="/login" element={<Login />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;