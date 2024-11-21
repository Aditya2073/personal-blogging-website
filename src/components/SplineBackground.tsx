import React, { useEffect, useRef, useState } from 'react';

interface SplineBackgroundProps {
  className?: string;
}

function SplineBackground({ className = '' }: SplineBackgroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      console.log('Background iframe loaded');
      setIsLoaded(true);
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`} style={{ zIndex: -1 }}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-900/50 dark:to-gray-800/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      <iframe 
        ref={iframeRef}
        src="https://my.spline.design/particlenebula-df7d8e8275cd2d9a53ac21e9c4d78b8c/"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          backgroundColor: 'transparent',
          transform: 'scale(1.2)',
          opacity: isLoaded ? 0.4 : 0,
          transition: 'opacity 0.5s ease-in-out',
          willChange: 'transform, opacity'
        }}
        title="Particle Nebula Background"
        loading="eager"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

export default SplineBackground;
