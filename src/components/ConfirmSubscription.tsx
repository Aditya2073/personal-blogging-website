import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ConfirmSubscription = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/subscribers/confirm/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to confirm subscription');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to confirm subscription');
      }
    };

    confirmToken();
  }, [searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {status === 'confirming' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Confirming Subscription
            </h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Subscription Confirmed!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{message}</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-6 text-green-500 text-6xl"
            >
              ✓
            </motion.div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Oops!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{message}</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-6 text-red-500 text-6xl"
            >
              ✕
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ConfirmSubscription;
