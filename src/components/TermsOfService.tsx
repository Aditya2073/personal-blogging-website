import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Aditya's Blogs</title>
        <meta name="description" content="Terms of Service for Aditya's Blogs - Read our terms and conditions of use." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-[#0a0b14] py-16 px-4"
      >
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using Aditya's Blogs ("the Website"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Intellectual Property Rights</h2>
            <p>
              Other than the content you own, under these Terms, Aditya's Blogs and/or its licensors own all the intellectual property rights and materials contained in this Website.
            </p>
            <p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Restrictions</h2>
            <p>You are specifically restricted from all of the following:</p>
            <ul>
              <li>Publishing any Website material in any other media</li>
              <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
              <li>Publicly performing and/or showing any Website material</li>
              <li>Using this Website in any way that is or may be damaging to this Website</li>
              <li>Using this Website in any way that impacts user access to this Website</li>
              <li>Using this Website contrary to applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
            <p>
              In these Terms of Service, "User Content" shall mean any audio, video, text, images, or other material you choose to submit to this Website. By submitting User Content, you grant Aditya's Blogs a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Acceptable Use</h2>
            <p>You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Website.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Indemnification</h2>
            <p>
              You agree to indemnify and hold Aditya's Blogs harmless from any demands, loss, liability, claims, or expenses made against them by any third party due to or arising out of your use of the Website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Variation of Terms</h2>
            <p>
              Aditya's Blogs is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms regularly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law & Jurisdiction</h2>
            <p>
              These Terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:adityarasal2073@gmail.com" className="text-blue-600 dark:text-blue-400">
                adityarasal2073@gmail.com
              </a>
            </p>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default TermsOfService;
