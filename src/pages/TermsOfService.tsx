import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Aditya's Blog</title>
        <meta name="description" content="Terms of service and usage conditions for Aditya's technical blog." />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Terms of Service
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Permission is granted to temporarily download one copy of the materials (information or software) on Aditya's Blog for personal, non-commercial transitory viewing only.
              </li>
              <li>
                This is the grant of a license, not a transfer of title, and under this license you may not:
                <ul className="list-disc pl-6 mt-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                The materials on this website are provided on an 'as is' basis.
              </li>
              <li>
                No warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </li>
              <li>
                Does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on the website or otherwise relating to such materials or on any sites linked to this site.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
            <p>
              In no event shall Aditya's Blog or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on this website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the website are accurate, complete, or current.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
            <p>
              We have not reviewed all of the sites linked to this website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
            <p>
              We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:{' '}
              <a href="mailto:adirasal2003@gmail.com" className="text-blue-500 hover:text-blue-600">
                adirasal2003@gmail.com
              </a>
            </p>
          </section>
        </div>
      </motion.div>
    </>
  );
}

export default TermsOfService;
