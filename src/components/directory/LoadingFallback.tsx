import { useState, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';

export function LoadingFallback() {
  const [showLoading, setShowLoading] = useState(true);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime.current;
      const remainingTime = Math.max(0, 2000 - elapsed);
      
      setTimeout(() => {
        setShowLoading(false);
      }, remainingTime);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!showLoading) return null;

  return (
    <Html center>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </Html>
  );
}
