import React from 'react';
import Spline from '@splinetool/react-spline';

interface SplineBackgroundProps {
  className?: string;
}

function SplineBackground({ className = '' }: SplineBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Spline 
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
}

export default SplineBackground;
