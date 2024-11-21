import React, { useEffect, useState } from 'react';

interface SplineBackgroundProps {
  className?: string;
}

function SplineBackground({ className = '' }: SplineBackgroundProps) {
  const [Spline, setSpline] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Temporarily suppress console logs from Spline
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      if (!args[0]?.type?.includes('Particle')) {
        originalConsoleLog(...args);
      }
    };

    import('@splinetool/react-spline')
      .then((module) => {
        setSpline(() => module.default);
      })
      .catch((err) => {
        console.error('Failed to load Spline:', err);
        setError('Failed to load 3D animation');
      });

    // Cleanup function to restore console.log
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  const onLoad = () => {
    // Optional: Add any initialization logic here
  };

  if (error) {
    return (
      <div className={`fixed inset-0 -z-10 bg-gray-100 dark:bg-gray-900 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
          {error}
        </div>
      </div>
    );
  }

  if (!Spline) {
    return (
      <div className={`fixed inset-0 -z-10 bg-gray-100 dark:bg-gray-900 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Spline 
        scene="https://prod.spline.design/VKFvP3W1J3BYeeh1/scene.splinecode"
        className="w-full h-full"
        onLoad={onLoad}
      />
    </div>
  );
}

export default SplineBackground;
