import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Aditya's Blog</title>
        <meta name="description" content="Privacy policy and data handling practices for Aditya's technical blog." />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Aditya's Blog. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Comments on blog posts</li>
              <li>Newsletter subscriptions</li>
              <li>Contact form submissions</li>
              <li>Social media interactions</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Page visit timestamps</li>
              <li>Page view statistics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Improve our website content and user experience</li>
              <li>Respond to your comments and questions</li>
              <li>Send newsletters and updates (with your consent)</li>
              <li>Analyze website traffic and performance</li>
              <li>Prevent spam and abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience. These include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Essential cookies for website functionality</li>
              <li>Analytics cookies to understand user behavior</li>
              <li>Preference cookies to remember your settings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Google Analytics for website analytics</li>
              <li>Google AdSense for advertising</li>
              <li>Netlify for website hosting</li>
              <li>GitHub for code repository hosting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Object to data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:adirasal2003@gmail.com" className="text-blue-500 hover:text-blue-600">
                adirasal2003@gmail.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </motion.div>
    </>
  );
}

export default PrivacyPolicy;
