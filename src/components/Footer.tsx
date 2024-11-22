import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0a0b14] border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              A personal blog sharing insights and experiences in software development,
              technology, and programming best practices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Aditya2073"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/aditya-rasal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com/AdityaRasal8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:adirasal2003@gmail.com"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            {currentYear} Aditya Rasal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
