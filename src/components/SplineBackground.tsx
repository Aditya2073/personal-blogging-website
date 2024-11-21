import React, { Suspense } from 'react';
const Spline = React.lazy(() => import('@splinetool/react-spline'));

interface SplineBackgroundProps {
  className?: string;
}

function SplineBackground({ className = '' }: SplineBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Suspense fallback={<div className="w-full h-full bg-gray-100 dark:bg-gray-900" />}>
        <Spline 
          scene="https://prod.spline.design/VKFvP3W1J3BYeeh1/scene.splinecode"
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}

export default SplineBackground;
