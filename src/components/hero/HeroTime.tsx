import React, { useState, useEffect } from 'react';

export const HeroTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="absolute bottom-8 right-8 text-right z-20">
      <div className="text-2xl font-semibold text-white">
        {formatTime(currentTime)}
      </div>
      <div className="text-sm text-white">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};
