import React from 'react';

interface SplineBackgroundProps {
  className?: string;
}

function SplineBackground({ className = '' }: SplineBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`} style={{ height: '100vh' }}>
      <iframe 
        src='https://my.spline.design/particlenebula-df7d8e8275cd2d9a53ac21e9c4d78b8c/'
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          backgroundColor: 'transparent'
        }}
        title="Particle Nebula Background"
        loading="lazy"
      />
    </div>
  );
}

export default SplineBackground;
