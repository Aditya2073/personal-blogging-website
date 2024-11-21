import React, { useEffect, useState } from 'react';

interface SplineBackgroundProps {
  className?: string;
}

function SplineBackground({ className = '' }: SplineBackgroundProps) {
  const [Spline, setSpline] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    
    console.log = (...args) => {
      if (!args[0]?.type?.includes('Particle')) {
        originalConsoleLog(...args);
      }
    };

    console.warn = (...args) => {
      if (!args[0]?.includes('splinecode file')) {
        originalConsoleWarn(...args);
      }
    };

    const loadSpline = async () => {
      try {
        const module = await import('@splinetool/react-spline');
        setSpline(() => module.default);
      } catch (err) {
        console.error('Failed to load Spline:', err);
        setError('Failed to load 3D animation');
      }
    };

    loadSpline();

    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
    };
  }, []);

  const onLoad = () => {
    setIsLoading(false);
    console.log('Spline scene loaded');
  };

  const onError = () => {
    setError('Failed to load 3D animation');
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
          {error}
        </div>
      </div>
    );
  }

  if (!Spline || isLoading) {
    return (
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`} style={{ height: '100vh' }}>
      <Spline 
        scene="https://prod.spline.design/VKFvP3W1J3BYeeh1/scene.splinecode"
        style={{ 
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
}

export default SplineBackground;
